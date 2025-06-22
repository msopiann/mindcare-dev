import { FAQSection } from "@/components/sections/faq-section";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { JourneySupportSection } from "@/components/sections/journey-support-section";
import { MentalHealthPrioritySection } from "@/components/sections/mental-health-priority-section";
import { ResourcesSection } from "@/components/sections/resources-section";
import { SiteHeader } from "@/components/site-header";
import TailwindIndicator from "@/components/tailwind-indicator";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { WellbeingPathSection } from "@/components/sections/wellbeing-path-section";

const baseUrl = process.env.APP_URL!;

export const metadata = {
  title: "Mindcare | Ruang Nyaman Buat Jaga Kesehatan Mental Kamu",
  description:
    "Lagi burnout? Overthinking? Atau cuma pengen cerita? Mindcare hadir buat bantu kamu tetap waras lewat konseling online & tips self-care yang relatable.",
  keywords:
    "kesehatan mental gen z, konseling online, healing, overthinking, burnout, self-care, mindfulness, psikolog muda, dukungan emosional, Mindcare Indonesia",
  alternates: {
    canonical: `${baseUrl}`,
  },
  openGraph: {
    title: "Mindcare | Mental Health Support Platform",
    description:
      "Professional mental health support with AI chat, therapy sessions, and wellness resources.",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mindcare",
  description:
    "Mental health support platform offering AI chat, therapy sessions, and wellness resources",
  url: `${baseUrl}`,
  logo: `${baseUrl}/logo.jpg`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Indonesian", "English"],
  },
  sameAs: [
    "https://instagram.com/mindcare",
    "https://facebook.com/mindcare",
    "https://youtube.com/mindcare",
    "https://linkedin.com/company/mindcare",
  ],
};

export default function HomePage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="bg-background min-h-screen">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <SiteHeader />
        <main className="container mx-auto px-4" role="main">
          <HeroSection />
          <MentalHealthPrioritySection />
          <WellbeingPathSection />
          <TestimonialsSection />
          <ResourcesSection />
          <JourneySupportSection />
          <FAQSection />
        </main>
        <SiteFooter />

        {/* Fixed Theme Toggle Button */}
        <div className="fixed right-5 bottom-5">
          <ThemeToggle />
        </div>
        <TailwindIndicator />
      </div>
    </ThemeProvider>
  );
}
