export default function Button({ children, onClick, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="m-1 rounded bg-nebula px-4 py-2 font-semibold text-white transition hover:brightness-110 active:scale-95"
        >
            {children}
        </button>
    )
}
