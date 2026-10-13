import ApodInfo from "../../components/apod/ApodInfo/index.js"
import ApodSearchForm from "../../components/apod/ApodSearchForm/index.js"
import PageLayout from "../../components/layout/PageLayout/index.js"

import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../constants/routes"
import { useLocale } from "../../features/locale/index.js"

export default function HomePage() {
    const navigate = useNavigate();
    const { t } = useLocale();

    const handleSubmit = (date) => {
        navigate(`${ROUTES.CONTENT}?date=${date}`);
    };

    return (
        <PageLayout>
            <section className="flex flex-1 items-center justify-center py-12 sm:py-20">
                <div className="flex w-full max-w-xl flex-col items-center text-center">
                    <ApodInfo
                        align="center"
                        title={t("home.title")}
                        description={t("home.description")}
                    />
                    <ApodSearchForm onSubmit={handleSubmit} />
                </div>
            </section>
        </PageLayout>
    )
}
