"use client";
import "./page.css";
import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button_wth_ind from "../components/Buttons/Button_without_indents";
gsap.registerPlugin(ScrollTrigger);

function ProductCard({ item, onNotify }) {
    return (
        <div className="product-card">
            <div className="product-card__inner">
                <div className={`product-card__image${item.isMerch ? " merch" : ""}`}>
                    <img src={item.imgSrc} alt={item.imgAlt || "product"} />
                </div>
                <div className="product-card__content">
                    <div className="product-card__header">
                        <h6 className="product-card__title">{item.title}</h6>
                        <span className="product-card__price">{item.price}</span>
                    </div>
                    <p className="product-card__description">{item.description}</p>
                </div>
                <button className="product-card__cta" type="button" onClick={onNotify}>{item.ctaText || "notify me when back in stock"}</button>
            </div>
        </div>
    );
}

export default function ShopPage() {
    const pathname = usePathname(), tl = useRef(null);

    const products = useMemo(() => [
        { id:"p1", title:"Darker Roast", price:"From $12.95", description:"Deep espresso blend with intense cocoa and roasted almond notes", imgSrc:"/images/product/item 1.png", imgAlt:"espresso cup" },
        { id:"p2", title:"Iced Matcha Latte", price:"From $12.95", description:"Smooth ceremonial matcha layered with fresh milk and light sweetness", imgSrc:"/images/product/item 2.png", imgAlt:"iced matcha latte" },
        { id:"p3", title:"Classic Cappuccino", price:"From $12.95", description:"Velvety steamed milk with balanced espresso and creamy foam top", imgSrc:"/images/product/item 3.png", imgAlt:"cappuccino cup" },
        { id:"p4", title:"Lavender Latte", price:"From $12.95", description:"Floral lavender infusion blended with silky milk and espresso", imgSrc:"/images/product/item 4.png", imgAlt:"lavender latte" },
        { id:"p6", title:"Premium Matcha Tin", price:"From $12.95", description:"Finely ground green tea powder with vibrant color and fresh aroma", imgSrc:"/images/product/item12.png", imgAlt:"matcha tin" },
        { id:"p7", title:"Signature Coffee Jar", price:"From $12.95", description:"Small batch roasted beans sealed for rich and lasting freshness", imgSrc:"/images/product/item13.png", imgAlt:"coffee jar" },
        { id:"p8", title:"Java Hoodie", price:"From $12.95", description:"Soft heavyweight hoodie with relaxed fit and minimalist design", imgSrc:"/images/product/item5.png", imgAlt:"green hoodie", isMerch:true },
        { id:"p9", title:"Java Crewneck", price:"From $12.95", description:"Premium cotton sweatshirt with clean silhouette and comfort feel", imgSrc:"/images/product/item6.png", imgAlt:"crewneck sweatshirt", isMerch:true },
        { id:"p10", title:"Classic Cap", price:"From $12.95", description:"Structured cotton cap with embroidered logo and adjustable strap", imgSrc:"/images/product/item7.png", imgAlt:"green cap", isMerch:true },
        { id:"p11", title:"Travel Mug", price:"From $12.95", description:"Durable ceramic mug featuring illustrated city coffee artwork", imgSrc:"/images/product/item8.png", imgAlt:"illustrated mug", isMerch:true },
        { id:"p12", title:"Collector Mug", price:"From $12.95", description:"Limited edition ceramic mug with vibrant wraparound print", imgSrc:"/images/product/item9.png", imgAlt:"collector mug", isMerch:true },
        { id:"p13", title:"California Mug", price:"From $12.95", description:"Bright illustrated mug inspired by sunny west coast mornings", imgSrc:"/images/product/item10.png", imgAlt:"california mug", isMerch:true }
    ], []);

    useEffect(() => { gsap.fromTo(".products__hero-image",{yPercent:0},{yPercent:30,ease:"none",scrollTrigger:{trigger:".products__hero",start:"top top",end:"bottom top",scrub:1,invalidateOnRefresh:true}}); gsap.fromTo(".products__hero-title",{clipPath:"polygon(0 0%,100% 0%,100% 97%,0% 97%)"},{clipPath:"polygon(0 100%,100% 100%,100% 100%,0% 100%)",ease:"none",scrollTrigger:{trigger:".products__hero",start:"top top",end:"20% top",scrub:1,invalidateOnRefresh:true}}); }, []);

    useEffect(() => { document.body.dataset.path = pathname; return () => delete document.body.dataset.path; }, [pathname]);

    useEffect(() => { gsap.set(".notify",{display:"none",autoAlpha:0}); gsap.set(".notify-bk",{backgroundColor:"rgba(232,239,228,0)"}); tl.current = gsap.timeline({paused:true}).set(".notify",{display:"flex"}).to(".notify",{autoAlpha:1,duration:.2,ease:"power2.out"},0).to(".notify-bk",{backgroundColor:"rgba(232,239,228,.7)",duration:.25,ease:"power2.out"},0); return () => tl.current?.kill(); }, []);

    const openNotify = () => tl.current?.play(0);
    const closeNotify = () => tl.current?.reverse();

    return (
        <main className="products">
            <div className="products__hero">
                <img className="products__hero-image" src="/images/product/bk.webp" alt="" />
                <h2 className="products__hero-title">Curated coffee matcha and merch.</h2>
            </div>

            <section className="products__section">
                <nav className="products__controls" aria-label="Product filters and sorting">
                    <div className="products__controls-inner">
                        <span className="products__count">({products.length}) Products</span>
                        <button className="products__filters-toggle" type="button">filters</button>
                        <div className="products__sort">
                            <button className="products__sort-trigger" type="button">
                                <span className="products__sort-label">Sort by: <i>All</i></span>
                                <svg className="products__sort-icon" width="15" height="9" viewBox="0 0 15 9">
                                    <path d="M1 1l6.5 6.5L14 1" fill="none" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                            <ul className="products__sort-dropdown">
                                <li className="products__sort-option">All</li>
                                <li className="products__sort-option">Newest</li>
                                <li className="products__sort-option">Price: Low → High</li>
                                <li className="products__sort-option">Price: High → Low</li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="products__catalog">
                    {products.map(item => <ProductCard key={item.id} item={item} onNotify={openNotify} />)}
                </div>
            </section>

            <div className="notify">
                <div className="notify-bk" onMouseDown={closeNotify}></div>
                <div className="notify__block" role="dialog" aria-modal="true">
                    <button className="notify-close" type="button" aria-label="Close" onClick={closeNotify}>
                        <div className="notify-close-pl"></div>
                        <div className="notify-close-pl nfPl2"></div>
                    </button>
                    <form className="notify__form">
                        <label className="notify__label" htmlFor="notify-email">EMAIL *</label>
                        <input className="notify__input" id="notify-email" type="email" name="email" placeholder="YOUR EMAIL ADDRESS" required autoComplete="email" />
                        <Button_wth_ind type="submit" className="notify__button">Notify me when available</Button_wth_ind>
                    </form>
                </div>
            </div>
        </main>
    );
}