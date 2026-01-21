"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Logo from "../Logo";
import { splitTextToSpans } from "../Algoritms/splitTextToSpans";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

export default function Header() {
    const helper = useRef(null), burger = useRef(null), lineA = useRef(null), lineB = useRef(null), open = useRef(false);

    const toggle = () => {
        const o = open.current;

        gsap.to([lineA.current, lineB.current], {duration: 0.25,rotate: (i) => (o ? 0 : (i ? 45 : -45)),transform: (i) => (o ? "translateY(0%)" : i ? "translateY(-50%)" : "translateY(50%)"),});
        gsap.to(burger.current, { duration: 0.25, gap: o ? 5 : 0, ease });
        helper.current.classList.toggle("open");
        open.current = !o;
    };

    useEffect(() => {splitTextToSpans(".StartAnimation");}, []);

  return (
    <header className="header header--desktop">
      <div className="header__wrapper">
        <Logo className="header__logo" />
        <div className="header__actions">
          <button className="header__button StartAnimation">buy now</button>

          <button className="header__burger header__burger--desktop" ref={burger} onClick={toggle}>
            <div className="header__burger__polosa" ref={lineA} />
            <div className="header__burger__polosa" ref={lineB} />
          </button>

          <div className="header__burger--desktop-helper" ref={helper} />
        </div>
      </div>
    </header>
  );
}
