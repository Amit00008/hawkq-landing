"use client";

import { useEffect, useRef, useState } from "react";

export default function KnowMoreButton() {
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const reveal = () => {
    if (timer.current) clearTimeout(timer.current);
    setShown(true);
    /* visible dwell; the 520ms fade-out plays after this */
    timer.current = setTimeout(() => setShown(false), 2200);
  };

  return (
    <span className="relative inline-flex w-full flex-col items-center sm:w-auto">
      <button
        type="button"
        onClick={reveal}
        className="btn btn-secondary w-full sm:w-auto"
      >
        know more
      </button>

      {/* tooltip below the button — quick fade in, slower fade out */}
      <span
        aria-live="polite"
        className="pointer-events-none absolute top-full mt-2.5 whitespace-nowrap"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown
            ? "translateY(0) scale(1)"
            : "translateY(-6px) scale(0.96)",
          transition: shown
            ? "opacity 180ms cubic-bezier(0.16,0.84,0.34,1), transform 260ms cubic-bezier(0.16,0.84,0.34,1)"
            : "opacity 520ms cubic-bezier(0.4,0,0.6,1), transform 520ms cubic-bezier(0.4,0,0.6,1)",
        }}
      >
        <span className="raised-orange inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
          <span className="text-[12px] font-medium text-orange-700">
            page coming soon
          </span>
        </span>
      </span>
    </span>
  );
}
