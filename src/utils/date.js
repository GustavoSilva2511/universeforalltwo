export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// "2026-10-11" -> "October 11, 2026" (en) / "11 de outubro de 2026" (pt-BR).
// UTC para não deslocar o dia.
export function toDisplayDate(isoDate, locale = "en") {
  if (!isoDate) return "";
  const dt = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(dt.getTime())) return isoDate;
  return new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(dt);
}
