"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { GateLink } from "../LoaderGate";
import Logo from "../Logo";

gsap.registerPlugin(CustomEase);
const ease=CustomEase.create("menu","M0,0 C.7,0 .3,1 1,1");

export default function Header(){
    const helper=useRef(),burger=useRef(),burgerM=useRef(),lineA=useRef(),lineB=useRef(),lineAm=useRef(),lineBm=useRef(),navBurger=useRef(),navBurgerM=useRef(),open=useRef(false);

    const close=()=>{
        if(!open.current)return;
        gsap.set([lineA.current,lineB.current,lineAm.current,lineBm.current],{rotate:0,transform:"translateY(0%)"});
        gsap.set(burger.current,{gap:5});gsap.set(burgerM.current,{gap:5});
        burger.current?.classList.remove("is-open");
        gsap.set(helper.current,{height:40,width:40,borderRadius:0,autoRound:false});
        gsap.set(navBurger.current,{display:"none",opacity:0,scale:.95});
        gsap.set(navBurgerM.current,{display:"none",opacity:0,height:60,scale:.95,borderRadius:0});
        gsap.set(".header__logo",{opacity:1});
        open.current=false;
    };

    const toggle=()=>{const o=open.current;gsap.to([lineA.current,lineB.current],{duration:.25,rotate:i=>o?0:i?45:-45,transform:i=>o?"translateY(0%)":i?"translateY(-50%)":"translateY(50%)",ease});gsap.to(burger.current,{duration:.25,gap:o?5:0,ease});burger.current?.classList.toggle("is-open",!o);gsap.to(helper.current,{duration:.35,height:o?40:320,width:o?40:580,borderRadius:o?0:12,autoRound:false,ease});gsap.to(navBurger.current,{duration:o?.25:.5,display:o?"none":"flex",opacity:o?0:1,scale:o?.95:1,ease});open.current=!o;};
    const toggleM=()=>{const o=open.current;gsap.to(".header__logo",{duration:.15,opacity:o?1:0});gsap.to(burgerM.current,{duration:.25,gap:o?5:0,ease});gsap.to([lineAm.current,lineBm.current],{duration:.25,rotate:i=>o?0:i?45:-45,transform:i=>o?"translateY(0%)":i?"translateY(-50%)":"translateY(50%)",ease});gsap.to(navBurgerM.current,{duration:.35,display:o?"none":"flex",opacity:o?0:1,height:o?60:270,scale:o?.95:1,borderRadius:o?0:12,ease:"back.inOut"});open.current=!o;};

    return(
        <>
            <header className="header header--desktop">
                <div className="header__wrapper">
                    <GateLink href="/" onClick={close}><Logo className="header__logo logo" /></GateLink>
                    <div className="header__actions">
                        <GateLink href="/product" onClick={close}><button className="header__button">buy now</button></GateLink>
                        <button className="header__burger header__burger--desktop" ref={burger} onClick={toggle}>
                            <div className="header__burger__polosa" ref={lineA} />
                            <div className="header__burger__polosa" ref={lineB} />
                        </button>
                        <div className="header__burger--desktop-helper" ref={helper} />
                    </div>
                    <nav className="header-nav" aria-label="Primary navigation" ref={navBurger}>
                        <ul className="header-nav__list">
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/" onClick={close}><span>Home Page</span><div className="header-nav__marker" /></GateLink></li>
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/about" onClick={close}><span>About Us</span><div className="header-nav__marker" /></GateLink></li>
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/location" onClick={close}><span>Location</span><div className="header-nav__marker" /></GateLink></li>
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/careers" onClick={close}><span>Careers</span><div className="header-nav__marker" /></GateLink></li>
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/product" onClick={close}><span>Product</span><div className="header-nav__marker" /></GateLink></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <header className="header header--mobile">
                <div className="header__wrapper">
                    <GateLink href="/" onClick={close}><Logo className="header__logo logo" /></GateLink>
                    <button className="header__burger" ref={burgerM} onClick={toggleM}><div className="header__burger__polosa" ref={lineAm} /><div className="header__burger__polosa" ref={lineBm} /></button>
                    <nav className="header-nav" aria-label="Primary navigation" ref={navBurgerM}>
                        <ul className="header-nav__list">
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/" onClick={close}><span>Home Page</span><div className="header-nav__marker" /></GateLink></li>
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/about" onClick={close}><span>About Us</span><div className="header-nav__marker" /></GateLink></li>
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/location" onClick={close}><span>Location</span><div className="header-nav__marker" /></GateLink></li>
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/careers" onClick={close}><span>Careers</span><div className="header-nav__marker" /></GateLink></li>
                            <li className="header-nav__item"><GateLink className="header-nav__link" href="/product" onClick={close}><span>Product</span><div className="header-nav__marker" /></GateLink></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}
