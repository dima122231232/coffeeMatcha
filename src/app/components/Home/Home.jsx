"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Cup from "@/app/components/Cup/Cup";
import HeroButton from "@/app/components/Buttons/HeroButton";
import { splitTextToSpans } from "@/app/components/Algoritms/splitTextToSpans";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");
export default function Home() {
    useEffect(() => {
    splitTextToSpans(".StartAnimation", { className: "word" });

    const spans = gsap.utils.toArray(".StartAnimation .word");
    gsap.set(spans, { "--p": "0%" });

    const play = () => {gsap.to(spans, {"--p": "100%",duration: 0.4,delay:.7,ease,stagger: 0.015,overwrite: true,});
    gsap.to(".cup-canvas", {duration: 0.5,delay:.6,transform: "translate(-50%, -50%) scale(1)",ease,});
    gsap.to(".vlock", {duration:.2,delay:.4,scale:0});
};

    if (document.readyState === "complete") play();
    else window.addEventListener("load", play);

    return () => window.removeEventListener("load", play);
}, []);

  return (
    <main>
    <div className="vlock"></div>
      <section className="hero">
        <div className="hero__content">
          <Cup modelUrl="/images/cup.glb" />

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
