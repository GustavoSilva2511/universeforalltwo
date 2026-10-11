import { useState } from "react";
import TextInput from "../../ui/TextInput/index.js";
import Button from "../../ui/Button/index.js";
import ErrorMessage from "../../ui/ErrorMessage/index.js";
import { isValidApodDate } from "../../../features/apod/index.js";

export default function ApodSearchForm({ onSubmit }) {
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        const { valid, error: validationError } = isValidApodDate(date);
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
                        label="Picture date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="flex items-end">
                    <Button type="submit">View picture</Button>
                </div>
            </div>
            <ErrorMessage message={error} />
        </form>
    );
}
