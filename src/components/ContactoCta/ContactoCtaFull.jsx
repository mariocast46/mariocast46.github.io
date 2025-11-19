// p. ej. en tu página About o Home
"use client"
import ContactCta from "../ContactoCta/ContactoCta";

export default function ContactoCtaFull({ lang = "en" }) {
  const href = `/${lang}/${lang === "es" ? "contacto" : "contact"}`;
    return (
    <main>
        <ContactCta
        href= {href}                         
        gifSrc="/images/gif/Perro-contactcta.gif"  
        gifAlt="Perrete al teléfono"
        />
    </main>
  );
}
