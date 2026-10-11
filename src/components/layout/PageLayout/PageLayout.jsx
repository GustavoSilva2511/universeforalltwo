import Header from "../Header/index.js";
import Footer from "../Footer/index.js";

export default function PageLayout({ title = "Universe For All", children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-cosmic via-abyss to-black text-slate-100">
            <Header title={title} />
            <main className="flex w-full flex-1 flex-col items-center px-4">{children}</main>
            <Footer />
        </div>
    )
}
