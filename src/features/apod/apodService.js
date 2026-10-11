import { apiClient } from "../../services/apiClient";
import { NASA_API_KEY } from "../../constants/config";

function toErrorMessage(err) {
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
    return {
      title: data.title ?? "",
      explanation: data.explanation ?? "",
      url: data.url ?? "",
      mediaType: data.media_type ?? "image",
      date: data.date ?? date,
    };
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}
