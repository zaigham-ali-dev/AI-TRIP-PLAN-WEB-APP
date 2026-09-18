(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/animation.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EASE",
    ()=>EASE,
    "EASE_EXPO",
    ()=>EASE_EXPO,
    "prefersReducedMotion",
    ()=>prefersReducedMotion,
    "useIsomorphicLayoutEffect",
    ()=>useIsomorphicLayoutEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gsap/ScrollTrigger.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
;
if ("TURBOPACK compile-time truthy", 1) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].registerPlugin(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollTrigger"]);
}
const useIsomorphicLayoutEffect = ("TURBOPACK compile-time truthy", 1) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"] : "TURBOPACK unreachable";
const prefersReducedMotion = ()=>("TURBOPACK compile-time value", "object") !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "power3.out";
const EASE_EXPO = "expo.out";
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CustomCursor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomCursor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/animation.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const DEFAULT_STATE = {
    variant: "dot",
    label: ""
};
function CustomCursor() {
    _s();
    const ringRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dotRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const labelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_STATE);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomCursor.useEffect": ()=>{
            const fine = window.matchMedia("(pointer: fine)").matches;
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (!fine || reduced) return;
            document.documentElement.dataset.cursor = "active";
            const ring = ringRef.current;
            const dot = dotRef.current;
            if (!ring || !dot) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].set([
                ring,
                dot
            ], {
                xPercent: -50,
                yPercent: -50,
                opacity: 0
            });
            const ringX = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].quickTo(ring, "x", {
                duration: 0.5,
                ease: "power3.out"
            });
            const ringY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].quickTo(ring, "y", {
                duration: 0.5,
                ease: "power3.out"
            });
            const dotX = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].quickTo(dot, "x", {
                duration: 0.12,
                ease: "power2.out"
            });
            const dotY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].quickTo(dot, "y", {
                duration: 0.12,
                ease: "power2.out"
            });
            let visible = false;
            const onMove = {
                "CustomCursor.useEffect.onMove": (event)=>{
                    ringX(event.clientX);
                    ringY(event.clientY);
                    dotX(event.clientX);
                    dotY(event.clientY);
                    if (!visible) {
                        visible = true;
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to([
                            ring,
                            dot
                        ], {
                            opacity: 1,
                            duration: 0.35
                        });
                    }
                    const target = event.target;
                    const holder = target?.closest("[data-cursor]");
                    const interactive = target?.closest("a, button, [data-magnetic], input, textarea, select");
                    if (holder) {
                        const next = {
                            variant: holder.dataset.cursor === "grow" ? "grow" : "label",
                            label: holder.dataset.cursorLabel ?? ""
                        };
                        setState({
                            "CustomCursor.useEffect.onMove": (prev)=>prev.variant === next.variant && prev.label === next.label ? prev : next
                        }["CustomCursor.useEffect.onMove"]);
                        return;
                    }
                    const next = interactive ? {
                        variant: "grow",
                        label: ""
                    } : DEFAULT_STATE;
                    setState({
                        "CustomCursor.useEffect.onMove": (prev)=>prev.variant === next.variant && prev.label === next.label ? prev : next
                    }["CustomCursor.useEffect.onMove"]);
                }
            }["CustomCursor.useEffect.onMove"];
            const onDown = {
                "CustomCursor.useEffect.onDown": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(ring, {
                        scale: 0.78,
                        duration: 0.2
                    })
            }["CustomCursor.useEffect.onDown"];
            const onUp = {
                "CustomCursor.useEffect.onUp": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(ring, {
                        scale: 1,
                        duration: 0.3
                    })
            }["CustomCursor.useEffect.onUp"];
            const onLeave = {
                "CustomCursor.useEffect.onLeave": ()=>{
                    visible = false;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to([
                        ring,
                        dot
                    ], {
                        opacity: 0,
                        duration: 0.25
                    });
                }
            }["CustomCursor.useEffect.onLeave"];
            window.addEventListener("mousemove", onMove, {
                passive: true
            });
            window.addEventListener("mousedown", onDown);
            window.addEventListener("mouseup", onUp);
            document.addEventListener("mouseleave", onLeave);
            return ({
                "CustomCursor.useEffect": ()=>{
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mousedown", onDown);
                    window.removeEventListener("mouseup", onUp);
                    document.removeEventListener("mouseleave", onLeave);
                    delete document.documentElement.dataset.cursor;
                }
            })["CustomCursor.useEffect"];
        }
    }["CustomCursor.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomCursor.useEffect": ()=>{
            const ring = ringRef.current;
            const label = labelRef.current;
            if (!ring || !label) return;
            const expanded = state.variant === "label";
            const grown = state.variant !== "dot";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(ring, {
                width: expanded ? 92 : grown ? 56 : 34,
                height: expanded ? 92 : grown ? 56 : 34,
                borderColor: expanded ? "rgba(216,255,62,0.85)" : "rgba(255,255,255,0.45)",
                backgroundColor: expanded ? "rgba(216,255,62,0.10)" : "rgba(255,255,255,0)",
                duration: 0.45,
                ease: "power3.out"
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(label, {
                opacity: expanded ? 1 : 0,
                duration: 0.3,
                ease: "power2.out"
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(dotRef.current, {
                opacity: grown && !expanded ? 0.9 : expanded ? 0 : 1,
                scale: grown && !expanded ? 1.3 : 1,
                duration: 0.3
            });
        }
    }["CustomCursor.useEffect"], [
        state
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": true,
        className: "pointer-events-none fixed inset-0 z-[90] hidden md:block",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: ringRef,
                className: "absolute top-0 left-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/45 backdrop-blur-[2px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    ref: labelRef,
                    className: "font-mono text-[9px] tracking-[0.2em] whitespace-nowrap text-accent uppercase opacity-0",
                    children: state.label
                }, void 0, false, {
                    fileName: "[project]/src/components/CustomCursor.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/CustomCursor.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: dotRef,
                className: "absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-white"
            }, void 0, false, {
                fileName: "[project]/src/components/CustomCursor.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CustomCursor.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
_s(CustomCursor, "koF61T0cU1/hrvaV6AblOSF0h7M=");
_c = CustomCursor;
var _c;
__turbopack_context__.k.register(_c, "CustomCursor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AppReady.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppReadyProvider",
    ()=>AppReadyProvider,
    "READY_EVENT",
    ()=>READY_EVENT,
    "isReady",
    ()=>isReady,
    "markReady",
    ()=>markReady,
    "useGsapContext",
    ()=>useGsapContext,
    "useOnReady",
    ()=>useOnReady,
    "useScrollRefresh",
    ()=>useScrollRefresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/animation.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gsap/ScrollTrigger.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
const READY_EVENT = "zaigham:ready";
function isReady() {
    if (typeof document === "undefined") return false;
    return document.documentElement.dataset.ready === "1";
}
function markReady() {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.ready = "1";
    window.dispatchEvent(new Event(READY_EVENT));
}
function AppReadyProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_c = AppReadyProvider;
function useOnReady(callback, delay = 0) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOnReady.useEffect": ()=>{
            let timeout;
            const fire = {
                "useOnReady.useEffect.fire": ()=>{
                    timeout = window.setTimeout(callback, delay);
                }
            }["useOnReady.useEffect.fire"];
            if (isReady()) {
                fire();
            } else {
                window.addEventListener(READY_EVENT, fire, {
                    once: true
                });
            }
            return ({
                "useOnReady.useEffect": ()=>{
                    if (timeout) window.clearTimeout(timeout);
                    window.removeEventListener(READY_EVENT, fire);
                }
            })["useOnReady.useEffect"];
        }
    }["useOnReady.useEffect"], [
        callback,
        delay
    ]);
}
_s(useOnReady, "OD7bBpZva5O2jO+Puf00hKivP7c=");
function useScrollRefresh() {
    _s1();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useScrollRefresh.useEffect": ()=>{
            const refresh = {
                "useScrollRefresh.useEffect.refresh": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollTrigger"].refresh()
            }["useScrollRefresh.useEffect.refresh"];
            const timers = [
                180,
                700,
                1600
            ].map({
                "useScrollRefresh.useEffect.timers": (ms)=>window.setTimeout(refresh, ms)
            }["useScrollRefresh.useEffect.timers"]);
            window.addEventListener("load", refresh);
            window.addEventListener(READY_EVENT, refresh);
            return ({
                "useScrollRefresh.useEffect": ()=>{
                    timers.forEach({
                        "useScrollRefresh.useEffect": (timer)=>window.clearTimeout(timer)
                    }["useScrollRefresh.useEffect"]);
                    window.removeEventListener("load", refresh);
                    window.removeEventListener(READY_EVENT, refresh);
                }
            })["useScrollRefresh.useEffect"];
        }
    }["useScrollRefresh.useEffect"], []);
}
_s1(useScrollRefresh, "OD7bBpZva5O2jO+Puf00hKivP7c=");
function useGsapContext(setup, deps = []) {
    _s2();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGsapContext.useEffect": ()=>{
            const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].context({
                "useGsapContext.useEffect.context": (self)=>setup(self)
            }["useGsapContext.useEffect.context"]);
            return ({
                "useGsapContext.useEffect": ()=>context.revert()
            })["useGsapContext.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useGsapContext.useEffect"], deps);
}
_s2(useGsapContext, "OD7bBpZva5O2jO+Puf00hKivP7c=");
var _c;
__turbopack_context__.k.register(_c, "AppReadyProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SmoothScroll.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SmoothScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lenis/dist/lenis.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/animation.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gsap/ScrollTrigger.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SmoothScroll() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SmoothScroll.useEffect": ()=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["prefersReducedMotion"])()) return;
            const lenis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                lerp: 0.09,
                wheelMultiplier: 1,
                touchMultiplier: 1.6,
                smoothWheel: true
            });
            const onScroll = {
                "SmoothScroll.useEffect.onScroll": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollTrigger"].update()
            }["SmoothScroll.useEffect.onScroll"];
            lenis.on("scroll", onScroll);
            const raf = {
                "SmoothScroll.useEffect.raf": (time)=>{
                    lenis.raf(time * 1000);
                }
            }["SmoothScroll.useEffect.raf"];
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].ticker.add(raf);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].ticker.lagSmoothing(0);
            const anchorHandler = {
                "SmoothScroll.useEffect.anchorHandler": (event)=>{
                    const target = event.target?.closest('a[href^="#"]');
                    if (!target) return;
                    const hash = target.getAttribute("href");
                    if (!hash || hash === "#") return;
                    const element = document.querySelector(hash);
                    if (!element) return;
                    event.preventDefault();
                    lenis.scrollTo(element, {
                        offset: hash === "#top" ? 0 : -20,
                        duration: 1.4
                    });
                    window.history.replaceState(null, "", hash);
                }
            }["SmoothScroll.useEffect.anchorHandler"];
            const lockHandler = {
                "SmoothScroll.useEffect.lockHandler": (event)=>{
                    const locked = event.detail;
                    if (locked) {
                        lenis.stop();
                        document.documentElement.classList.add("lenis-stopped");
                    } else {
                        lenis.start();
                        document.documentElement.classList.remove("lenis-stopped");
                    }
                }
            }["SmoothScroll.useEffect.lockHandler"];
            document.addEventListener("click", anchorHandler);
            window.addEventListener("zaigham:scroll-lock", lockHandler);
            return ({
                "SmoothScroll.useEffect": ()=>{
                    document.removeEventListener("click", anchorHandler);
                    window.removeEventListener("zaigham:scroll-lock", lockHandler);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].ticker.remove(raf);
                    lenis.destroy();
                }
            })["SmoothScroll.useEffect"];
        }
    }["SmoothScroll.useEffect"], []);
    return null;
}
_s(SmoothScroll, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = SmoothScroll;
var _c;
__turbopack_context__.k.register(_c, "SmoothScroll");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ViewTracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function ViewTracker() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewTracker.useEffect": ()=>{
            const seen = window.sessionStorage.getItem("zaigham:visit");
            if (seen) return;
            window.sessionStorage.setItem("zaigham:visit", "1");
        }
    }["ViewTracker.useEffect"], []);
    return null;
}
_s(ViewTracker, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ViewTracker;
var _c;
__turbopack_context__.k.register(_c, "ViewTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0mi~1mw._.js.map