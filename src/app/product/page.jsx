"use client";
import "./page.css";
import { useEffect,useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button_wth_ind from "../components/Buttons/Button_without_indents";
gsap.registerPlugin(ScrollTrigger);

export default function ShopPage(){
    const pathname=usePathname(),tl=useRef(null);

    useEffect(()=>{
        gsap.fromTo(".products__hero-image",{yPercent:0},{yPercent:30,ease:"none",scrollTrigger:{trigger:".products__hero",start:"top top",end:"bottom top",scrub:1,invalidateOnRefresh:true}});
        gsap.fromTo(".products__hero-title",{clipPath:"polygon(0 0%,100% 0%,100% 97%,0% 97%)"},{clipPath:"polygon(0 100%,100% 100%,100% 100%,0% 100%)",ease:"none",scrollTrigger:{trigger:".products__hero",start:"top top",end:"20% top",scrub:1,invalidateOnRefresh:true}});
    },[]);

    useEffect(()=>{document.body.dataset.path=pathname;return()=>delete document.body.dataset.path;},[pathname]);

    useEffect(()=>{
        gsap.set(".notify",{display:"none",autoAlpha:0});
        gsap.set(".notify-bk",{backgroundColor:"rgba(232,239,228,0)"});
        tl.current=gsap.timeline({paused:true})
            .set(".notify",{display:"flex"})
            .to(".notify",{autoAlpha:1,duration:.2,ease:"power2.out"},0)
            .to(".notify-bk",{backgroundColor:"rgba(232,239,228,.7)",duration:.25,ease:"power2.out"},0);
        return()=>tl.current?.kill();
    },[]);

    const openNotify=()=>tl.current?.play(0);
    const closeNotify=()=>tl.current?.reverse();

    return (
        <main className="products">
            <div className="products__hero">
                <img className="products__hero-image" src="/images/product/bk.webp" alt="" />
                <h2 className="products__hero-title">Curated coffee matcha and merch.</h2>
            </div>

            <section className="products__section">
                <nav className="products__controls" aria-label="Product filters and sorting">
                    <div className="products__controls-inner">
                        <span className="products__count">(6) Products</span>
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
                    <div className="product-card">
                        <div className="product-card__inner">
                            <div className="product-card__image">
                                <img src="/images/product/item 1.png" alt="coffee, product" />
                            </div>
                            <div className="product-card__content">
                                <div className="product-card__header">
                                    <h6 className="product-card__title">Darker Roast</h6>
                                    <span className="product-card__price">From $12.95</span>
                                </div>
                                <p className="product-card__description">Deep, rich flavor with bold chocolate notes</p>
                            </div>
                            <button className="product-card__cta" type="button" onClick={openNotify}>notify me when back in stock</button>
                        </div>
                    </div>

                    <div className="product-card">
                        <div className="product-card__inner">
                            <div className="product-card__image">
                                <img src="/images/product/item 2.png" alt="coffee, product" />
                            </div>
                            <div className="product-card__content">
                                <div className="product-card__header">
                                    <h6 className="product-card__title">Darker Roast asdasd asda</h6>
                                    <span className="product-card__price">From $12.95</span>
                                </div>
                                <p className="product-card__description">Deep, rich flavor with bold chocolate notes</p>
                            </div>
                            <button className="product-card__cta" type="button" onClick={openNotify}>notify me when back in stock</button>
                        </div>
                    </div>

                    <div className="product-card">
                        <div className="product-card__inner">
                            <div className="product-card__image">
                                <img src="/images/product/item 3.png" alt="coffee, product" />
                            </div>
                            <div className="product-card__content">
                                <div className="product-card__header">
                                    <h6 className="product-card__title">Darker Roast</h6>
                                    <span className="product-card__price">From $12.95</span>
                                </div>
                                <p className="product-card__description">Deep, rich flavor with bold chocolate notes</p>
                            </div>
                            <button className="product-card__cta" type="button" onClick={openNotify}>notify me when back in stock</button>
                        </div>
                    </div>

                    <div className="product-card">
                        <div className="product-card__inner">
                            <div className="product-card__image">
                                <img src="/images/product/item 1.png" alt="coffee, product" />
                            </div>
                            <div className="product-card__content">
                                <div className="product-card__header">
                                    <h6 className="product-card__title">Darker Roast</h6>
                                    <span className="product-card__price">From $12.95</span>
                                </div>
                                <p className="product-card__description">Deep, rich flavor with bold chocolate notes</p>
                            </div>
                            <button className="product-card__cta" type="button" onClick={openNotify}>notify me when back in stock</button>
                        </div>
                    </div>

                    <div className="product-card">
                        <div className="product-card__inner">
                            <div className="product-card__image">
                                <img src="/images/product/item 2.png" alt="coffee, product" />
                            </div>
                            <div className="product-card__content">
                                <div className="product-card__header">
                                    <h6 className="product-card__title">Darker Roast asdasd asda</h6>
                                    <span className="product-card__price">From $12.95</span>
                                </div>
                                <p className="product-card__description">Deep, rich flavor with bold chocolate notes</p>
                            </div>
                            <button className="product-card__cta" type="button" onClick={openNotify}>notify me when back in stock</button>
                        </div>
                    </div>

                    <div className="product-card">
                        <div className="product-card__inner">
                            <div className="product-card__image merch">
                                <img src="/images/product/item 4.png" alt="coffee, product" />
                            </div>
                            <div className="product-card__content">
                                <div className="product-card__header">
                                    <h6 className="product-card__title">Darker Roast</h6>
                                    <span className="product-card__price">From $12.95</span>
                                </div>
                                <p className="product-card__description">Deep, rich flavor with bold chocolate notes</p>
                            </div>
                            <button className="product-card__cta" type="button" onClick={openNotify}>notify me when back in stock</button>
                        </div>
                    </div>
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
                        <input className="notify__input" id="notify-email" type="email" name="email" placeholder="YOUR EMAIL ADDRESS" required autoComplete="email"/>
                        <Button_wth_ind type="submit" className="notify__button">Notify me when available</Button_wth_ind>
                    </form>
                </div>
            </div>
        </main>
    );
}
