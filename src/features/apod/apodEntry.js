// Helpers puros (sem dependências) para normalizar a resposta da APOD API.
//
// Contexto: durante a migração do backend da NASA (legacy → science.nasa.gov,
// com arquivamento previsto para 2026-12-01), o endpoint passou a retornar de
// forma intermitente um placeholder ("NASA Science" + logo) no lugar do
// conteúdo real — inclusive para datas recentes. Detectamos isso aqui para
// tratar como erro recuperável em vez de exibir o logo como se fosse a foto.

const PLACEHOLDER_TITLE = "NASA Science";
const PLACEHOLDER_URL_MARKER = "nasa-logo";

export function isPlaceholderEntry(data) {
  if (!data) return true;
  const url = data.url ?? "";
  return url.includes(PLACEHOLDER_URL_MARKER) || data.title === PLACEHOLDER_TITLE;
}

export function normalizeApodEntry(data, fallbackDate) {
  const mediaType = data.media_type ?? "image";
  return {
    title: data.title ?? "",
    explanation: data.explanation ?? "",
    // Para imagens, hdurl tem resolução maior; vídeos usam url (embed).
    url: mediaType === "image" ? (data.hdurl || data.url || "") : (data.url ?? ""),
    mediaType,
    date: data.date ?? fallbackDate,
  };
}
