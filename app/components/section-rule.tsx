/* Hairline separator between sections. Inset to the content width and
   faded at both ends so it reads as a seam, not a hard cut. */
export default function SectionRule() {
  return (
    <div aria-hidden className="relative bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      </div>
    </div>
  );
}
