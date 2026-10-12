const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

// Remove tags HTML e decodifica entities (a nova API retorna explanation em HTML).
export function stripHtml(html) {
  if (!html) return "";
  const withoutTags = String(html).replace(/<[^>]*>/g, " ");
  const decoded = withoutTags
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
  return decoded.replace(/\s+/g, " ").trim();
}

// Extrai o primeiro link e o texto puro de um crédito que pode vir em HTML
// (ex.: '<a href="https://...">Tom Williams</a>' -> { text: "Tom Williams", url: "https://..." }).
// Só aceita http(s) para evitar javascript: e afins. Sem link, url é "".
export function parseCredit(html) {
  if (!html) return { text: "", url: "" };
  const raw = String(html);
  const hrefMatch = /<a[^>]+href=["']([^"']+)["']/i.exec(raw);
  const url =
    hrefMatch && /^https?:\/\//i.test(hrefMatch[1]) ? hrefMatch[1] : "";
  return { text: stripHtml(raw), url };
}
