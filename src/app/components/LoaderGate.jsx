"use client";

import { useEffect,useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
const ease=CustomEase.create("menu","M0,0 C.7,0 .3,1 1,1");

export function pageReady(){if(typeof window!=="undefined")window.__pageReady?.();}
export function holdPage(){if(typeof window!=="undefined")window.__holdPage?.();}

export default function LoaderGate(){
    const pathname=usePathname(),win=useRef(false),page=useRef(true),hold=useRef(false),unlocked=useRef(false);

    const unlock=()=>{if(unlocked.current||!win.current||!page.current)return;unlocked.current=true;gsap.to(".vlock",{duration:.5,scale:0,ease});};

    useEffect(()=>{
        gsap.set(".vlock",{scale:1,transformOrigin:"50% 50%"});
        window.__holdPage=()=>{hold.current=true;page.current=false;};
        window.__pageReady=()=>{page.current=true;unlock();};
        const onLoad=()=>{win.current=true;unlock();};
        if(document.readyState==="complete")onLoad();else window.addEventListener("load",onLoad);
        return()=>{delete window.__holdPage;delete window.__pageReady;window.removeEventListener("load",onLoad);};
    },[]);

    useEffect(()=>{
        hold.current=false;unlocked.current=false;page.current=true;
        gsap.set(".vlock",{scale:1});
        requestAnimationFrame(()=>{if(!hold.current)unlock();});
    },[pathname]);

    return null;
}
