import CostOfBlindness from "./components/cost-of-blindness";
import Hero from "./components/hero";
import ScrollReveal from "./components/scroll-reveal";
import SectionRule from "./components/section-rule";
import SiteFooter from "./components/site-footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <SectionRule />
      <ScrollReveal />
      <SectionRule />
      <CostOfBlindness />
      <SiteFooter />
    </div>
  );
}
