import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  LOCALE_STORAGE_KEY,
  dictionaries,
  getByPath,
  getInitialLocale,
  interpolate,
} from "../../i18n/index.js";

const LanguageContext = createContext(null);

function applyLocaleToDocument(locale) {
  const dict = dictionaries[locale] ?? dictionaries.en;
  document.documentElement.lang = locale;
  document.title = getByPath(dict, "meta.title") ?? "Universe For All";
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", getByPath(dict, "meta.description") ?? "");
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  const setLocale = useCallback((next) => {
    if (next !== "en" && next !== "pt-BR") return;
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignora — idioma segue funcionando só em memória.
    }
  }, []);

  const t = useCallback(
    (path, vars) => {
      const dict = dictionaries[locale] ?? dictionaries.en;
      const value = getByPath(dict, path) ?? getByPath(dictionaries.en, path) ?? path;
      return interpolate(value, vars);
    },
    [locale],
  );

  useEffect(() => {
    applyLocaleToDocument(locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLocale deve ser usado dentro de LanguageProvider");
  return ctx;
}
