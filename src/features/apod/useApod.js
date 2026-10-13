import { useQuery } from "@tanstack/react-query";
import { getApodByDate } from "./apodService";
import { isValidApodDate } from "./dateValidation";
import { useLocale } from "../locale/index.js";

export function useApod(date) {
  const { locale, t } = useLocale();
  const enabled = isValidApodDate(date, t("validation.invalidDate")).valid;

  return useQuery({
    queryKey: ["apod", date, locale],
    queryFn: () => getApodByDate(date, t),
    enabled,
  });
}
