import { gsap } from "gsap";

export const cursorParallax = (el, { max = 18, duration = .3 } = {}) => {
    const box = el.closest(".locations__map-wrapper") || el.parentElement || el,
          xTo = gsap.quickTo(el, "x", { duration, ease: "power3.out" }),
          yTo = gsap.quickTo(el, "y", { duration, ease: "power3.out" });

    gsap.set(el, { x: 0, y: 0, willChange: "transform" });

    const move = e => {
        const r = box.getBoundingClientRect(),
              nx = ((e.clientX - r.left) / r.width - .5) * 2,
              ny = ((e.clientY - r.top) / r.height - .5) * 2;
        xTo(-nx * max); yTo(-ny * max);
    };

    const reset = () => (xTo(0), yTo(0));

    box.addEventListener("pointermove", move, { passive: true });
    box.addEventListener("pointerleave", reset, { passive: true });

    return () => {
        box.removeEventListener("pointermove", move);
        box.removeEventListener("pointerleave", reset);
        gsap.killTweensOf(el);
    };
};
