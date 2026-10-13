import { apiClient } from "../../services/apiClient";
import { isPlaceholderEntry, normalizeApodEntry, toLegacyDateCode } from "./apodEntry";

function toErrorMessage(err, date, t) {
  const msg = (key, vars, fallback) => (t ? t(key, vars) : fallback);
  // Erros já tratados passam direto.
  if (err instanceof Error && !err.response && !err.code) return err.message;
  if (err?.response?.status === 404) {
    return msg("errors.notFound", { date }, `NASA has no APOD for ${date}. Choose another date.`);
  }
  const apiMessage = err?.response?.data?.msg || err?.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage.length > 0) return apiMessage;
  if (err?.code === "ECONNABORTED")
    return msg("errors.timeout", undefined, "Request timed out, please try again.");
  return msg("errors.generic", undefined, "Could not load the content, please try again later.");
}

export async function getApodByDate(date, t) {
  const noImage = t
    ? t("errors.noImage")
    : "NASA has no image for this date right now. Try again or choose another date.";
  try {
    const { data } = await apiClient.get(`/apod-basic/${toLegacyDateCode(date)}`);
    const entry = Array.isArray(data) ? data[0] : data;
    if (!entry || isPlaceholderEntry(entry)) {
      throw new Error(noImage);
    }
    const normalized = normalizeApodEntry(entry, date);
    if (!normalized.url) {
      throw new Error(noImage);
    }
    return normalized;
  } catch (err) {
    throw new Error(toErrorMessage(err, date, t));
  }
}
