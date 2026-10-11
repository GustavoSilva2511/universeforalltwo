export default function ErrorMessage({ message }) {
    if (!message) return null;
    return <p className="m-1 text-red-400">{message}</p>;
}
