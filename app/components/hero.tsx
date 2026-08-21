import Image from "next/image";
import Link from "next/link";
import AutomationPanel from "./automation-panel";
import KnowMoreButton from "./know-more-button";
import { NAV_LINKS } from "./nav-links";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* backdrop */}
      <div
        aria-hidden
        className="grid-backdrop wash pointer-events-none absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)]"
      />
      <div
        aria-hidden
        className="wash pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-orange-100 opacity-40 blur-[120px]"
      />

      {/* nav */}
      <header
        className="rise relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6"
        style={{ ["--d" as string]: "60ms" }}
      >
        <a href="#" className="flex items-center">
          <Image
            src="/watermark.png"
            alt="HAWKQ"
            width={1254}
            height={1254}
            priority
            className="h-16 w-16 object-contain"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-ink-muted no-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a href="#" className="btn btn-secondary !px-4 !py-2.5 !text-[14px]">
          book a demo
        </a>
      </header>

      {/* hero body */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pt-6 pb-20 text-center sm:pt-10">
        <div
          className="raised-orange rise mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
          style={{ ["--d" as string]: "220ms" }}
        >
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
          <span className="text-[13px] font-medium tracking-[-0.005em] text-orange-700">
            now watching 1,400+ live feeds
          </span>
        </div>

        <h1
          className="rise text-[3.75rem] font-semibold leading-[1.02] tracking-[-0.042em] text-foreground sm:text-[5rem] lg:text-[6rem]"
          style={{ ["--d" as string]: "320ms" }}
        >
          Hawkq
        </h1>

        <p
          className="rise mt-6 max-w-lg text-balance text-[0.9375rem] leading-[1.6] text-ink-muted sm:text-base"
          style={{ ["--d" as string]: "440ms" }}
        >
          your cameras watch. we tell you what happened. hawkq reads your feeds
          in real time and pings you the moment it&nbsp;matters.
        </p>

        <div
          className="rise mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          style={{ ["--d" as string]: "560ms" }}
        >
          <a href="#" className="btn btn-primary">
            book a demo
          </a>
          <KnowMoreButton />
        </div>

        {/* feed panel */}
        <div
          className="raised rise-panel mt-12 w-full max-w-5xl rounded-[16px] p-1.5 sm:mt-20 sm:rounded-[18px] sm:p-2.5"
          style={{ ["--d" as string]: "680ms" }}
        >
          <div className="overflow-hidden rounded-[11px] border border-line bg-surface-sunken sm:rounded-[12px]">
            {/* panel bar */}
            <div className="flex items-center justify-between gap-2 border-b border-line bg-surface px-3 py-2 sm:px-4 sm:py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                <span className="truncate font-mono text-[10.5px] tracking-[0.02em] text-ink-muted sm:text-[11.5px]">
                  site-07 · north warehouse
                </span>
              </div>
              <span className="shrink-0 font-mono text-[10.5px] text-ink-faint sm:text-[11.5px]">
                14 cameras · 1 agent
              </span>
            </div>

            <div className="grid items-stretch gap-px bg-line text-left lg:grid-cols-[1.05fr_1fr]">
              {/* automation — left on desktop, second on mobile */}
              <div className="order-2 bg-background p-2.5 text-left sm:p-4 lg:order-1">
                <AutomationPanel />
              </div>

              {/* live feed — right on desktop, first on mobile */}
              <div className="relative order-1 aspect-[16/10] bg-[#111] sm:aspect-[16/9] lg:order-2 lg:aspect-auto lg:min-h-[320px]">
                <video
                  src="/assembly-line.mp4"
                  poster="/assembly-line-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* feed chrome */}
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-[5px] bg-black/55 px-2 py-1 font-mono text-[10px] tracking-[0.03em] text-white/90 backdrop-blur-sm sm:left-4 sm:top-4 sm:px-2.5 sm:py-1.5 sm:text-[10.5px]">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                  LIVE
                </span>
                <span className="absolute bottom-2.5 left-2.5 rounded-[5px] bg-black/55 px-2 py-1 font-mono text-[10px] tracking-[0.03em] text-white/90 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:px-2.5 sm:py-1.5 sm:text-[10.5px]">
                  CAM-05 · Assembly Line
                </span>
                {/* detection box on the line */}
                <div className="absolute left-[14%] top-[34%] h-[40%] w-[32%] rounded-[3px] border-2 border-orange-500">
                  <span className="absolute -top-[19px] left-0 whitespace-nowrap rounded-[4px] bg-orange-500 px-1.5 py-0.5 font-mono text-[9px] font-medium text-white sm:-top-[21px] sm:text-[10px]">
                    bottleneck 0.89
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
