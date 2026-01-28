"use client";

import Link from "next/link";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("menu", "M0,0 C.7,0 .3,1 1,1");

/**
 * Gate API
 * - No window.__* globals
 * - Isolated GSAP via refs + cleanup
 * - Small state-machine via refs (no setState → safe against render loops)
 */

const GateCtx = createContext(null);

// module-level bridge to allow calling holdPage/pageReady without hooks
const _pending = { hold: false, ready: false };
let _api = null;

export function holdPage() {
    _pending.hold = true;
    _pending.ready = false;
    _api?.hold?.();
}

export function pageReady() {
    _pending.ready = true;
    _pending.hold = false;
    _api?.ready?.();
}

export function useGateNav() {
    const pathname = usePathname();
    const gate = useContext(GateCtx);
    const busy = useRef(false);

    const is = (href) => (pathname === href ? "page" : undefined);

    const go = async (e, href) => {
        if (!e || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
        if (typeof href !== "string" || /^(https?:|mailto:|tel:)/.test(href)) return;
        if (href === pathname) return;
        e.preventDefault();
        if (busy.current) return;
        busy.current = true;

        try {
            if (!gate?.navigate) return void (window.location.href = href);
            await gate.navigate(href);
        } finally {
            // reset happens on pathname change too, but this protects against errors
            busy.current = false;
        }
    };

    useEffect(() => {
        busy.current = false;
    }, [pathname]);

    return { is, go, pathname };
}

export function GateLink({ href, children, onClick, ariaCurrent, ...props }) {
    const { is, go } = useGateNav();
    const h = typeof href === "string" ? href : href?.pathname || "";
    return (
        <Link
            href={href}
            aria-current={ariaCurrent ?? is(h)}
            onClick={(e) => {
                onClick?.(e);
                go(e, h);
            }}
            {...props}
        >
            {children}
        </Link>
    );
}

export default function LoaderGate({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const vlockEl = useRef(null);
    const winLoaded = useRef(false);
    const hold = useRef(false);
    const ready = useRef(true); // default: page is ready unless it calls holdPage()
    const unlocked = useRef(false);
    const inTransition = useRef(false);
    const ctxRef = useRef(null);

    const getVlock = () => vlockEl.current || document.querySelector(".vlock");

    const lockAnim = useCallback(async () => {
        const el = getVlock();
        if (!el) return;
        vlockEl.current = el;
        gsap.killTweensOf(el);
        unlocked.current = false;
        await gsap.to(el, { duration: 0.5, scale: 1, ease, overwrite: true });
    }, []);

    const unlockAnim = useCallback(() => {
        const el = getVlock();
        if (!el) return;
        vlockEl.current = el;
        gsap.killTweensOf(el);
        unlocked.current = true;
        gsap.to(el, { duration: 0.5, scale: 0, ease, overwrite: true });
    }, []);

    const tryUnlock = useCallback(() => {
        if (unlocked.current) return;
        if (!winLoaded.current) return;
        if (hold.current) return;
        if (!ready.current) return;
        unlockAnim();
    }, [unlockAnim]);

    const api = useMemo(
        () => ({
            hold: () => {
                hold.current = true;
                ready.current = false;
            },
            ready: () => {
                ready.current = true;
                hold.current = false;
                tryUnlock();
            },
            navigate: async (href) => {
                if (inTransition.current) return;
                inTransition.current = true;
                try {
                    await lockAnim();
                    router.push(href);
                } finally {
                    // pathname effect will continue the flow
                    inTransition.current = false;
                }
            },
        }),
        [lockAnim, router, tryUnlock]
    );

    // Provide api for non-hook calls (holdPage/pageReady)
    useEffect(() => {
        _api = api;
        return () => {
            if (_api === api) _api = null;
        };
    }, [api]);

    // Mount: bind to window load + init vlock
    useLayoutEffect(() => {
        const el = getVlock();
        if (el) {
            vlockEl.current = el;
            ctxRef.current = gsap.context(() => {
                gsap.set(el, { scale: 1, transformOrigin: "50% 50%", willChange: "transform" });
            });
        }

        const onLoad = () => {
            winLoaded.current = true;
            tryUnlock();
        };

        if (document.readyState === "complete") onLoad();
        else window.addEventListener("load", onLoad);

        // Apply any early calls made before mount
        if (_pending.hold) api.hold();
        if (_pending.ready) api.ready();

        return () => {
            window.removeEventListener("load", onLoad);
            ctxRef.current?.revert?.();
            ctxRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Route change: reset to locked, then unlock unless page requested hold.
    useEffect(() => {
        hold.current = _pending.hold;
        ready.current = !_pending.hold;
        unlocked.current = false;

        const el = getVlock();
        if (el) {
            gsap.killTweensOf(el);
            gsap.set(el, { scale: 1 });
        }

        // Give the new page 1 frame to call holdPage(); if it doesn't → unlock.
        requestAnimationFrame(() => {
            if (!hold.current) {
                ready.current = true;
                tryUnlock();
            }
        });
    }, [pathname, tryUnlock]);

    return <GateCtx.Provider value={api}>{children}</GateCtx.Provider>;
}
