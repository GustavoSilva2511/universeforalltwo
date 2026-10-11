import ApodPreview from '../../components/apod/ApodPreview/index.js'
import ApodInfo from '../../components/apod/ApodInfo/index.js'
import Button from '../../components/ui/Button/index.js'
import PageLayout from '../../components/layout/PageLayout/index.js'

import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { isValidApodDate, useApod } from '../../features/apod/index.js'

export default function ApodContentPage() {
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date");

    if (!isValidApodDate(date).valid) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <ApodContent date={date} />;
}

function ApodContent({ date }) {
    const { data, isLoading, isFetching, isError, error, refetch } = useApod(date);

    if (isLoading) {
        return (
            <PageLayout>
                <p className="m-4 text-slate-100">Loading universe...</p>
            </PageLayout>
        );
    }

    if (isError) {
        return (
            <PageLayout>
                <div className="m-4 flex flex-col items-center text-center text-slate-100">
                    <h2 className="m-1 text-xl font-semibold">Something went wrong</h2>
                    <p className="m-1">{error?.message}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <Button onClick={() => refetch()}>
                            {isFetching ? "Trying again..." : "Try again"}
                        </Button>
                        <Link to={ROUTES.HOME} className="underline">Choose another date</Link>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <ApodPreview src={data.url} title={data.title} alt={data.alt} mediaType={data.mediaType} />
            <ApodInfo
                title={data.title}
                description={data.explanation}
            />
        </PageLayout>
    )
}
