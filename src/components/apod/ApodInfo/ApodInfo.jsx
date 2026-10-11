export default function ApodInfo({ title, description }) {
    return (
        <div className="m-4 text-justify text-slate-100">
            <h2 className="m-1 text-center text-xl font-semibold">{title}</h2>
            <p>{description}</p>
        </div>
    )
}
