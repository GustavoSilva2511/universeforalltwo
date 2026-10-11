import "./HomePage.css"

import ApodInfo from "../../components/apod/ApodInfo"
import TextInput from "../../components/ui/TextInput"
import PageLayout from "../../components/layout/PageLayout"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../constants/routes"
import { isValidApodDate } from "../../features/apod"

export default function HomePage() {
    const navigate = useNavigate();
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const handleContinue = () => {
        const { valid, error: validationError } = isValidApodDate(date);
        if (!valid) {
            setError(validationError);
            return;
        }
        setError("");
        navigate(`${ROUTES.CONTENT}?date=${date}`);
    }

    return (
        <PageLayout>
            <div className="main">
                <div className="section">
                    <ApodInfo
                        title="Wellcome people"
                        description="inset a date bellow and appreciate"
                    />
                    <div>
                        <TextInput
                            type="date"
                            placeholder="choice a date..."
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <p className="error">{error}</p>
                        <button onClick={handleContinue}>continue</button>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
