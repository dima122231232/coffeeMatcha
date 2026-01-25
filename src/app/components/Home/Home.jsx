"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Cup from "@/app/components/Cup/Cup";
import HeroButton from "@/app/components/Buttons/HeroButton";
import { splitTextToSpans } from "@/app/components/Algoritms/splitTextToSpans";
import Button_wth_ind from "../Buttons/Button_without_indents";

gsap.registerPlugin(CustomEase, ScrollTrigger);

const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

function use1vw() {
    const calc = () => (typeof window === "undefined" ? 0 : document.documentElement.clientWidth / 100);
    const [vw, setVw] = useState(calc);

    useEffect(() => {
        const update = () => setVw(document.documentElement.clientWidth / 100);

        update();
        window.addEventListener("resize", update);
        window.addEventListener("orientationchange", update);

        const vv = window.visualViewport;
        if (vv) vv.addEventListener("resize", update);

        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("orientationchange", update);
            if (vv) vv.removeEventListener("resize", update);
        };
    }, []);

    return vw;
}

function useIsMobile(breakpoint = 768) {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);

        const calc = () => setIsMobile(window.innerWidth < breakpoint);

        calc();
        window.addEventListener("resize", calc);
        window.addEventListener("orientationchange", calc);

        const vv = window.visualViewport;
        if (vv) vv.addEventListener("resize", calc);

        return () => {
            window.removeEventListener("resize", calc);
            window.removeEventListener("orientationchange", calc);
            if (vv) vv.removeEventListener("resize", calc);
        };
    }, [breakpoint]);

    return { mounted, isMobile };
}

export default function Home() {
    const ready = useRef(false);
    const vw = use1vw();
    const { mounted, isMobile } = useIsMobile(770);

    const imagesItemRef1 = useRef(null),imagesItemRef2 = useRef(null), imagesItemRef3 = useRef(null);
    const contentRef1 = useRef(null), contentRef2 = useRef(null), contentRef3 = useRef(null);
    const countRef = useRef(null), isSliding = useRef(false), trf = useRef(0);

    const play = useCallback(() => {
        if (ready.current) return;

        ready.current = true;

        const spans = gsap.utils.toArray(".StartAnimation .word");

        gsap.set(spans, { "--p": "0%" });
        gsap.to(spans, { "--p": "110%", duration: 0.4, delay: 0.3, ease, stagger: 0.015, overwrite: true });
        gsap.to(".cup-canvas", { duration: 0.5, delay: 0.2, transform: "translate(-50%, -50%) scale(1)", ease });
        gsap.to(".vlock", { duration: .5, scale: 0,ease:ease});
    }, []);

    const products = [
        { img: "/images/product/item 1.png", alt: "Darker roast coffee beans", title: "Darker Roast", price: "from 12,95$", desc: "Deep, rich flavor with bold chocolate notes" },
        { img: "/images/product/item 2.png", alt: "Light roast coffee beans", title: "Light Roast", price: "from 11,50$", desc: "Bright citrus notes and clean finish" },
        { img: "/images/product/item 3.png", alt: "Ceremonial matcha", title: "Ceremonial Matcha", price: "from 18,90$", desc: "Smooth umami, vivid green, no bitterness" },
        { img: "/images/product/item 1.png", alt: "House blend coffee beans", title: "House Blend", price: "from 13,40$", desc: "Balanced body with caramel sweetness" },
        { img: "/images/product/item 2.png", alt: "Decaf coffee beans", title: "Decaf", price: "from 12,10$", desc: "Full taste, gentle caffeine-free" },
        { img: "/images/product/item 1.png", alt: "Darker roast coffee beans", title: "Darker Roast", price: "from 12,95$", desc: "Deep, rich flavor with bold chocolate notes" },
        { img: "/images/product/item 2.png", alt: "Light roast coffee beans", title: "Light Roast", price: "from 11,50$", desc: "Bright citrus notes and clean finish" },
        { img: "/images/product/item 3.png", alt: "Ceremonial matcha", title: "Ceremonial Matcha", price: "from 18,90$", desc: "Smooth umami, vivid green, no bitterness" },
    ];

    const total = products.length;

    const [start, setStart] = useState(0);
    const startRef = useRef(0);

    useEffect(() => {
        startRef.current = start;
    }, [start]);

    const strip = (offset) => products.map((_, i) => products[(i + offset) % total]);

    const getVisible = () => (mounted && isMobile ? 1 : 3);
    const getStepVw = () => (mounted && isMobile ? 90 : 25);

    const getImages = () => {
        if (mounted && isMobile) return [imagesItemRef1.current].filter(Boolean);
        return [imagesItemRef1.current, imagesItemRef2.current, imagesItemRef3.current].filter(Boolean);
    };

    const getContents = () => {
        if (mounted && isMobile) return [contentRef1.current].filter(Boolean);
        return [contentRef1.current, contentRef2.current, contentRef3.current].filter(Boolean);
    };

    const applyX = (dur = 0.3) => {
        const x = trf.current * vw;
        const imgs = getImages();

        gsap.killTweensOf(imgs);
        gsap.to(imgs, { x, duration: dur, ease, overwrite: "auto" });
    };

    const setStartAnimated = (nextStart) => {
        const cnt = getContents();

        gsap.killTweensOf(cnt);

        isSliding.current = true;

        gsap.timeline({
            onComplete: () => {
                isSliding.current = false;
            },
        })
        .add(() => setStart(nextStart))
        gsap.fromTo(cnt,{ clipPath: "polygon(0 0%, 0 0, 0 100%, 0% 100%)" }, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",delay:.25, duration: 0.35, ease: "power2.inOut"});
    };

    const onPrev = () => {
        if (isSliding.current) return;

        const s = startRef.current;

        if (s > 0) {
            trf.current += getStepVw();
            applyX(0.3);
            setStartAnimated(s - 1);
        }
    };

    const onNext = () => {
        if (isSliding.current) return;

        const s = startRef.current;
        const visible = getVisible();

        if (s < total - visible) {
            trf.current -= getStepVw();
            applyX(0.3);
            setStartAnimated(s + 1);
        }
    };

    useEffect(() => {
        const x = trf.current * vw;
        const imgs = getImages();

        gsap.killTweensOf(imgs);
        gsap.set(imgs, { x });
    }, [vw, mounted, isMobile]);

    useEffect(() => {
        if (!countRef.current) return;

        gsap.killTweensOf(countRef.current);
    }, [start, mounted, isMobile, total]);

    const visibleNow = getVisible();
    const current = Math.min(start + visibleNow, total);

    const p1 = products[start] || products[0];
    const p2 = products[start + 1] || products[0];
    const p3 = products[start + 2] || products[0];

    useEffect(() => {
        [".StartAnimation", ".drinks__text-anim", ".about__title"].forEach((s) => splitTextToSpans(s, { className: "word" }));

        const ctx = gsap.context(() => {
            gsap.utils.toArray(".parallax_image-col").forEach((col) => {
                const img = col.querySelector("img[data-speed]");
                if (!img) return;

                const speed = parseFloat(img.dataset.speed) || 0;
                const distance = col.offsetHeight * speed;

                gsap.fromTo(img, { y: -distance / 2 }, { y: distance / 2, ease: "none", scrollTrigger: { trigger: col, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
            });

            ScrollTrigger.refresh();
        });

        gsap.fromTo(".drinks__specialty--text .word", { clipPath: "polygon(0 0%, 100% 0%, 100% 97%, 0% 97%)" }, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".drinks", start: "25% top", end: "35% top", scrub: true } });
        gsap.fromTo(".drinks__hot-cold--text .word", { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0% 0%)", stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".drinks", start: "35% top", end: "45% top", scrub: true } });
        gsap.to(".drinks-transition__column", { transform: "translateY(0)", ease: "none", scrollTrigger: { trigger: ".drinks", start: "100% bottom", end: "130% bottom", scrub: true } });
        gsap.to(".about__title .word", { opacity: 1, ease: "none", stagger: 0.065, scrollTrigger: { trigger: ".about", start: "20% bottom", end: "200% bottom", scrub: true } });

        gsap.set(".home-shop", { force3D: true });
        gsap.fromTo(".home-shop", { yPercent: 0 }, { yPercent: -15, ease: "none", scrollTrigger: { trigger: ".home-shop", start: "center bottom", end: "bottom top", scrub: 1,invalidateOnRefresh: true} });
        return () => ctx.revert();
    }, []);

    return (
        <main className="main-home">
            <div className="vlock" />

            <section className="hero" aria-labelledby="start-page">
                <div className="hero__content">
                    <Cup modelUrl="/images/cub-beta.glb" onLoaded={play} />
                    <div className="hero__info">
                        <div className="hero__title hero-indent StartAnimation">
                            premium <br />
                            coffee & matcha
                        </div>
                        <div className="hero__divider" />
                        <div className="hero__text-block hero-indent">
                            <p className="hero__description StartAnimation">Loved by thousands of community members, this creation contains real green tea powder</p>
                            <HeroButton />
                        </div>
                    </div>
                    <h4 className="hero__tagline StartAnimation">you deserve this</h4>
                </div>
            </section>

            <section className="drinks">
                <div className="drinks__bg">
                    <div className="drinks__bg-stripes" />
                </div>

                <div className="parallax_component">
                    <div className="parallax_image-col">
                        <img src="/images/coffee/img 1.png" alt="coffee 1" data-speed=".2" loading="lazy"/>
                    </div>
                    <div className="parallax_image-col">
                        <img src="/images/coffee/img 2.png" alt="coffee 2" data-speed="0" loading="lazy"/>
                    </div>
                    <div className="parallax_image-col">
                        <img src="/images/coffee/img 3.png" alt="coffee 3" data-speed="-.3" loading="lazy"/>
                    </div>
                    <div className="parallax_image-col">
                        <img src="/images/coffee/img 4.png" alt="coffee 4" data-speed=".6" loading="lazy"/>
                    </div>
                    <div className="parallax_image-col">
                        <img src="/images/coffee/img 5.png" alt="coffee 5" data-speed=".1" loading="lazy"/>
                    </div>
                    <div className="parallax_image-col">
                        <img src="/images/coffee/img 6.png" alt="coffee 6" data-speed="-.1" loading="lazy"/>
                    </div>
                </div>

                <div className="drinks__content">
                    <div className="drinks__content-wrapper">
                        <div className="drinks__text drinks__specialty--text">
                            <h6 className="drinks__title drinks__text-anim">Specialt drinks available...</h6>
                            <p className="drinks__description drinks__text-anim">Signature drinks made with thoughtfully selected ingredients, inspired by Japanese precision and contemporary coffee culture.</p>
                        </div>
                        <div className="drinks__text drinks__hot-cold--text">
                            <h6 className="drinks__title drinks__text-anim">Hot and cold drinks available</h6>
                            <p className="drinks__description drinks__text-anim">Carefully crafted drinks made with high-quality ingredients, balancing smooth warmth and crisp, refreshing character.</p>
                        </div>
                    </div>
                </div>

                <div className="drinks-transition">
                    <div className="drinks-transition__column" />
                    <div className="drinks-transition__column" />
                    <div className="drinks-transition__column" />
                    <div className="drinks-transition__column" />
                    <div className="drinks-transition__column" />
                    <div className="drinks-transition__column" />
                </div>
            </section>

            <section className="about" aria-labelledby="about-title">
                <div className="about__block">
                    <p className="about__label">ABOUT US</p>
                    <h6 className="about__title">We are a modern café focused on quality, simplicity, and intention. We work with carefully sourced matcha and specialty coffee, paying attention to origin, process, and balance. Every detail — from ingredients to atmosphere — is designed to create a calm, thoughtful experience.</h6>
                    <p className="about__text">In August 2020, we launched our first location, a 5x10 coffee cart nestled in the garden of the Wythe diner in Brooklyn. Our operation was simple and our footprint was small, which let us remove costs that didn’t benefit our customers or baristas. This allowed us to source top of the range specialty coffees from around the world, serve clean and fresh food sourced locally, and pay our baristas above market wages.</p>
                    <Button_wth_ind className="about__button">View all information about us</Button_wth_ind>
                </div>
            </section>

            <div className="home-shop">
                <div className="home-shop__list">
                    <div className="home-shop__item">
                        <div className="home-shop__image">
                            <div className="home-shop__image-items" ref={imagesItemRef1}>
                                {strip(0).map((p, i) => (
                                    <img key={i} src={p.img} alt={p.alt} loading="lazy"/>
                                ))}
                            </div>
                        </div>
                        <div className="home-shop__content" ref={contentRef1}>
                            <div className="home-shop__header">
                                <h6 className="home-shop__title">{p1.title}</h6>
                                <p className="home-shop__price">{p1.price}</p>
                            </div>
                            <p className="home-shop__description">{p1.desc}</p>
                        </div>
                    </div>

                    <div className="home-shop__item">
                        <div className="home-shop__image">
                            <div className="home-shop__image-items" ref={imagesItemRef2}>
                                {strip(1).map((p, i) => (
                                    <img key={i} src={p.img} alt={p.alt} loading="lazy"/>
                                ))}
                            </div>
                        </div>
                        <div className="home-shop__content" ref={contentRef2}>
                            <div className="home-shop__header">
                                <h6 className="home-shop__title">{p2.title}</h6>
                                <p className="home-shop__price">{p2.price}</p>
                            </div>
                            <p className="home-shop__description">{p2.desc}</p>
                        </div>
                    </div>

                    <div className="home-shop__item">
                        <div className="home-shop__image">
                            <div className="home-shop__image-items" ref={imagesItemRef3}>
                                {strip(2).map((p, i) => (
                                    <img key={i} src={p.img} alt={p.alt} loading="lazy"/>
                                ))}
                            </div>
                        </div>
                        <div className="home-shop__content" ref={contentRef3}>
                            <div className="home-shop__header">
                                <h6 className="home-shop__title">{p3.title}</h6>
                                <p className="home-shop__price">{p3.price}</p>
                            </div>
                            <p className="home-shop__description">{p3.desc}</p>
                        </div>
                    </div>
                </div>

                <div className="home-shop__divider">
                    <div className="home-shop__item-count--block">
                        <span>item</span>
                        <div className="item-count--num" ref={countRef}>
                            {current}/{total}
                        </div>
                        <span>Count</span>
                    </div>

                    <div className="home-shop__nav">
                        <button className="home-shop__nav-btn home-shop__nav-btn--prev" type="button" aria-label="Previous" onClick={onPrev}>
                            <svg className="home-shop__arrow home-shop__arrow--prev" width="42" height="17" viewBox="0 0 42 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.322281 7.32277C-0.107296 7.75235 -0.107296 8.44883 0.322281 8.8784L7.32264 15.8788C7.75221 16.3083 8.4487 16.3083 8.87827 15.8788C9.30785 15.4492 9.30785 14.7527 8.87827 14.3231L2.65573 8.10059L8.87827 1.87805C9.30785 1.44847 9.30785 0.751988 8.87827 0.322411C8.4487 -0.107165 7.75221 -0.107165 7.32264 0.322411L0.322281 7.32277ZM41.1001 8.10059V7.00059L1.1001 7.00059V8.10059V9.20059L41.1001 9.20059V8.10059Z" fill="#F1EDE1" />
                            </svg>
                        </button>

                        <button className="home-shop__nav-btn home-shop__nav-btn--next" type="button" aria-label="Next" onClick={onNext}>
                            <svg className="home-shop__arrow home-shop__arrow--next" width="42" height="17" viewBox="0 0 42 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40.7778 7.32277C41.2074 7.75235 41.2074 8.44883 40.7778 8.8784L33.7775 15.8788C33.3479 16.3083 32.6514 16.3083 32.2218 15.8788C31.7922 15.4492 31.7922 14.7527 32.2218 14.3231L38.4444 8.10059L32.2218 1.87805C31.7922 1.44847 31.7922 0.751988 32.2218 0.322411C32.6514 -0.107165 33.3479 -0.107165 33.7775 0.322411L40.7778 7.32277ZM0 8.10059L0 7.00059L40 7.00059V8.10059V9.20059L0 9.20059L0 8.10059Z" fill="#F1EDE1" />
                            </svg>
                        </button>
                    </div>

                    <button className="home-shop--button">Browse all</button>
                </div>
            </div>
        </main>
    );
}
