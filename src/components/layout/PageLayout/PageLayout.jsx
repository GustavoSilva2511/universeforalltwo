import Header from "../Header/index.js";
import Footer from "../Footer/index.js";

export default function PageLayout({ title = "Universe For All", children }) {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-cosmic via-abyss to-black text-slate-100">
            <Header title={title} />
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
                {children}
            </main>
            <Footer />
        </div>
    )
}
