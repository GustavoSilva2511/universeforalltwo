export default function ApodInfo({ title, description, eyebrow, credit, align = "left" }) {
    const alignment = align === "center" ? "text-center" : "text-left";

    return (
        <div className={`w-full ${alignment}`}>
            {eyebrow ? (
                <p className="text-sm text-slate-400">{eyebrow}</p>
            ) : null}
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-starlight sm:text-4xl">
                {title}
            </h1>
            <p className="mt-4 max-w-prose leading-relaxed text-slate-300">
                {description}
            </p>
            {credit ? (
                <p className="mt-3 text-xs text-slate-500">Credit: {credit}</p>
            ) : null}
        </div>
    )
}
