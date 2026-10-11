import { apiClient } from "../../services/apiClient";
import { isPlaceholderEntry, normalizeApodEntry, toLegacyDateCode } from "./apodEntry";

function toErrorMessage(err, date) {
  // Erros já tratados passam direto.
  if (err instanceof Error && !err.response && !err.code) return err.message;
  if (err?.response?.status === 404) {
    return `NASA has no APOD for ${date}. Choose another date.`;
  }
  const apiMessage = err?.response?.data?.msg || err?.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage.length > 0) return apiMessage;
  if (err?.code === "ECONNABORTED") return "Request timed out, please try again.";
  return "Could not load the content, please try again later.";
}

export async function getApodByDate(date) {
  try {
    const { data } = await apiClient.get(`/apod-basic/${toLegacyDateCode(date)}`);
    const entry = Array.isArray(data) ? data[0] : data;
    if (!entry || isPlaceholderEntry(entry)) {
      throw new Error("NASA has no image for this date right now. Try again or choose another date.");
    }
    const normalized = normalizeApodEntry(entry, date);
    if (!normalized.url) {
      throw new Error("NASA has no image for this date right now. Try again or choose another date.");
    }
    return normalized;
  } catch (err) {
    throw new Error(toErrorMessage(err, date));
  }
}
