export default function ErrorMessage({ message }) {
    if (!message) return null;
    return (
        <p role="alert" className="min-h-6 text-sm text-red-400">
            {message}
        </p>
    );
}
