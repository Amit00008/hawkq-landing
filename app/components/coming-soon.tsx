import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "./nav-links";
import SectionRule from "./section-rule";
import SiteFooter from "./site-footer";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  /** current route, so the nav can mark it active */
  active: string;
};

export default function ComingSoon({ eyebrow, title, body, active }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/watermark.png"
            alt="hawkq"
            width={1254}
            height={1254}
            priority
            className="h-16 w-16 object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[14px] no-underline ${
                link.href === active ? "text-foreground" : "text-ink-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a href="#" className="btn btn-secondary !px-4 !py-2.5 !text-[14px]">
          book a demo
        </a>
      </header>

      {/* body */}
      <main className="relative flex flex-1 items-center overflow-hidden">
        <div
          aria-hidden
          className="grid-backdrop pointer-events-none absolute inset-0 [mask-image:radial-gradient(80%_70%_at_50%_40%,black,transparent_80%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-orange-100 opacity-40 blur-[120px]"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 text-center">
          <div className="raised-orange mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span className="text-[13px] font-medium text-orange-700">
              {eyebrow}
            </span>
          </div>

          <h1 className="mx-auto max-w-3xl text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-[3.5rem] lg:text-[4rem]">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-balance text-[0.9375rem] leading-[1.6] text-ink-muted sm:text-base">
            {body}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <a href="#" className="btn btn-primary">
              book a demo
            </a>
            <Link
              href="/"
              className="text-[14px] text-ink-muted no-underline sm:text-[14.5px]"
            >
              &larr; back home
            </Link>
          </div>
        </div>
      </main>

      <SectionRule />
      <SiteFooter cta={false} />
    </div>
  );
}
