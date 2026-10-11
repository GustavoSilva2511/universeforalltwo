export default function Button({ children, onClick, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="rounded-lg bg-nebulaDeep px-5 py-2.5 font-semibold text-white shadow-lg shadow-nebula/20 transition hover:bg-nebula active:scale-95"
        >
            {children}
        </button>
    )
}
