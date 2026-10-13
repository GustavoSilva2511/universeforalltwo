import { useState } from "react";
import TextInput from "../../ui/TextInput/index.js";
import Button from "../../ui/Button/index.js";
import ErrorMessage from "../../ui/ErrorMessage/index.js";
import { isValidApodDate } from "../../../features/apod/index.js";
import { useLocale } from "../../../features/locale/index.js";

export default function ApodSearchForm({ onSubmit }) {
    const { t } = useLocale();
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        const { valid, error: validationError } = isValidApodDate(date, t("validation.invalidDate"));
        if (!valid) {
            setError(validationError);
            return;
        }
        setError("");
        onSubmit(date);
    };

    return (
        <form
            className="mt-6 flex w-full flex-col gap-3"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <div className="flex w-full flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                    <TextInput
                        type="date"
                        label={t("search.label")}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="flex items-end justify-center sm:justify-start">
                    <Button type="submit">{t("search.submit")}</Button>
                </div>
            </div>
            <ErrorMessage message={error} />
        </form>
    );
}
