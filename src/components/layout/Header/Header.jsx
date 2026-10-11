export default function Header({ title }) {
    return (
        <header className="flex h-8 items-center justify-center">
            <h1 className="text-2xl text-slate-100">{title}</h1>
        </header>
    )
}
