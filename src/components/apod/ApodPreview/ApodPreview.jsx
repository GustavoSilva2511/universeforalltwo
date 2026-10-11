import "./ApodPreview.css"

export default function ApodPreview({ src, title, mediaType = "image" }) {
    if (!src) return null;

    if (mediaType === "video") {
        return (
            <iframe
                className="preview"
                src={src}
                title={title ?? "NASA astronomy picture of the day"}
                allow="encrypted-media"
                allowFullScreen
            />
        );
    }

    return (
        <img className="preview" src={src} alt={title ?? "NASA astronomy picture of the day"} loading="lazy" />
    )
}
