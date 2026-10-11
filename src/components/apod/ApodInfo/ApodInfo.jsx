import "./ApodInfo.css"

export default function ApodInfo({ title, description }) {
    return (
        <div className="info">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    )
}
