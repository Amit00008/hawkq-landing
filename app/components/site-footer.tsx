import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "./nav-links";

type Props = {
  /** hide the big CTA panel and show only the footer bar */
  cta?: boolean;
};

export default function SiteFooter({ cta = true }: Props) {
  return (
    <footer className="relative bg-background px-4 pb-6 pt-8 sm:px-6 sm:pb-8">
      <div className="raised mx-auto w-full max-w-6xl overflow-hidden rounded-[24px]">
        {/* ---- CTA panel ---- */}
        {cta && (
          <div className="relative overflow-hidden border-b border-line bg-background">
            <div
              aria-hidden
              className="grid-backdrop pointer-events-none absolute inset-0 [mask-image:radial-gradient(90%_75%_at_50%_45%,black,transparent_78%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-orange-100 opacity-40 blur-[120px]"
            />

            <div className="relative px-6 py-20 text-center sm:py-24">
              <h2 className="mx-auto max-w-3xl text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.042em] text-foreground sm:text-[3.5rem] lg:text-[4.25rem]">
                put your cameras to work
              </h2>

              <p className="mx-auto mt-5 max-w-md text-balance text-[0.9375rem] leading-[1.6] text-ink-muted sm:text-base">
                send us one feed. we&apos;ll show you what it&apos;s been
                missing — live, in about twenty&nbsp;minutes.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                <a href="#" className="btn btn-primary">
                  book a demo
                </a>
                <a
                  href="#"
                  className="text-[14px] text-ink-muted no-underline sm:text-[14.5px]"
                >
                  or talk to an engineer &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ---- footer bar ---- */}
        <div className="flex flex-col items-center gap-7 bg-background px-6 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="flex max-w-sm flex-col items-center gap-3 sm:items-start">
            <Link href="/" className="flex items-center">
              <Image
                src="/watermark.png"
                alt="hawkq"
                width={1254}
                height={1254}
                className="h-11 w-11 object-contain"
              />
            </Link>
            <p className="text-balance text-center text-[12.5px] leading-[1.55] text-ink-muted sm:text-left">
              your cameras watch. we tell you what happened. hawkq reads your
              feeds in real time and pings you the moment it&nbsp;matters.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13.5px] text-ink-muted no-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <span className="font-mono text-[11.5px] text-ink-faint">
            &copy; {new Date().getFullYear()} hawkq
          </span>
        </div>
      </div>
    </footer>
  );
}
