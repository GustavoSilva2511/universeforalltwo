const frameClass =
    "my-2 w-[90%] max-w-3xl rounded-[20px] border-[3px] border-black shadow-[1px_1px_10px_2px_rgba(255,255,255,0.34)]";

export default function ApodPreview({ src, title, alt, mediaType = "image" }) {
    if (!src) return null;

    const fallbackTitle = title ?? "NASA astronomy picture of the day";
    const altText = alt || fallbackTitle;

    if (mediaType === "video") {
        return (
            <iframe
                className={`${frameClass} aspect-video`}
                src={src}
                title={fallbackTitle}
                allow="encrypted-media"
                allowFullScreen
            />
        );
    }

    return (
        <img className={frameClass} src={src} alt={altText} loading="lazy" />
    )
}
