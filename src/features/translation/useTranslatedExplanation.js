import { useQuery } from "@tanstack/react-query";
import { useLocale } from "../locale/index.js";
import { translateExplanationEnToPtBR } from "./translationService";

const CACHE_PREFIX = "u4a:pt:";

function readCache(date) {
  try {
    return localStorage.getItem(`${CACHE_PREFIX}${date}`) || "";
  } catch {
    return "";
  }
}

function writeCache(date, text) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${date}`, text);
  } catch {
    // Quota do localStorage cheia — cache em memória do react-query segue valendo.
  }
}

// Busca a explanation traduzida só quando locale é pt-BR.
// Nunca bloqueia a imagem: a página renderiza o original e troca ao chegar.
export function useTranslatedExplanation({ date, explanation, enabled }) {
  const { locale } = useLocale();
  const shouldTranslate = enabled && locale === "pt-BR" && !!explanation;

  return useQuery({
    queryKey: ["apod-explanation-pt", date],
    queryFn: async () => {
      const cached = readCache(date);
      if (cached) return cached;
      const translated = await translateExplanationEnToPtBR(explanation);
      writeCache(date, translated);
      return translated;
    },
    enabled: shouldTranslate,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24 * 30,
    retry: 1,
  });
}
