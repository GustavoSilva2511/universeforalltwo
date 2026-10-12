import { parseCredit, stripHtml } from "../../utils/html.js";

// Mapeamento da nova API oficial do APOD (apod-basic):
// GET /apod-basic/{YYMMDD} — ex.: 2026-10-11 vira "261011".
// Diferenças p/ a API legada: `url` é o permalink do artigo (não a imagem),
// a imagem full é `hdurl`, `explanation` vem em HTML e vídeos/iframes trazem
// o embed dentro de `basic_html`.

const PLACEHOLDER_TITLE = "NASA Science";
const PLACEHOLDER_URL_MARKER = "nasa-logo";

export function toLegacyDateCode(isoDate) {
  return isoDate.slice(2).replaceAll("-", "");
}

export function isPlaceholderEntry(data) {
  if (!data) return true;
  const url = data.url ?? "";
  const hdurl = data.hdurl ?? "";
  return (
    url.includes(PLACEHOLDER_URL_MARKER) ||
    hdurl.includes(PLACEHOLDER_URL_MARKER) ||
    data.title === PLACEHOLDER_TITLE
  );
}

function extractIframeSrc(basicHtml) {
  const match = /<iframe[^>]+src="([^"]+)"/i.exec(basicHtml ?? "");
  if (!match) return "";
  const src = match[1];
  return src.startsWith("//") ? `https:${src}` : src;
}

export function normalizeApodEntry(data, fallbackDate) {
  const mediaType = data.media_type ?? "image";
  const isVideoLike = mediaType === "video" || mediaType === "iframe";

  const url = isVideoLike
    ? extractIframeSrc(data.basic_html) || data.hdurl || ""
    : data.hdurl || "";

  const { text: credit, url: creditUrl } = parseCredit(data.credit || data.copyright || "");

  return {
    title: data.title ?? "",
    explanation: stripHtml(data.explanation),
    url,
    mediaType: isVideoLike ? "video" : "image",
    alt: data.alt || data.title || "NASA astronomy picture of the day",
    credit,
    creditUrl,
    date: data.date ?? fallbackDate,
  };
}
