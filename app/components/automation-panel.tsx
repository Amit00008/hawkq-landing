"use client";

import { useEffect, useRef, useState } from "react";

/* The rule, split into typed text and inline chips.
   `kind` drives how each token renders once the line resolves. */
type Token =
  | { kind: "kw"; text: string }
  | { kind: "text"; text: string }
  | { kind: "cam"; text: string }
  | { kind: "app"; text: string };

const RULE: Token[] = [
  { kind: "kw", text: "IF" },
  { kind: "text", text: "a bottleneck forms on" },
  { kind: "cam", text: "CAM-05 · Assembly Line" },
  { kind: "kw", text: "THEN" },
  {
    kind: "text",
    text: "send me a WhatsApp report with the downtime and cycle time",
  },
  { kind: "app", text: "WhatsApp" },
];

/* plain string the typewriter reveals, character by character */
const TYPED = RULE.map((t) => t.text).join(" ");

const TYPE_MS = 26; /* per character */
const HOLD_AFTER_TYPE = 520; /* pause after typing, before structuring */
const BEFORE_CLICK = 900; /* structured text sits a beat, then click */
const CLICK_MS = 300; /* press + release */
const REPLAY_AFTER = 2000; /* 2s rest, then run again */

type Phase =
  | "typing"
  | "holding"
  | "structured"
  | "clicking"
  | "released"
  | "sent";

function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.2 3.06.15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.33.19 1.83.12.56-.08 1.75-.71 2-1.4.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38c1.45.79 3.08 1.2 4.79 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.23.85.86-3.15-.2-.33a8.19 8.19 0 01-1.26-4.22c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 012.41 5.82c0 4.54-3.69 8.22-8.23 8.22z" />
    </svg>
  );
}

export default function AutomationPanel() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [count, setCount] = useState(0);
  /* bumped on every replay so token animations restart cleanly */
  const [run, setRun] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const push = (t: ReturnType<typeof setTimeout>) => {
    timers.current.push(t);
  };

  /* typewriter */
  useEffect(() => {
    if (phase !== "typing") return;
    if (count >= TYPED.length) {
      push(setTimeout(() => setPhase("holding"), HOLD_AFTER_TYPE));
      return;
    }
    const ch = TYPED[count];
    const jitter = 0.7 + Math.random() * 0.7;
    const pause = ch === "," ? 5 : ch === " " ? 1.6 : 1;
    push(
      setTimeout(() => setCount((c) => c + 1), TYPE_MS * jitter * pause),
    );
  }, [phase, count]);

  /* holding → structure the text → beat → click the button → sent → rest → replay */
  useEffect(() => {
    if (phase !== "holding") return;
    const tStructured = 300; /* text resolves into chips first */
    const tClick = tStructured + BEFORE_CLICK; /* then the button presses */
    const tSent = tClick + CLICK_MS + 200;
    const tReset = tSent + REPLAY_AFTER;

    push(setTimeout(() => setPhase("structured"), tStructured));
    push(setTimeout(() => setPhase("clicking"), tClick));
    /* release the press partway through, so it springs back */
    push(setTimeout(() => setPhase("released"), tClick + CLICK_MS / 2));
    push(setTimeout(() => setPhase("sent"), tSent));
    /* loop */
    push(
      setTimeout(() => {
        setCount(0);
        setRun((r) => r + 1);
        setPhase("typing");
      }, tReset),
    );
  }, [phase]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    [],
  );

  /* chips are shown from the moment the text structures onward */
  const isResolved =
    phase === "structured" ||
    phase === "clicking" ||
    phase === "released" ||
    phase === "sent";
  /* button reads as deployed once the press has landed */
  const deployed = phase === "released" || phase === "sent";
  const pressed = phase === "clicking";

  return (
    <div className="raised flex h-full flex-col rounded-[12px] p-3.5 sm:rounded-[14px] sm:p-5">
      {/* panel header */}
      <div className="mb-3.5 flex items-center justify-between sm:mb-5">
        <span className="font-mono text-[11.5px] text-ink-muted">
          automation.txt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          <span className="font-mono text-[11.5px] text-ink-muted">
            agent live
          </span>
        </span>
      </div>

      {/* rule stage — fixed height so nothing reflows between phases.
          both layers are absolutely positioned and cross-fade. */}
      <div className="relative min-h-[168px] flex-1 text-left sm:min-h-[210px]">
        {/* typing layer */}
        <p
          className="absolute inset-0 text-left text-[1.0625rem] font-medium leading-[1.36] tracking-[-0.022em] text-foreground sm:text-[1.4rem] sm:leading-[1.34]"
          style={{
            opacity: isResolved ? 0 : 1,
            pointerEvents: "none",
          }}
        >
          {TYPED.slice(0, count)}
          <span
            className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.14em] bg-orange-500 align-middle"
            style={{
              animation:
                count >= TYPED.length
                  ? "hawkq-caret 1s steps(1) infinite"
                  : "none",
            }}
          />
        </p>

        {/* resolved layer */}
        <p
          className="absolute inset-0 flex flex-wrap content-start items-center justify-start gap-x-2 gap-y-2 text-left text-[1.0625rem] font-medium leading-[1.36] tracking-[-0.022em] text-foreground sm:gap-x-2.5 sm:gap-y-3 sm:text-[1.4rem] sm:leading-[1.34]"
          style={{
            opacity: isResolved ? 1 : 0,
            pointerEvents: "none",
          }}
        >
          {RULE.map((tok, i) => {
            const key = `${run}-${i}`;

            if (tok.kind === "kw") {
              return (
                <span
                  key={key}
                  className="rounded-[6px] bg-surface-sunken px-2.5 py-1 font-mono text-[0.6em] font-semibold tracking-[0.04em] text-ink-muted"
                >
                  {tok.text}
                </span>
              );
            }
            if (tok.kind === "cam") {
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-background px-3 py-1.5 font-mono text-[0.54em] tracking-[0.01em] text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                  {tok.text}
                </span>
              );
            }
            if (tok.kind === "app") {
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-background px-3 py-1.5 text-[0.58em] font-medium text-foreground"
                >
                  <WhatsAppMark className="h-[1.15em] w-[1.15em] text-[#25d366]" />
                  {tok.text}
                </span>
              );
            }
            return <span key={key}>{tok.text}</span>;
          })}
        </p>
      </div>

      {/* deploy button — presses itself once typing completes */}
      <div className="mt-4 flex justify-start sm:mt-5">
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          className="rounded-full border px-5 py-2.5 text-[13.5px] font-medium"
          style={{
            /* pressed: sinks into the panel. released: sits back up. */
            transform: pressed
              ? "translateY(2px) scale(0.965)"
              : "translateY(0) scale(1)",
            boxShadow: pressed
              ? "inset 0 3px 7px rgba(20,20,20,0.20), 0 0 0 0 rgba(20,20,20,0)"
              : "inset 0 1.5px 0.5px rgba(255,255,255,0.9), 0 1px 1px rgba(20,20,20,0.06), 0 3px 8px -2px rgba(20,20,20,0.12)",
            color: deployed ? "var(--orange-600)" : "var(--ink-muted)",
            borderColor: deployed ? "var(--orange-100)" : "var(--line)",
            background: deployed ? "var(--orange-50)" : "var(--surface)",
            transition:
              "transform 150ms cubic-bezier(0.3, 0.7, 0.2, 1), box-shadow 150ms cubic-bezier(0.3, 0.7, 0.2, 1)",
          }}
        >
          {deployed ? "agent deployed" : "deploy agent"}
        </button>
      </div>

      {/* result row — space is always reserved, the row slides in */}
      <div className="mt-4 min-h-[68px] border-t border-line pt-3.5 sm:mt-5 sm:min-h-[64px] sm:pt-4">
        <div
          className="flex items-start gap-3 text-left"
          style={{
            opacity: phase === "sent" ? 1 : 0,
            transform:
              phase === "sent" ? "translateY(0)" : "translateY(10px)",
            transition:
              "opacity 380ms cubic-bezier(0.22, 0.68, 0.24, 1), transform 440ms cubic-bezier(0.22, 0.68, 0.24, 1)",
          }}
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-white">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
              <path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
            <WhatsAppMark className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold leading-tight text-foreground">
              WhatsApp report sent
            </p>
            <p className="mt-1 truncate text-[12.5px] text-ink-muted">
              Bottleneck flagged, downtime and cycle tim…
            </p>
          </div>
          <span className="hidden shrink-0 whitespace-nowrap font-mono text-[11px] text-ink-faint sm:inline">
            bottleneck · 210ms
          </span>
        </div>
      </div>
    </div>
  );
}
