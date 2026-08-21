import type { Metadata } from "next";
import ComingSoon from "../components/coming-soon";

export const metadata: Metadata = {
  title: "docs — hawkq",
  description:
    "hawkq developer docs: API, webhooks and connectors. Coming soon.",
};

export default function Docs() {
  return (
    <ComingSoon
      active="/docs"
      eyebrow="coming soon"
      title="docs"
      body="the API, the webhooks, the connector reference. being written now. if you need to integrate before it ships, talk to an engineer and we'll walk you through it directly."
    />
  );
}
