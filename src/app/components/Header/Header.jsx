"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Logo from "../Logo";
import { splitTextToSpans } from "../Algoritms/splitTextToSpans";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");
const MIN = 40, RAD = 12;

export default function Header() {
  const helper = useRef(null), burger = useRef(null), lineA = useRef(null), lineB = useRef(null), open = useRef(false);

  const clips = () => {
    const el = helper.current, w = el?.offsetWidth || 0, h = el?.offsetHeight || 0;
    return {
      c: `inset(0px 0px ${Math.max(0, h - MIN)}px ${Math.max(0, w - MIN)}px round 0px)`, // 40×40 справа-сверху
      o: `inset(0px 0px 0px 0px round ${RAD}px)`
    };
  };

  useLayoutEffect(() => { const { c } = clips(); gsap.set(helper.current, { clipPath: c, borderRadius: 0 }); }, []);
  useEffect(() => { splitTextToSpans(".StartAnimation"); }, []);

  const toggle = () => {
    const o = open.current, { c, o: op } = clips();
    gsap.to(helper.current, { duration: .35, clipPath: o ? c : op, borderRadius: o ? 0 : RAD, ease });
    gsap.to([lineA.current, lineB.current], { duration: .25, rotate: i => (o ? 0 : (i ? 45 : -45)), transform: i => i ? "translateY(-50%)" : "translateY(50%)" });
    gsap.to(burger.current, { duration: .25, gap: o ? 5 : 0, ease });
    open.current = !o;
  };

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
