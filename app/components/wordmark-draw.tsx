"use client";

import { useEffect, useRef, useState } from "react";

/* Generated from hawkq.svg — the 5 wordmark letters, HAWKQ, left to right. */
const VIEWBOX = "0 0 1260 162";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

type Props = {
  /** 0..1 draw progress, driven by the parent's scroll */
  progress: number;
  className?: string;
};

export default function WordmarkDraw({ progress, className }: Props) {
  const [paths, setPaths] = useState<string[]>([]);
  const [lengths, setLengths] = useState<number[]>([]);
  const refs = useRef<(SVGPathElement | null)[]>([]);

  /* pull the path data once */
  useEffect(() => {
    let alive = true;
    fetch("/wordmark-paths.svg")
      .then((r) => r.text())
      .then((text) => {
        if (!alive) return;
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const found = Array.from(doc.querySelectorAll("path"));
        setPaths(
          found.map((p) => {
            const d = p.getAttribute("d") ?? "";
            const t = p.getAttribute("transform") ?? "";
            return JSON.stringify({ d, t });
          }),
        );
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  /* measure each outline so dash math is exact — held in state, not read
     during render (refs are not safe to read while rendering) */
  useEffect(() => {
    if (!paths.length) return;
    const id = window.requestAnimationFrame(() => {
      setLengths(
        refs.current.map((p) => {
          try {
            return p ? p.getTotalLength() : 0;
          } catch {
            return 0;
          }
        }),
      );
    });
    return () => cancelAnimationFrame(id);
  }, [paths]);

  return (
    <svg
      viewBox={VIEWBOX}
      fill="none"
      className={className}
      aria-hidden
      style={{ overflow: "visible" }}
    >
      {paths.map((raw, i) => {
        const { d, t } = JSON.parse(raw) as { d: string; t: string };

        /* letters draw in sequence, each overlapping the next slightly */
        const start = i * 0.13;
        const drawn = easeInOutSine(range(progress, start, start + 0.42));
        /* fill blooms in behind the stroke once the outline is mostly there */
        const filled = range(progress, start + 0.24, start + 0.58);

        const len = lengths[i] || 1200;

        return (
          <g key={i} transform={t}>
            {/* solid letter, fades in behind the traced outline */}
            <path d={d} fill="#0c0c0c" opacity={filled} />
            {/* the pen stroke */}
            <path
              ref={(el) => {
                refs.current[i] = el;
              }}
              d={d}
              stroke="#f26a12"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: len,
                strokeDashoffset: len * (1 - drawn),
                /* stroke retires as the fill takes over */
                opacity: 1 - filled * 0.9,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
