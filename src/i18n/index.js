import en from "./locales/en.json";
import ptBR from "./locales/pt-BR.json";

export const LOCALES = ["en", "pt-BR"];

export const dictionaries = { en, "pt-BR": ptBR };

export const LOCALE_STORAGE_KEY = "u4a:locale";

export function getInitialLocale() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "pt-BR") return stored;
  } catch {
    // localStorage indisponível (SSR/privado) — segue para detecção.
  }
  const nav = typeof navigator !== "undefined" ? navigator.language || "" : "";
  if (/^pt\b/i.test(nav)) return "pt-BR";
  return "en";
}

export function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function interpolate(template, vars) {
  if (typeof template !== "string" || !vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}
