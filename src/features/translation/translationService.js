import axios from "axios";

const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
// MyMemory aceita max ~500 bytes por `q` — usamos margem segura em chars.
const MAX_CHUNK_CHARS = 450;
const CONCURRENCY = 3;

export class TranslationUnavailableError extends Error {
  constructor(message = "Translation unavailable") {
    super(message);
    this.name = "TranslationUnavailableError";
  }
}

// Quebra por frases sem estourar o limite, preservando a ordem.
export function chunkBySentences(text, maxChars = MAX_CHUNK_CHARS) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const sentences = clean.match(/[^.!?…]+[.!?…]+["”)]*\s*|[^.!?…]+$/g) ?? [clean];
  const chunks = [];
  let current = "";
  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current) chunks.push(current);
    if (sentence.length <= maxChars) {
      current = sentence;
    } else {
      // Frase gigante (raro na NASA): quebra dura por palavras.
      const words = sentence.split(" ");
      current = "";
      for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (next.length <= maxChars) {
          current = next;
        } else {
          if (current) chunks.push(current);
          current = word.slice(0, maxChars);
        }
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateChunk(chunk) {
  const params = { q: chunk, langpair: "en|pt-BR" };
  const email = import.meta.env?.VITE_MYMEMORY_EMAIL;
  if (email) params.de = email;
  let data;
  try {
    ({ data } = await axios.get(MYMEMORY_URL, { params, timeout: 10000 }));
  } catch (err) {
    if (err?.response?.status === 429 || err?.response?.status === 403) {
      throw new TranslationUnavailableError("MyMemory quota/rate limit reached");
    }
    throw new TranslationUnavailableError(err?.message ?? "Translation request failed");
  }
  if (data?.quotaFinished) {
    throw new TranslationUnavailableError("MyMemory daily quota finished");
  }
  const translated = data?.responseData?.translatedText;
  const status = data?.responseStatus;
  if (typeof translated !== "string" || translated.trim() === "" || status === 403) {
    throw new TranslationUnavailableError(data?.responseDetails || "Empty translation response");
  }
  // MyMemory às vezes devolve avisos em MAIÚSCULAS em vez de tradução.
  if (/^(INVALID|YOU USED ALL|MYMEMORY)/i.test(translated.trim())) {
    throw new TranslationUnavailableError(translated.trim());
  }
  return translated;
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;
  const workers = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current], current);
    }
  });
  await Promise.all(workers);
  return results;
}

// Traduz APENAS a explanation (en → pt-BR). Interface isolada para troca
// futura por DeepL/Google Cloud via proxy sem mexer na UI.
export async function translateExplanationEnToPtBR(explanation) {
  const clean = (explanation ?? "").trim();
  if (!clean) return "";
  const chunks = chunkBySentences(clean);
  const translated = await mapWithConcurrency(chunks, CONCURRENCY, translateChunk);
  return translated.join(" ");
}
