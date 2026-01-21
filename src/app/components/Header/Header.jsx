"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Logo from "../Logo";
import { splitTextToSpans } from "../Algoritms/splitTextToSpans";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

export default function Header() {
  const helper = useRef(null);
  const burger = useRef(null);
  const lineA = useRef(null);
  const lineB = useRef(null);
  const open = useRef(false);

  const toggle = () => {
    const isOpen = open.current;

    // Анимация полосок бургера
    gsap.to([lineA.current, lineB.current], {
      duration: 0.25,
      rotate: (index) => (isOpen ? 0 : index ? 45 : -45),
      // смещение полосок вверх и вниз
      transform: (index) =>
        isOpen ? "translateY(0%)" : index ? "translateY(-50%)" : "translateY(50%)",
    });

    // Изменение расстояния между полосками бургера
    gsap.to(burger.current, {
      duration: 0.25,
      gap: isOpen ? 5 : 0,
      ease,
    });

    // переключаем класс open у помощника: CSS‑переходы займутся размерами
    helper.current.classList.toggle("open");

    open.current = !isOpen;
  };

  useEffect(() => {
    splitTextToSpans(".StartAnimation");
  }, []);

  return (
    <header className="header header--desktop">
      <div className="header__wrapper">
        <Logo className="header__logo" />
        <div className="header__actions">
          <button className="header__button StartAnimation">buy now</button>

          <button
            className="header__burger header__burger--desktop"
            ref={burger}
            onClick={toggle}
          >
            <div className="header__burger__polosa" ref={lineA} />
            <div className="header__burger__polosa" ref={lineB} />
          </button>

          {/* элемент, размеры которого изменяются */}
          <div
            className="header__burger--desktop-helper"
            ref={helper}
          />
        </div>
      </div>
    </header>
  );
}
