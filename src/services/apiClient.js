import axios from "axios";
import { APOD_BASIC_BASE_URL } from "../constants/config";

export const apiClient = axios.create({
  baseURL: APOD_BASIC_BASE_URL,
  timeout: 10000,
});
