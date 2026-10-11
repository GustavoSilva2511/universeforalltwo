import "./ApodPreview.css"

export default function ApodPreview({ src, title }) {
    return (
        <img className="preview" src={src} alt={title ?? "NASA astronomy picture of the day"} loading="lazy" />
    )
}
