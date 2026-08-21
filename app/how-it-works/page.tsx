import type { Metadata } from "next";
import ComingSoon from "../components/coming-soon";

export const metadata: Metadata = {
  title: "how it works — hawkq",
  description:
    "How hawkq turns your existing camera feeds into signals your team can act on. Coming soon.",
};

export default function HowItWorks() {
  return (
    <ComingSoon
      active="/how-it-works"
      eyebrow="coming soon"
      title="how it works"
      body="we're writing this one down properly — the models, the latency, what runs on your cameras and what doesn't. until then, the fastest way to understand hawkq is to watch it read one of your own feeds."
    />
  );
}
