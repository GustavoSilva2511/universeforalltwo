import { useState } from "react";
import ApodLightbox from "../ApodLightbox/index.js";

export default function ApodPreview({ src, title, alt, mediaType = "image" }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    if (!src) return null;

    const fallbackTitle = title ?? "NASA astronomy picture of the day";
    const altText = alt || fallbackTitle;

    if (mediaType === "video") {
        return (
            <div className="animate-apod-in w-full overflow-hidden rounded-xl shadow-2xl shadow-black/50 ring-1 ring-white/10 sm:rounded-2xl">
                <iframe
                    className="aspect-video w-full"
                    src={src}
                    title={fallbackTitle}
                    allow="encrypted-media"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                aria-label="Open fullscreen viewer"
                title="Open fullscreen viewer"
                className="block w-full cursor-zoom-in rounded-xl focus-visible:outline-none sm:rounded-2xl"
            >
                <img
                    className="animate-apod-in max-h-[75vh] w-full rounded-xl object-contain shadow-2xl shadow-black/50 ring-1 ring-white/10 transition hover:ring-nebula/60 sm:rounded-2xl"
                    src={src}
                    alt={altText}
                    loading="lazy"
                />
            </button>
            {isFullscreen ? (
                <ApodLightbox
                    src={src}
                    title={fallbackTitle}
                    alt={altText}
                    onClose={() => setIsFullscreen(false)}
                />
            ) : null}
        </>
    )
}
