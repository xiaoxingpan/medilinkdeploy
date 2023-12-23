import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Header from "../components/Header.js";
import Department from "../components/Department.js";
import About from "../components/About.js";


function Home() {
    const roundedHeaderButton = true;
    return (
        <>
            <Header roundedHeaderButton={roundedHeaderButton} />
            <Hero />
            <About />
            <Department />
            <Footer />
        </>
    );
}
export default Home;
