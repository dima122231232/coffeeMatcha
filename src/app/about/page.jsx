"use client";


import "./page.css";
import { useEffect } from "react";
import { splitTextToSpans } from "@/app/components/Algoritms/splitTextToSpans";
import { CustomEase } from "gsap/CustomEase";
import { gsap } from "gsap";
gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

export default function AboutPage() {
    useEffect(() => { 
        [".StartAnimation"].forEach((s) => splitTextToSpans(s, { className: "word" }));
        gsap.set(".StartAnimation .word", { "--p": "0%" });
        gsap.to(".StartAnimation .word", { "--p": "110%", duration: 0.8, delay: 0.2, ease, stagger: 0.005, overwrite: true });
    }, []);
  return (
    <main className="about-page" aria-labelledby="about-title">
        <div className="about-page__container">
            <h1 className="about-page__title StartAnimation">
                Made to brighten your every morning
            </h1>

            <div className="about-page__layout">
                <nav className="about-page__nav" aria-label="About navigation">
                    <ul className="about-page__nav-list StartAnimation">
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/privacy">Privacy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a></li>
                    </ul>
                </nav>
                <article className="about-page__text StartAnimation" aria-labelledby="about-story">When we started Blank Street, we set out to reimagine what a coffee shop could be. Serving a clean, natural, and high quality menu to our customers at affordable prices.<br/><br/>In August 2020, we launched our first location, a 5x10 coffee cart nestled in the garden of the Wythe diner in Brooklyn. Our operation was simple and our footprint was small, which let us remove costs that didn’t benefit our customers or baristas. This allowed us to source top of the rangespecialty coffees from around the world, serve clean and fresh food sourced locally, and pay our baristas above market wages.<br/><br/>However brief your coffee ritual, it sets the tone for your day. It’s rituals like these that give us a sense of structure, place, and confidence to take on the world. Rituals matter, and great rituals make your life better. That is why we invest so much time perfecting every detail in our customer experience.<br/><br/>Today, we’ve grown, opening locations across New York, London, Boston, and DC. Across them all, we’re offering an all around better ritual.<br/>See you in store.</article>
            </div>
        </div>
    </main>

  );
}