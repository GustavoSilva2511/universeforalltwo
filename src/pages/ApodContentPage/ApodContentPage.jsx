import ApodPreview from '../../components/apod/ApodPreview/index.js'
import ApodInfo from '../../components/apod/ApodInfo/index.js'
import Button from '../../components/ui/Button/index.js'
import PageLayout from '../../components/layout/PageLayout/index.js'

import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { isValidApodDate, useApod } from '../../features/apod/index.js'
import { toDisplayDate } from '../../utils/date.js'

export default function ApodContentPage() {
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date");

    if (!isValidApodDate(date).valid) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <ApodContent date={date} />;
}

function ApodSkeleton() {
    return (
        <div className="flex w-full flex-col gap-4 py-8" aria-busy="true" aria-label="Loading picture">
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-9 w-3/4 animate-pulse rounded-lg bg-white/10 sm:h-11" />
            <div className="aspect-video w-full animate-pulse rounded-xl bg-white/10 sm:rounded-2xl" />
            <div className="flex flex-col gap-2">
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
            </div>
        </div>
    );
}

function ApodContent({ date }) {
    const { data, isLoading, isFetching, isError, error, refetch } = useApod(date);

    if (isLoading) {
        return (
            <PageLayout>
                <ApodSkeleton />
            </PageLayout>
        );
    }

    if (isError) {
        return (
            <PageLayout>
                <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-starlight sm:text-3xl">
                        Something went wrong
                    </h1>
                    <p className="mt-3 max-w-prose text-slate-300">{error?.message}</p>
                    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
                        <Button onClick={() => refetch()}>
                            {isFetching ? "Trying again..." : "Try again"}
                        </Button>
                        <Link to={ROUTES.HOME} className="rounded px-2 py-2 text-slate-300 underline decoration-nebula underline-offset-4 transition hover:text-white">
                            Choose another date
                        </Link>
                    </div>
                </section>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <article className="flex w-full flex-col gap-5 py-8 sm:py-12">
                <ApodPreview src={data.url} title={data.title} alt={data.alt} mediaType={data.mediaType} />
                <ApodInfo
                    eyebrow={toDisplayDate(data.date)}
                    title={data.title}
                    description={data.explanation}
                    credit={data.credit}
                />
            </article>
        </PageLayout>
    )
}
