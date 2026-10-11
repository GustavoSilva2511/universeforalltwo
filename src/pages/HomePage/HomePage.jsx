import ApodInfo from "../../components/apod/ApodInfo/index.js"
import ApodSearchForm from "../../components/apod/ApodSearchForm/index.js"
import PageLayout from "../../components/layout/PageLayout/index.js"

import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../constants/routes"

export default function HomePage() {
    const navigate = useNavigate();

    const handleSubmit = (date) => {
        navigate(`${ROUTES.CONTENT}?date=${date}`);
    };

    return (
        <PageLayout>
            <div className="mt-24 flex w-full max-w-md flex-col items-center">
                <ApodInfo
                    title="Wellcome people"
                    description="inset a date bellow and appreciate"
                />
                <ApodSearchForm onSubmit={handleSubmit} />
            </div>
        </PageLayout>
    )
}
