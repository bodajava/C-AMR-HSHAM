import { HeroSection } from "@/components/hero";
import { FeatureSection } from "@/components/feature-section";
import { ProgramsSection } from "@/components/programs-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PricingSection } from "@/components/pricing-section";
import { CallToAction } from "@/components/cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <ProgramsSection />
      <TestimonialsSection />
      <PricingSection />
      <CallToAction />
    </>
  );
}
