import "./ApodContentPage.css"

import ApodPreview from '../../components/apod/ApodPreview'
import ApodInfo from '../../components/apod/ApodInfo'
import PageLayout from '../../components/layout/PageLayout'

import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { isValidApodDate, useApod } from '../../features/apod'

export default function ApodContentPage() {
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date");

    if (!isValidApodDate(date).valid) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <ApodContent date={date} />;
}

function ApodContent({ date }) {
    const { data, isLoading, isError, error } = useApod(date);

    if (isLoading) {
        return (
            <PageLayout>
                <p className="info">Loading universe...</p>
            </PageLayout>
        );
    }

    if (isError) {
        return (
            <PageLayout>
                <div className="info">
                    <h2>Something went wrong</h2>
                    <p>{error?.message}</p>
                    <Link to={ROUTES.HOME}>Choose another date</Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <ApodPreview src={data.url} title={data.title} mediaType={data.mediaType} />
            <ApodInfo
                title={data.title}
                description={data.explanation}
            />
        </PageLayout>
    )
}
