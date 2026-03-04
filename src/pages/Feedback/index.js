import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const Feedback = () => {
    return (<>
    <section className="header-section w-100">
        <NavBar mode="dark"/>
        <section className="section-text">
            <div className="h2 mt-5 mb-3">Feedback</div>
        </section>
    </section>
    <Footer/>
    </>)
}

export default Feedback;