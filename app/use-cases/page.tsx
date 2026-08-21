import type { Metadata } from "next";
import ComingSoon from "../components/coming-soon";

export const metadata: Metadata = {
  title: "use cases — hawkq",
  description:
    "Where hawkq is already watching: warehouses, factory floors, forecourts and loading bays. Coming soon.",
};

export default function UseCases() {
  return (
    <ComingSoon
      active="/use-cases"
      eyebrow="coming soon"
      title="use cases"
      body="warehouses, factory floors, loading bays, forecourts. we're collecting the numbers from sites already running hawkq before we put them on a page. tell us your floor and we'll tell you what we'd watch for."
    />
  );
}
