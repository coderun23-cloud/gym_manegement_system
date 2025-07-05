import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Contact from "../components/Contact";
import Notice from "../components/Notice";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
      <div className="font-sans bg-white text-gray-900">
        <Navbar />
        <Hero />
        <About />
        <Notice />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
