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
