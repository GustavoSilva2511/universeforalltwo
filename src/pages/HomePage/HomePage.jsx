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
            <section className="flex flex-1 items-center justify-center py-12 sm:py-20">
                <div className="flex w-full max-w-xl flex-col items-center text-center">
                    <ApodInfo
                        align="center"
                        title="Welcome, stargazer"
                        description="Pick a date below and explore NASA's astronomy picture of the day, one universe at a time."
                    />
                    <ApodSearchForm onSubmit={handleSubmit} />
                </div>
            </section>
        </PageLayout>
    )
}
