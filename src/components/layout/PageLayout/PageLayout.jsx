import Header from "../Header";
import Footer from "../Footer";

export default function PageLayout({ title = "Universe For All", children }) {
    return (
        <div>
            <Header title={title} />
            <main>{children}</main>
            <Footer />
        </div>
    )
}
