import type { Metadata } from "next";
import ComingSoon from "../components/coming-soon";

export const metadata: Metadata = {
  title: "pricing — hawkq",
  description:
    "hawkq pricing, per camera and per site. Coming soon — talk to us for a quote today.",
};

export default function Pricing() {
  return (
    <ComingSoon
      active="/pricing"
      eyebrow="coming soon"
      title="pricing"
      body="it scales per camera, and it costs less than the incident it catches. we're still shaping the tiers — book a call and we'll quote your site directly, no waiting for this page."
    />
  );
}
