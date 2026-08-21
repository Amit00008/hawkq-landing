"use client";

import Image from "next/image";
import { BRANDS } from "./brands";

/* Graph geometry, in the SVG's own coordinate space. */
const VB = 520; /* square viewBox */
const C = VB / 2; /* center */
const R_INNER = 132;
const R_OUTER = 212;

/* 5 on the inner ring, 7 on the outer — staggered so nothing lines up. */
const INNER = BRANDS.slice(0, 5);
const OUTER = BRANDS.slice(5);

type Node = {
  id: string;
  label: string;
  hex: string;
  path: string;
  x: number;
  y: number;
  r: number;
};

function ring(items: typeof BRANDS, radius: number, offset: number): Node[] {
  return items.map((b, i) => {
    const a = (i / items.length) * Math.PI * 2 + offset;
    return {
      ...b,
      x: C + Math.cos(a) * radius,
      y: C + Math.sin(a) * radius,
      r: radius === R_INNER ? 27 : 24,
    };
  });
}

const NODES: Node[] = [
  ...ring(INNER, R_INNER, -Math.PI / 2),
  ...ring(OUTER, R_OUTER, -Math.PI / 2 + Math.PI / 7),
];

const STATS = [
  { k: "40+", v: "native connectors" },
  { k: "<1s", v: "event to action" },
  { k: "0", v: "new hardware" },
];

/* `reveal` is 0..1, driven by the parent's scroll progress. */
export default function Integrations({ reveal = 1 }: { reveal?: number }) {
  return (
    <div
      className="w-full"
      style={{
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 34}px)`,
        pointerEvents: reveal > 0.9 ? "auto" : "none",
      }}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-[0.72fr_1fr] lg:gap-10">
        {/* ---- left: title + info ---- */}
        <div className="text-left">
          <span className="raised-orange inline-flex items-center gap-2 rounded-full px-3.5 py-1.5">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span className="text-[13px] font-medium text-orange-700">
              connected work
            </span>
          </span>

          <h2 className="mt-5 text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.032em] text-foreground sm:text-[2.25rem]">
            it acts inside the tools
            <br />
            you already run.
          </h2>

          <p className="mt-4 max-w-sm text-pretty text-[0.9375rem] leading-[1.6] text-ink-muted">
            no new dashboard. the work lands where your team already&nbsp;works.
          </p>

          <div className="raised mt-6 rounded-[14px] p-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.09em] text-ink-faint">
              one event, many destinations
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
              {STATS.map((s) => (
                <div key={s.k}>
                  <p className="text-[1.375rem] font-semibold tracking-[-0.03em] text-orange-500">
                    {s.k}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-tight text-ink-muted">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- right: the graph ---- */}
        <div className="relative mx-auto w-full max-w-[min(58vh,500px)]">
          <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full">
            {/* orbit rings */}
            <circle
              cx={C}
              cy={C}
              r={R_INNER}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
            />
            <circle
              cx={C}
              cy={C}
              r={R_OUTER}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />

            {/* spokes from hub to each node */}
            {NODES.map((n) => (
              <line
                key={`l-${n.id}`}
                x1={C}
                y1={C}
                x2={n.x}
                y2={n.y}
                stroke="var(--line)"
                strokeWidth="1"
              />
            ))}

            {/* charge travelling hub → node along every spoke — a short
                bright spark, thin and subtle. */}
            {NODES.map((n, i) => {
              const len = Math.hypot(n.x - C, n.y - C);
              const dash = `${len * 0.09} ${len * 1.05}`;
              const travel = `${len * 1.14}`;
              const delay = `${(i * 0.29) % 2.6}s`;
              return (
                <g key={`p-${n.id}`}>
                  {/* faint halo — just enough to lift the spark off the line */}
                  <line
                    x1={C}
                    y1={C}
                    x2={n.x}
                    y2={n.y}
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.18"
                    className="spoke-pulse-glow"
                    style={{
                      strokeDasharray: dash,
                      animationDelay: delay,
                      ["--spoke-len" as string]: travel,
                    }}
                  />
                  {/* the spark — graphite, hairline, no hue */}
                  <line
                    x1={C}
                    y1={C}
                    x2={n.x}
                    y2={n.y}
                    stroke="#475569"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.9"
                    className="spoke-pulse"
                    style={{
                      strokeDasharray: dash,
                      animationDelay: delay,
                      ["--spoke-len" as string]: travel,
                    }}
                  />
                </g>
              );
            })}

            {/* nodes */}
            {NODES.map((n) => (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="#ffffff"
                  stroke="var(--line)"
                  strokeWidth="1"
                />
                <g
                  transform={`translate(${n.x - n.r * 0.46}, ${
                    n.y - n.r * 0.46
                  }) scale(${(n.r * 0.92) / 24})`}
                >
                  <path d={n.path} fill={n.hex} />
                </g>
              </g>
            ))}

            {/* hub plate */}
            <circle
              cx={C}
              cy={C}
              r="62"
              fill="#ffffff"
              stroke="var(--line-strong)"
              strokeWidth="1"
            />
          </svg>

          {/* hawkq mark, centered over the hub */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/hawkq.svg"
              alt="hawkq"
              fill
              className="object-contain"
              style={{ clipPath: "inset(0 0 20.4% 0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
