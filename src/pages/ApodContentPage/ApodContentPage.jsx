import "./ApodContentPage.css"

import ApodPreview from '../../components/apod/ApodPreview'
import ApodInfo from '../../components/apod/ApodInfo'
import PageLayout from '../../components/layout/PageLayout'

export default function ApodContentPage() {
    const title = localStorage.getItem("title");
    const explanation = localStorage.getItem("explanation");
    const url = localStorage.getItem("url");

    return (
        <PageLayout>
            <ApodPreview src={url} title={title} />
            <ApodInfo
                title={title}
                description={explanation}
            />
        </PageLayout>
    )
}
