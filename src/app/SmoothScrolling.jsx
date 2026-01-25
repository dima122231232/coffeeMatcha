"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrolling({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      smooth: true,
      lerp: 0.075,
      touchMultiplier: 1,
    });

    function raf(time) {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current.destroy();
    };
  }, []);

  return <>{children}</>;
}
