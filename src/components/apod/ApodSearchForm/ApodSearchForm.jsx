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
        <div className="flex flex-col items-center">
            <TextInput
                type="date"
                placeholder="choice a date..."
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <ErrorMessage message={error} />
            <Button onClick={handleSubmit}>continue</Button>
        </div>
    );
}
