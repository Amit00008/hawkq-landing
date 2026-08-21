"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Integrations from "./integrations";
import WordmarkDraw from "./wordmark-draw";

/* Lens geometry measured from the dark lens paths in the 1254x1254 artwork.
   Dark lens spans x 447..687, y 452..711 (center 567,582).
   The disc is inset from that box so the lid never touches the orange iris. */
const LENS_CX = (567 / 1254) * 100;
const LENS_CY = (582 / 1254) * 100;
const LENS_D = (216 / 1254) * 100; /* inscribed, 24px inside the dark trace */

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/* Blink window in scroll space. Closing is faster than opening, like a real lid.
   Held shut briefly at full coverage so the blink reads at scroll speed. */
const BLINK_START = 0.3;
const BLINK_SHUT = 0.4;
const BLINK_HOLD = 0.45;
const BLINK_END = 0.55;

/* Specular sweep across the lens, once, right after the lid clears. */
const SHINE_START = 0.55;
const SHINE_END = 0.64;

/**
 * Lid coverage 0..1 driven purely by scroll position, so scrubbing backwards
 * rewinds the blink instead of replaying it.
 */
function lidCoverage(p: number) {
  if (p <= BLINK_START || p >= BLINK_END) return 0;
  if (p < BLINK_SHUT) {
    /* accelerate shut — muscle snap */
    return easeInOutSine(range(p, BLINK_START, BLINK_SHUT));
  }
  if (p < BLINK_HOLD) return 1; /* held closed */
  /* ease open, slower than the close */
  return 1 - easeOutCubic(range(p, BLINK_HOLD, BLINK_END));
}

export default function ScrollReveal() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* async so we don't setState synchronously inside the effect body */
      const id = window.requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(id);
    }

    const read = () => {
      rafRef.current = null;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setProgress(clamp01(total > 0 ? -rect.top / total : 0));
    };

    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(read);
      }
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const growth = easeOutCubic(range(progress, 0, 0.28));
  const scale = 0.18 + growth * 0.82;
  const logoOpacity = range(progress, 0, 0.07);

  /* after the shine, the mark recedes and hands the stage to the graph */
  const settle = easeOutCubic(range(progress, 0.62, 0.76));
  const logoScale = scale * (1 - settle * 0.42);
  const logoFade = 1 - settle;

  /* integrations rise into the same pinned stage */
  const connect = easeOutCubic(range(progress, 0.7, 0.92));

  /* letters draw between the eye landing and the blink starting */
  const letters = range(progress, 0.13, 0.3);

  /* --- blink state, all derived from scroll --- */
  const lid = lidCoverage(progress);
  /* eye squeezes very slightly as the lid closes — real eyes compress */
  const squeeze = 1 - lid * 0.035;
  /* pupil dims under the closing lid */
  const lensShade = lid * 0.5;

  /* --- specular shine, once, after the eye reopens --- */
  const shine = range(progress, SHINE_START, SHINE_END);
  /* travels left→right across the lens */
  const shineX = -120 + shine * 240;
  /* brightest mid-sweep, gone by the ends */
  const shineOpacity = Math.sin(shine * Math.PI);

  return (
    <section ref={sectionRef} className="relative h-[520vh] bg-background">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="grid-backdrop pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent_80%)]"
          style={{ opacity: 0.5 + growth * 0.5 }}
        />

        <div
          className="absolute"
          style={{
            transform: `scale(${logoScale}) scaleY(${squeeze})`,
            opacity: logoOpacity * logoFade,
            willChange: "transform, opacity",
          }}
        >
          <div className="relative h-[min(46vh,420px)] w-[min(46vh,420px)]">
            {/* eye only — the wordmark band is clipped off and drawn below */}
            <Image
              src="/hawkq.svg"
              alt="hawkq"
              fill
              priority
              className="object-contain"
              style={{ clipPath: "inset(0 0 20.4% 0)" }}
            />

            {/* letters trace themselves in, just before the blink */}
            <WordmarkDraw
              progress={letters}
              className="absolute bottom-[1.5%] left-[2%] w-[96%]"
            />

            {/* ---- eyelid assembly, clipped to the lens disc ---- */}
            <div
              aria-hidden
              className="pointer-events-none absolute overflow-hidden"
              style={{
                left: `${LENS_CX}%`,
                top: `${LENS_CY}%`,
                width: `${LENS_D}%`,
                height: `${LENS_D}%`,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                /* inset 1% so no anti-aliased edge lands on the orange iris */
                clipPath: "circle(49% at 50% 50%)",
              }}
            >
              {/* shadow the lid casts on the lens just before contact */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% -10%, rgba(0,0,0,0.55), transparent 70%)",
                  opacity: lensShade,
                }}
              />

              {/* the lid itself — skin tone, curved lower edge, soft lash line */}
              <div
                className="absolute left-0 w-full"
                style={{
                  /* travels from fully above to fully across the lens */
                  top: `${-100 + lid * 100}%`,
                  height: "100%",
                  background:
                    "linear-gradient(180deg, #d9d9d6 0%, #ebeae7 46%, #f6f5f2 78%, #ffffff 100%)",
                  /* lower edge bulges — a lid is not a straight line */
                  borderBottomLeftRadius: "50% 26%",
                  borderBottomRightRadius: "50% 26%",
                  boxShadow:
                    "0 3px 5px -1px rgba(0,0,0,0.32), inset 0 -6px 10px -6px rgba(0,0,0,0.28)",
                  willChange: "top",
                }}
              >
                {/* crease running across the lid for texture */}
                <div
                  className="absolute inset-x-0"
                  style={{
                    bottom: "22%",
                    height: "12%",
                    background:
                      "linear-gradient(180deg, transparent, rgba(120,110,105,0.16), transparent)",
                    filter: "blur(1.2px)",
                  }}
                />
                {/* lash edge — darker rim right at the closing margin */}
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: "5.5%",
                    background:
                      "linear-gradient(180deg, rgba(60,52,48,0.15), rgba(38,32,29,0.62))",
                    borderBottomLeftRadius: "50% 60%",
                    borderBottomRightRadius: "50% 60%",
                  }}
                />
              </div>

              {/* ---- specular sweep, fires once after the lid clears ---- */}
              {shineOpacity > 0.001 && (
                <>
                  {/* the travelling glare band */}
                  <div
                    className="absolute inset-y-[-30%] w-[46%]"
                    style={{
                      left: `${shineX}%`,
                      background:
                        "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.16) 30%, rgba(255,255,255,0.82) 50%, rgba(255,255,255,0.16) 70%, transparent 100%)",
                      opacity: shineOpacity,
                      transform: "rotate(14deg)",
                      filter: "blur(3px)",
                      willChange: "left, opacity",
                    }}
                  />
                  {/* tight hotspot that lags slightly behind the band */}
                  <div
                    className="absolute h-[16%] w-[16%] rounded-full"
                    style={{
                      left: `${28 + shine * 30}%`,
                      top: "26%",
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 68%)",
                      opacity: shineOpacity * 0.85,
                      filter: "blur(1px)",
                      willChange: "left, opacity",
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* integrations graph — rises into the same pinned stage */}
        {connect > 0.001 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Integrations reveal={connect} />
          </div>
        )}
      </div>
    </section>
  );
}
