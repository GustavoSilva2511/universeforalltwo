import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes.js";

export default function Header({ title }) {
    return (
        <header className="w-full border-b border-white/10">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                <Link
                    to={ROUTES.HOME}
                    className="rounded text-lg font-bold tracking-tight text-starlight transition hover:text-white"
                >
                    {title}
                </Link>
                <span className="text-sm text-slate-400">NASA picture of the day</span>
            </div>
        </header>
    )
}
