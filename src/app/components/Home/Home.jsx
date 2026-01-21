"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Cup from "@/app/components/Cup/Cup";
import HeroButton from "@/app/components/Buttons/HeroButton";
import { splitTextToSpans } from "@/app/components/Algoritms/splitTextToSpans";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

export default function Home() {
  const ready = useRef(false);

  const play = useCallback(() => {
    if (ready.current) return;
    ready.current = true;

    const spans = gsap.utils.toArray(".StartAnimation .word");
    gsap.set(spans, { "--p": "0%" });

    gsap.to(spans, { "--p": "110%", duration: .4, delay: .3, ease, stagger: 0.015, overwrite: true });
    gsap.to(".cup-canvas", { duration: .5, delay: .2, transform: "translate(-50%, -50%) scale(1)", ease });
    gsap.to(".vlock", { duration: .3, scale: 0 });
  }, []);

  useEffect(() => {
    splitTextToSpans(".StartAnimation", { className: "word" });
  }, []);

  return (
    <main>
      <div className="vlock"></div>

      <section className="hero">
        <div className="hero__content">
          <Cup modelUrl="/images/cup.glb" onLoaded={play} />

          <div className="hero__info">
            <div className="hero__title hero-indent StartAnimation">
              premium <br />coffee & matcha
            </div>

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
    </main>
  );
}
