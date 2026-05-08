import { HeroSection } from "@/components/landing/hero";
import { FeatureSection } from "@/components/landing/feature-section";
import { ProgramsSection } from "@/components/landing/programs-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CallToAction } from "@/components/landing/cta";

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
