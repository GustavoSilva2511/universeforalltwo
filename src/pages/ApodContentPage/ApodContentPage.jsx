import { useState } from 'react'
import ApodPreview from '../../components/apod/ApodPreview/index.js'
import ApodInfo from '../../components/apod/ApodInfo/index.js'
import Button from '../../components/ui/Button/index.js'
import PageLayout from '../../components/layout/PageLayout/index.js'

import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { isValidApodDate, useApod } from '../../features/apod/index.js'
import { useLocale } from '../../features/locale/index.js'
import { useTranslatedExplanation } from '../../features/translation/index.js'
import { toDisplayDate } from '../../utils/date.js'

export default function ApodContentPage() {
    const [searchParams] = useSearchParams();
    const { t } = useLocale();
    const date = searchParams.get("date");

    if (!isValidApodDate(date, t("validation.invalidDate")).valid) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <ApodContent key={date} date={date} />;
}

function ApodSkeleton() {
    const { t } = useLocale();
    return (
        <div className="flex w-full flex-col gap-4 py-8 sm:py-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10" aria-busy="true" aria-label={t("content.loading")}>
            <div className="order-1 lg:order-2">
                <div className="aspect-video w-full animate-pulse rounded-xl bg-white/10 sm:rounded-2xl" />
            </div>
            <div className="order-2 lg:order-1">
                <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-9 w-3/4 animate-pulse rounded-lg bg-white/10 sm:h-11" />
                <div className="mt-4 flex flex-col gap-2">
                    <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                </div>
            </div>
        </div>
    );
}

function ApodContent({ date }) {
    const { locale, t } = useLocale();
    const { data, isLoading, isFetching, isError, error, refetch } = useApod(date);
    const [showOriginal, setShowOriginal] = useState(false);

    const translation = useTranslatedExplanation({
        date,
        explanation: data?.explanation,
        enabled: !isLoading && !isError && !!data,
    });

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
                        {t("content.errorTitle")}
                    </h1>
                    <p className="mt-3 max-w-prose text-slate-300">{error?.message}</p>
                    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
                        <Button onClick={() => refetch()}>
                            {isFetching ? t("content.retrying") : t("content.retry")}
                        </Button>
                        <Link to={ROUTES.HOME} className="rounded px-2 py-2 text-slate-300 underline decoration-nebula underline-offset-4 transition hover:text-white">
                            {t("content.chooseAnother")}
                        </Link>
                    </div>
                </section>
            </PageLayout>
        );
    }

    const isPt = locale === "pt-BR";
    const hasTranslation = isPt && !!translation.data;
    const showTranslated = isPt && hasTranslation && !showOriginal;

    return (
        <PageLayout>
            <article className="flex w-full flex-col gap-5 py-8 sm:py-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
                <div className="order-1 min-w-0 lg:order-2">
                    <ApodPreview src={data.url} title={data.title} alt={data.alt} mediaType={data.mediaType} />
                </div>
                <div className="order-2 min-w-0 lg:order-1">
                    <ApodInfo
                        eyebrow={toDisplayDate(data.date, locale)}
                        title={data.title}
                        description={showTranslated ? translation.data : data.explanation}
                        credit={data.credit}
                        creditUrl={data.creditUrl}
                    />
                    {isPt ? (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {translation.isFetching || hasTranslation ? (
                                <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-slate-400">
                                    {translation.isFetching
                                        ? t("content.translationLoading")
                                        : t("content.translatedBadge")}
                                </span>
                            ) : null}
                            {translation.isError && !translation.isFetching ? (
                                <span className="text-xs text-slate-400">
                                    {t("content.translationUnavailable")}
                                </span>
                            ) : null}
                            {hasTranslation ? (
                                <button
                                    type="button"
                                    onClick={() => setShowOriginal((v) => !v)}
                                    className="rounded px-1 py-1 text-xs font-semibold text-slate-300 underline decoration-nebula underline-offset-4 transition hover:text-white"
                                >
                                    {showOriginal ? t("content.showTranslation") : t("content.showOriginal")}
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                    <div className="mt-6">
                        <Link
                            to={ROUTES.HOME}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 font-semibold text-slate-200 transition hover:border-nebula hover:text-white active:scale-95"
                        >
                            <span aria-hidden="true">←</span> {t("content.back")}
                        </Link>
                    </div>
                </div>
            </article>
        </PageLayout>
    )
}
