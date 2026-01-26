"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "../Logo";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const root = useRef(null), pathname = usePathname();

    useEffect(() => {
        const ctx = gsap.context(() => gsap.fromTo(".footer-spacer",{yPercent:-100},{yPercent:0,ease:"none",scrollTrigger:{trigger:".footer-spacer",start:"bottom bottom",end:"200% bottom",scrub:0}}), root);
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => ctx.revert();
    }, [pathname]);

    return (
        <div ref={root}>
            <footer className="footer" role="contentinfo">
                <div className="footer__left">
                    <a href="/" aria-label="Java Matcha Coffee — home"><Logo className="footer__logo logo" /></a>
                    <nav className="footer__nav" aria-label="Footer navigation"><ul className="footer__list footer__list--primary"><li className="footer__item"><a className="footer__link" href="/">Home Page</a></li><li className="footer__item"><a className="footer__link" href="/about">About Us</a></li><li className="footer__item"><a className="footer__link" href="/products">Products</a></li><li className="footer__item"><a className="footer__link" href="/location">Location</a></li></ul></nav>
                    <nav className="footer__nav" aria-label="Social links"><ul className="footer__list footer__list--social"><li className="footer__item"><a className="footer__link" href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a></li><li className="footer__item"><a className="footer__link" href="https://tiktok.com/" target="_blank" rel="noopener noreferrer">Tik Tok</a></li><li className="footer__item"><a className="footer__link" href="https://x.com/" target="_blank" rel="noopener noreferrer">X</a></li></ul></nav>
                    <nav className="footer__nav" aria-label="Legal"><ul className="footer__list footer__list--legal"><li className="footer__item"><a className="footer__link" href="/careers">Careers</a></li><li className="footer__item"><a className="footer__link" href="/privacy">Privacy</a></li><li className="footer__item"><a className="footer__link" href="/terms">Terms of Service</a></li></ul></nav>
                </div>
                <div className="footer__right">
                    <span className="footer__copyright">© 2025–2026 <span className="footer__brand">Java Matcha Coffee</span></span>
                    <p className="footer__note"><br />All rights reserved. Company duly registered and operating in accordance with applicable laws.</p>
                </div>
            </footer>
            <div className="footer-spacer" aria-hidden="true">COFFEE</div>
        </div>
    );
}
