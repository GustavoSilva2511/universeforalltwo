export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// "2026-10-11" -> "October 11, 2026" (UTC para não deslocar o dia).
export function toDisplayDate(isoDate) {
  if (!isoDate) return "";
  const dt = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(dt.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(dt);
}
