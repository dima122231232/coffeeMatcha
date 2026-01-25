"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Logo from "../Logo";
import { splitTextToSpans } from "../Algoritms/splitTextToSpans";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

export default function Header() {
    const pathname = usePathname(), helper = useRef(), burger = useRef(), burgerM = useRef(), lineA = useRef(), lineB = useRef(), lineAm = useRef(), lineBm = useRef(), navBurger = useRef(),navBurgerM = useRef(), open = useRef(false);
    const is = (href) => (pathname === href ? "page" : undefined);

    const toggle = () => {
        const o = open.current;

        gsap.to([lineA.current, lineB.current], { duration: 0.25, rotate: (i) => (o ? 0 : i ? 45 : -45), transform: (i) => (o ? "translateY(0%)" : i ? "translateY(-50%)" : "translateY(50%)"), ease:ease });
        gsap.to(burger.current, { duration: 0.25, gap: o ? 5 : 0, ease:ease });
        burger.current?.classList.toggle("is-open", !o);
        gsap.to(helper.current, { duration: 0.35, height: o ? 40 : 320, width: o ? 40 : 580, borderRadius: o ? 0 : 12, autoRound: false, ease:ease });
        gsap.to(navBurger.current, { duration: o ? 0.25 : 0.5,display: o ? "none" : "flex", opacity: o ? 0 : 1, scale: o ? 0.95 : 1, ease:ease });

        open.current = !o;
    };
    const toggleM = () => {
        const o = open.current;
        
        gsap.to(".header__logo", {duration: .15 , opacity: o ? 1 : 0});
        gsap.to(burgerM.current, { duration: 0.25, gap: o ? 5 : 0, ease:ease });
        gsap.to([lineAm.current, lineBm.current], { duration: 0.25, rotate: (i) => (o ? 0 : i ? 45 : -45), transform: (i) => (o ? "translateY(0%)" : i ? "translateY(-50%)" : "translateY(50%)"), ease:ease });
        gsap.to(navBurgerM.current, { duration:.35,display: o ? "none" : "flex", opacity: o ? 0 : 1,height: o ? 60 : 270,scale: o ? 0.95 : 1,borderRadius: o ? 0 : 8, ease:"back.inOut"});
        open.current = !o;
    };
    useEffect(() => { splitTextToSpans(".StartAnimation"); }, []);

    return (
        <>
            <header className="header  header--desktop">
                <div className="header__wrapper">
                    <Logo className="header__logo logo" />
                    <div className="header__actions">
                        <button className="header__button StartAnimation">buy now</button>
                        <button className="header__burger header__burger--desktop" ref={burger} onClick={toggle}>
                            <div className="header__burger__polosa" ref={lineA} />
                            <div className="header__burger__polosa" ref={lineB} />
                        </button>
                        <div className="header__burger--desktop-helper" ref={helper} />
                    </div>

                    <nav className="header-nav" aria-label="Primary navigation" ref={navBurger}>
                        <ul className="header-nav__list">
                            <li className="header-nav__item"><a className="header-nav__link" href="/" aria-current={is("/")}><span>Home Page</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                            <li className="header-nav__item"><a className="header-nav__link" href="/about" aria-current={is("/about")}><span>About Us</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                            <li className="header-nav__item"><a className="header-nav__link" href="/location" aria-current={is("/location")}><span>Location</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                            <li className="header-nav__item"><a className="header-nav__link" href="/careers" aria-current={is("/careers")}><span>Careers</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                            <li className="header-nav__item"><a className="header-nav__link" href="/product" aria-current={is("/product")}><span>Product</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <header className="header header--mobile">
                <div className="header__wrapper">
                    <Logo className="header__logo logo" />
                    <button className="header__burger" ref={burgerM} onClick={toggleM}><div className="header__burger__polosa" ref={lineAm} /><div className="header__burger__polosa" ref={lineBm}/></button>
                        <nav className="header-nav" aria-label="Primary navigation" ref={navBurgerM}>
                            <ul className="header-nav__list">
                                <li className="header-nav__item"><a className="header-nav__link" href="/" aria-current={is("/")}><span>Home Page</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                                <li className="header-nav__item"><a className="header-nav__link" href="/about" aria-current={is("/about")}><span>About Us</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                                <li className="header-nav__item"><a className="header-nav__link" href="/location" aria-current={is("/location")}><span>Location</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                                <li className="header-nav__item"><a className="header-nav__link" href="/careers" aria-current={is("/careers")}><span>Careers</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                                <li className="header-nav__item"><a className="header-nav__link" href="/product" aria-current={is("/product")}><span>Product</span><div className="header-nav__marker" aria-hidden="true"></div></a></li>
                            </ul>
                        </nav>
                </div>
            </header>
        </>
    );
}
