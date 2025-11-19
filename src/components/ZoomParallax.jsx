"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function HeroGsap() {
  const heroRef = useRef(null);
  const photoRef = useRef(null);

  useLayoutEffect(() => {
    // Respeta reduce motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1) Pin del hero (pantalla estática)
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "+=140%",       // cuánto tiempo queda “fijo”
        pin: true,
        pinSpacing: true
      });

      // 2) Zoom + parallax de la foto mientras está pineado
      gsap.fromTo(photoRef.current,
        { y: 60, scale: .96 },
        {
          y: -60, scale: 1.08, ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=140%",
            scrub: true
          }
        }
      );

      // 3) Título acompaña un poco hacia arriba
      gsap.to(".olh-title", {
        yPercent: -8, ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=140%",
          scrub: true
        }
      });

      // 4) Servicios suben y aparecen con scrub (sutil)
      gsap.from(".olh-services li", {
        y: 30, opacity: 0, stagger: 0.12, ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top+=10%",
          end: "+=60%",
          scrub: true
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="olh-hero">
      <div className="olh-wrap">
        <h1 className="olh-title">CREATIVE<span className="tight"></span> DEVELOPER</h1>

        <figure ref={photoRef} className="olh-photo">
          {/* tu PixelImage */}
        </figure>

        <p className="olh-based"><span>BASED</span><span></span>IN<span></span>SPAIN</p>

        <ul className="olh-services">
          <li>WEB DESIGN</li>
          <li>WEB DEVELOPMENT</li>
          <li>UX/UI DESIGN</li>
        </ul>
      </div>
    </section>
  );
}
