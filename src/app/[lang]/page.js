import Hero from "../../components/Hero";
import ContactoCtaFull from "../../components/ContactoCta/ContactoCtaFull";
import AboutPageFull from "../../components/AboutSection/AboutPage";
import SelectedWorks from "../../components/selectedWorks/SelectedWorks";
import ContactSection from "../../components/ContactSection/ContactSection";
import CollabIntro from "../../components/CollabIntro/CollabIntro";
import ParallaxWorks from "../../components/parallaxWorks/page";
import Footer from "../../components/Footer/Footer";
  
const locales = ['es', 'en']; // cambia / añade los que uses

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export default function HomePage() {
  return (
    <main>
      <Hero />
      {/*<AboutPageFull />*/}
      <section id ="about"><AboutPageFull /></section>
      <ContactoCtaFull />
      <section id ="works"> <SelectedWorks /></section>
      <ParallaxWorks/> 
      <CollabIntro/>
      <section id ="contact"><ContactSection /></section>
      <Footer/>
    </main>
  );
}
