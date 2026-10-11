// Centraliza acesso à chave da NASA.
// No Vite, apenas variáveis prefixadas com VITE_ são expostas ao client.
// Renomeie APOD_TOKEN no .env para VITE_NASA_API_KEY (ver .env.example).
export const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY ?? "";

export const NASA_APOD_BASE_URL = "https://api.nasa.gov/planetary/apod";
