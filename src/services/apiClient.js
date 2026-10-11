import axios from "axios";
import { NASA_APOD_BASE_URL } from "../constants/config";

export const apiClient = axios.create({
  baseURL: NASA_APOD_BASE_URL,
  timeout: 10000,
});
