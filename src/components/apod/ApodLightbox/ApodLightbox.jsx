import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "../../../features/locale/index.js";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const STEP = 0.5;
const DOUBLE_CLICK_SCALE = 2.5;

function clampScale(value) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

export default function ApodLightbox({ src, title, alt, onClose }) {
    const { t } = useLocale();
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const closeRef = useRef(null);
    const viewportRef = useRef(null);
    const dragRef = useRef({ startX: 0, startY: 0, baseX: 0, baseY: 0 });
    const stateRef = useRef({ scale, position });
    stateRef.current = { scale, position };

    const applyZoom = useCallback((next) => {
        const clamped = clampScale(Math.round(next * 2) / 2);
        setScale(clamped);
        if (clamped === MIN_SCALE) setPosition({ x: 0, y: 0 });
    }, []);

    const zoomIn = useCallback(() => applyZoom(stateRef.current.scale + STEP), [applyZoom]);
    const zoomOut = useCallback(() => applyZoom(stateRef.current.scale - STEP), [applyZoom]);
    const reset = useCallback(() => {
        setScale(MIN_SCALE);
        setPosition({ x: 0, y: 0 });
    }, []);

    const toggleDoubleClick = useCallback(() => {
        applyZoom(stateRef.current.scale > MIN_SCALE ? MIN_SCALE : DOUBLE_CLICK_SCALE);
    }, [applyZoom]);

    // ESC fecha + trava scroll do body + foco inicial no fechar.
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose?.();
            if ((event.key === "+" || event.key === "=")) zoomIn();
            if (event.key === "-") zoomOut();
            if (event.key === "0") reset();
        };
        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose, zoomIn, zoomOut, reset]);

    // Wheel com preventDefault (listener nativo não-passivo) para zoom sem rolar a página.
    useEffect(() => {
        const node = viewportRef.current;
        if (!node) return;
        const onWheel = (event) => {
            event.preventDefault();
            const delta = event.deltaY < 0 ? STEP : -STEP;
            applyZoom(stateRef.current.scale + delta);
        };
        node.addEventListener("wheel", onWheel, { passive: false });
        return () => node.removeEventListener("wheel", onWheel);
    }, [applyZoom]);

    const handlePointerDown = (event) => {
        if (stateRef.current.scale <= MIN_SCALE) return;
        dragRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            baseX: stateRef.current.position.x,
            baseY: stateRef.current.position.y,
        };
        setIsDragging(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
        if (!isDragging) return;
        setPosition({
            x: dragRef.current.baseX + (event.clientX - dragRef.current.startX),
            y: dragRef.current.baseY + (event.clientY - dragRef.current.startY),
        });
    };

    const endDrag = () => setIsDragging(false);

    const altText = alt || title || t("lightbox.fallbackAlt");

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={title ? t("lightbox.viewerWithTitle", { title }) : t("lightbox.viewer")}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose?.();
            }}
        >
            <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
                <p className="min-w-0 flex-1 truncate text-sm text-slate-300">{title}</p>
                <span
                    aria-live="polite"
                    className="min-w-[4rem] rounded-md border border-white/15 px-2 py-1 text-center text-xs font-semibold tabular-nums text-slate-200"
                >
                    {Math.round(scale * 100)}%
                </span>
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label={t("lightbox.close")}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-lg font-semibold leading-none text-slate-200 transition hover:border-nebula hover:text-white active:scale-95"
                >
                    ×
                </button>
            </header>

            <div
                ref={viewportRef}
                className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 sm:p-6"
                onClick={(event) => {
                    if (event.target === event.currentTarget) onClose?.();
                }}
            >
                <img
                    src={src}
                    alt={altText}
                    draggable={false}
                    onDoubleClick={toggleDoubleClick}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transition: isDragging ? "none" : "transform 150ms ease-out",
                        cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                        touchAction: "none",
                    }}
                    className="max-h-full max-w-full select-none object-contain shadow-2xl shadow-black/60 ring-1 ring-white/10"
                />
            </div>

            <footer className="flex items-center justify-center gap-2 border-t border-white/10 px-4 py-3">
                <button
                    type="button"
                    onClick={zoomOut}
                    disabled={scale <= MIN_SCALE}
                    aria-label={t("lightbox.zoomOut")}
                    className="rounded-lg border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-nebula hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    −
                </button>
                <button
                    type="button"
                    onClick={reset}
                    aria-label={t("lightbox.reset")}
                    className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-nebula hover:text-white active:scale-95"
                >
                    {t("lightbox.reset")}
                </button>
                <button
                    type="button"
                    onClick={zoomIn}
                    disabled={scale >= MAX_SCALE}
                    aria-label={t("lightbox.zoomIn")}
                    className="rounded-lg border border-white/15 px-4 py-2 font-semibold text-slate-200 transition hover:border-nebula hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    +
                </button>
            </footer>
        </div>
    );
}
