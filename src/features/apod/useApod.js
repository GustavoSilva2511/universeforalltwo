import { useQuery } from "@tanstack/react-query";
import { getApodByDate } from "./apodService";
import { isValidApodDate } from "./dateValidation";

export function useApod(date) {
  const enabled = isValidApodDate(date).valid;

  return useQuery({
    queryKey: ["apod", date],
    queryFn: () => getApodByDate(date),
    enabled,
  });
}
