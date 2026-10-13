import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes.js";
import { useLocale } from "../../../features/locale/index.js";

const LANG_OPTIONS = [
    { code: "en", label: "EN" },
    { code: "pt-BR", label: "PT" },
];

export default function Header({ title }) {
    const { locale, setLocale, t } = useLocale();

    return (
        <header className="w-full border-b border-white/10">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
                <Link
                    to={ROUTES.HOME}
                    className="rounded text-lg font-bold tracking-tight text-starlight transition hover:text-white"
                >
                    {title}
                </Link>
                <div className="flex items-center gap-3">
                    <span className="hidden text-sm text-slate-400 sm:inline">{t("header.subtitle")}</span>
                    <div
                        role="group"
                        aria-label={t("header.languageLabel")}
                        className="flex overflow-hidden rounded-lg border border-white/15"
                    >
                        {LANG_OPTIONS.map((opt) => {
                            const active = locale === opt.code;
                            return (
                                <button
                                    key={opt.code}
                                    type="button"
                                    aria-pressed={active}
                                    aria-label={`${t("header.languageLabel")}: ${opt.label}`}
                                    onClick={() => setLocale(opt.code)}
                                    className={`px-3 py-1.5 text-xs font-bold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula ${
                                        active
                                            ? "bg-nebulaDeep text-white"
                                            : "bg-transparent text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </header>
    )
}
