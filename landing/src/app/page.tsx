import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AnalyticsShowcase } from "@/components/landing/analytics-showcase";
import { UseCases } from "@/components/landing/use-cases";
import { ValueProp } from "@/components/landing/value-prop";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PulseBoard",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Build beautiful polls in seconds, share them with anyone, and watch responses stream in live — with analytics that tell you what your audience actually thinks.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "500",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <AnalyticsShowcase />
        <UseCases />
        <ValueProp />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
