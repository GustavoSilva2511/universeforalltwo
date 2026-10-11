import { apiClient } from "../../services/apiClient";
import { NASA_API_KEY } from "../../constants/config";
import { isPlaceholderEntry, normalizeApodEntry } from "./apodEntry";

function toErrorMessage(err) {
  // Erros já tratados (ex.: placeholder da NASA) passam direto.
  if (err instanceof Error && !err.response && !err.code) return err.message;
  const apiMessage = err?.response?.data?.msg;
  if (typeof apiMessage === "string" && apiMessage.length > 0) return apiMessage;
  if (err?.code === "ECONNABORTED") return "Request timed out, please try again.";
  return "Could not load the content, please try again later.";
}

export async function getApodByDate(date) {
  if (!NASA_API_KEY) {
    throw new Error("Missing NASA API key. Set VITE_NASA_API_KEY in your .env file.");
  }

  try {
    const { data } = await apiClient.get("", { params: { api_key: NASA_API_KEY, date } });
    if (isPlaceholderEntry(data)) {
      throw new Error("NASA has no image for this date right now. Try again or choose another date.");
    }
    return normalizeApodEntry(data, date);
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}
