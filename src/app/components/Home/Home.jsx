"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Cup from "@/app/components/Cup/Cup";
import HeroButton from "@/app/components/Buttons/HeroButton";
import { splitTextToSpans } from "@/app/components/Algoritms/splitTextToSpans";

gsap.registerPlugin(CustomEase, ScrollTrigger);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

export default function Home() {
  const ready = useRef(false);
  const play = useCallback(() => {
    if (ready.current) return;
    ready.current = true;
    const spans = gsap.utils.toArray(".StartAnimation .word");
    gsap.set(spans, { "--p": "0%" });
    gsap.to(spans, { "--p": "110%", duration: .4, delay: .3, ease, stagger: .015, overwrite: true });
    gsap.to(".cup-canvas", { duration: .5, delay: .2, transform: "translate(-50%, -50%) scale(1)", ease });
    gsap.to(".vlock", { duration: .3, scale: 0 });
  }, []);

  useEffect(() => {
    // разбиваем текст на спаны
    splitTextToSpans(".StartAnimation", { className: "word" });

    // парallax по data-speed
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".parallax_image-col").forEach(col => {
        const img = col.querySelector("img[data-speed]");
        if (!img) return;
        const speed = parseFloat(img.dataset.speed) || 0;
        const distance = col.offsetHeight * speed; // высота колонки × скорость
        gsap.fromTo(
          img,
          { y: -distance / 2 },
          {
            y: distance / 2,
            ease: "none",
            scrollTrigger: {
              trigger: col,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
      // пересчитываем позиции после загрузки картинок
      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, []);

  return (
    <main>
      <div className="vlock"></div>

      <section className="hero">
        <div className="hero__content">
          <Cup modelUrl="/images/cup.glb" onLoaded={play} />
          <div className="hero__info">
            <div className="hero__title hero-indent StartAnimation">premium <br />coffee & matcha</div>
            <div className="hero__divider"></div>
            <div className="hero__text-block hero-indent">
              <p className="hero__description StartAnimation">
                Loved by thousands of community members, this creation contains real green tea powder
              </p>
              <HeroButton />
            </div>
          </div>
          <h4 className="hero__tagline StartAnimation">you deserve this</h4>
        </div>
      </section>

      <section className="drinks">
        <div className="drinks__bg"><div className="drinks__bg-stripes"></div></div>
        <div className="parallax_component">
          <div className="parallax_image-col"><img src="/images/coffee/img 1.png" alt="coffee 1" data-speed=".5"/></div>
          <div className="parallax_image-col"><img src="/images/coffee/img 2.png" alt="coffee 2" data-speed="0"/></div>
          <div className="parallax_image-col"><img src="/images/coffee/img 3.png" alt="coffee 3" data-speed="-.1"/></div>
          <div className="parallax_image-col"><img src="/images/coffee/img 4.png" alt="coffee 4" data-speed=".7"/></div>
          <div className="parallax_image-col"><img src="/images/coffee/img 5.png" alt="coffee 5" data-speed=".1"/></div>
          <div className="parallax_image-col"><img src="/images/coffee/img 6.png" alt="coffee 6" data-speed="-1"/></div>
        </div>
        <div className="drinks__content">
          <div className="drinks__content-wrapper">
            <div className="drinks__text">
              <h6 className="drinks__title">Specialty drinks</h6>
              <p className="drinks__description">Signature drinks made with thoughtfully selected ingredients, inspired by Japanese precision and contemporary coffee culture.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
