/* Time-to-detection ledger. The buyer already owns the cameras — the gap
   is when they find out. Kept deliberately short: the numbers argue. */

const INCIDENTS = [
  { cam: "CAM-02", event: "spill in aisle 4", without: "3h 40m", with: "1.2s" },
  { cam: "CAM-11", event: "loading bay idle", without: "next day", with: "12m" },
  { cam: "CAM-05", event: "forklift in walkway", without: "never", with: "0.9s" },
  { cam: "CAM-08", event: "bay door left open", without: "6h +", with: "4s" },
];

export default function CostOfBlindness() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-28">
      <div
        aria-hidden
        className="grid-backdrop pointer-events-none absolute inset-0 [mask-image:radial-gradient(85%_70%_at_40%_50%,black,transparent_78%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
        {/* ---- left: the argument ---- */}
        <div className="text-left">
          <span className="raised-orange inline-flex items-center gap-2 rounded-full px-3.5 py-1.5">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span className="text-[13px] font-medium text-orange-700">
              the real cost
            </span>
          </span>

          <h2 className="mt-5 text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.032em] text-foreground sm:text-[2.25rem]">
            you already have
            <br />
            the footage.
          </h2>

          <p className="mt-4 max-w-xs text-pretty text-[0.9375rem] leading-[1.6] text-ink-muted">
            nobody watches fourteen feeds at 2am. the only thing hawkq changes
            is when you find&nbsp;out.
          </p>
        </div>

        {/* ---- right: ledger ---- */}
        <div className="raised overflow-hidden rounded-[16px]">
          <div className="grid grid-cols-[1fr_5.5rem_5.5rem] items-center border-b border-line bg-surface px-5 py-3">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.09em] text-ink-faint">
              event
            </span>
            <span className="text-right font-mono text-[10.5px] uppercase tracking-[0.09em] text-ink-faint">
              today
            </span>
            <span className="text-right font-mono text-[10.5px] uppercase tracking-[0.09em] text-orange-600">
              hawkq
            </span>
          </div>

          {INCIDENTS.map((it, i) => (
            <div
              key={it.cam}
              className={`grid grid-cols-[1fr_5.5rem_5.5rem] items-center px-5 py-4 ${
                i < INCIDENTS.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" />
                <span className="truncate text-[14.5px] font-medium tracking-[-0.01em] text-foreground">
                  {it.event}
                </span>
              </div>

              <span className="text-right font-mono text-[13.5px] text-ink-faint line-through decoration-line-strong">
                {it.without}
              </span>

              <span className="text-right font-mono text-[15px] font-medium text-orange-600">
                {it.with}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
