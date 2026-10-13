import { useLocale } from "../../../features/locale/index.js";

export default function Footer() {
    const { t } = useLocale();
    return (
        <footer className="w-full border-t border-white/10">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-1 px-4 py-5 text-center text-sm text-slate-400 sm:flex-row sm:justify-between sm:text-left">
                <p>{t("footer.madeBy")}</p>
                <p>{t("footer.courtesy")}</p>
            </div>
        </footer>
    )
}
