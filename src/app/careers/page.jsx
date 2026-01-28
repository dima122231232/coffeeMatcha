"use client";

import "./page.css"
import Button_wth_ind from "../components/Buttons/Button_without_indents";
import { useEffect} from "react";
import { gsap } from "gsap";
import { splitTextToSpans } from "@/app/components/Algoritms/splitTextToSpans";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

export default function CareersPage() {
    useEffect(() => { 
        [".StartAnimation"].forEach((s) => splitTextToSpans(s, { className: "word" }));
        gsap.set(".StartAnimation .word", { "--p": "0%" });
        gsap.to(".StartAnimation .word", { "--p": "110%", duration: 1, delay: 0.2, ease, stagger: 0.005, overwrite: true });
    }, []);   
  return (
    <main className="careers">
        <div className="careers__content">
            <h3 className="careers__title StartAnimation">Join Our Team</h3>
            <p className="careers__text StartAnimation">
            Become a part of a passionate, creative team that loves coffee as much as you do. Grow, learn, and help us craft unforgettable experiences for every cup.
            </p>
            <Button_wth_ind className="careers__cta StartAnimation">JOIN US</Button_wth_ind>
        </div>

        <img className="careers__image" src="/images/JOT_bk.png" alt="" />
    </main>

  );
}