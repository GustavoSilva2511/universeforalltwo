import { todayISO } from "../../utils/date";

// APOD começou em 16/06/1995 — a API rejeita datas anteriores.
const APOD_MIN_DATE_ISO = "1995-06-16";
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isRealCalendarDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day));
  return dt.getUTCFullYear() === year && dt.getUTCMonth() === month - 1 && dt.getUTCDate() === day;
}

export function isValidApodDate(dateStr) {
  if (!dateStr || !ISO_DATE_REGEX.test(dateStr) || !isRealCalendarDate(dateStr)) {
    return { valid: false, error: "Date not exist, please, put a valid date!" };
  }

  const today = todayISO();

  if (dateStr > today || dateStr < APOD_MIN_DATE_ISO) {
    return { valid: false, error: "Date not exist, please, put a valid date!" };
  }

  return { valid: true, error: "" };
}
