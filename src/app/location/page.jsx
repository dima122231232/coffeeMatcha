"use client";

import "./page.css";
import { cursorParallax } from "@/app/components/Algoritms/cursorParallax";
import { useEffect, useRef, useState } from "react";

const LOC=[
    {city:"new-york",label:"New York",text:"71st Lex 985 Lexington Avenue, New York, NY 10021",pos:["40%","25%"],photo:"/images/map photo/mp1.jpg",href:"/11"},
    {city:"new-york",label:"New York",text:"SoHo 123 Prince St, New York, NY 10012",pos:["22%","52%"],photo:"/images/map photo/mp2.jpg",href:"/11"},
    {city:"london",label:"London",text:"Oxford Circus 12 Regent St, London W1B 5RA",pos:["37%","30%"],photo:"/images/map photo/mp3.jpg",href:"/11"},
    {city:"london",label:"London",text:"Camden Market 54 Chalk Farm Rd, London NW1",pos:["22%","44%"],photo:"/images/map photo/mp4.jpg",href:"/11"},
    {city:"paris",label:"Paris",text:"Le Marais 21 Rue Vieille du Temple, Paris",pos:["41%","36%"],photo:"/images/map photo/mp5.jpg",href:"/11"},
    {city:"berlin",label:"Berlin",text:"Mitte Rosenthaler Str. 10, Berlin",pos:["54%","27%"],photo:"/images/map photo/mp6.jpg",href:"/11"}
];

export default function LocationPage(){
    const map=useRef(null),box=useRef(null),list=useRef(null);
    const [city,setCity]=useState(LOC[0].label);
    const [a,setA]=useState(-1);
    const [tr,setTr]=useState({s:1,x:0,y:0});
    const [rot,setRot]=useState(0);

    const zoomTo=i=>{
        const r=box.current?.getBoundingClientRect(); if(!r)return;
        const s=1.4,lx=parseFloat(LOC[i].pos[0])/100,ty=parseFloat(LOC[i].pos[1])/100;
        const x=lx*r.width,y=ty*r.height;
        setTr({s,x:r.width/2-x*s,y:r.height/2-y*s});
    };

    const pickRot=()=>Math.round(((Math.random()*12)-6)*10)/10;
    const reset=()=>{setA(-1);setTr({s:1,x:0,y:0});};
    const focus=i=>{setA(i);setCity(LOC[i].label);setRot(pickRot());zoomTo(i);};

    useEffect(()=>{
        list.current?.scrollTo(0,40);
        return cursorParallax(map.current,{max:100,duration:.5});
    },[]);

    return(
        <main className={`locations ${a!==-1?"is-focus":""}`}>
            <div className="locations__wrapper">
                <section className="locations__panel">
                    <h1 className="locations__title">locations <span className="city">- {city}</span></h1>
                    <ul className="locations__address-list" ref={list} data-lenis-prevent onMouseLeave={reset}>
                        {LOC.map((x,i)=>(
                            <li key={i} className={`locations__address-item city--${x.city}`}
                                onMouseEnter={()=>focus(i)}
                                onClick={()=>window.location.href=x.href}>
                                {x.text}
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="locations__map">
                    <div className="locations__map-wrapper" ref={box} onMouseLeave={reset}>
                        <div className="locations__map-inner" ref={map}>
                            <div className="map-zoom" style={{transform:`translate(${tr.x}px,${tr.y}px) scale(${tr.s})`}}>
                                <img src="/images/map.png" alt="map" className="map"/>
                                {LOC.map((x,i)=>(
                                    <div key={i} className={`map-marker city--${x.city} ${i===a?"is-active":""}`}
                                         style={{left:x.pos[0],top:x.pos[1]}} onMouseEnter={()=>focus(i)}>
                                        {i===a&&(
                                            <figure className="marker-photo" style={{transform:`translate(14px,-50%) rotate(${rot}deg)`}}>
                                                <img src={x.photo} alt={x.label} draggable="false"/>
                                            </figure>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
