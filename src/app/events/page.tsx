import { Metadata } from "next";
import { EventBannerCarousel } from "@/components/events/banner-carousel";
import { EventCardsSection } from "@/components/events/cards-section";
import { RecommendationsSection } from "@/components/events/recommendations";
import { ThemeToggle } from "@/components/theme-toggle";
import TailwindIndicator from "@/components/tailwind-indicator";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Events",
      item: `${baseUrl}/events`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Events",
  description:
    "Join Mindcare’s upcoming online mental health events, workshops, and webinars to boost your wellbeing.",
  keywords: [
    "Mindcare events",
    "mental health workshops",
    "online webinars",
    "wellness community",
  ],
  alternates: {
    canonical: `${baseUrl}/events`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Mindcare Events",
    description:
      "Join Mindcare’s online mental health events, workshops and webinars for a happier, healthier you.",
    url: `${baseUrl}/events`,
    siteName: "Mindcare",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Mindcare Events Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindcare Events",
    description:
      "Discover Mindcare’s lineup of mental health events, workshops & webinars.",
    images: [`${baseUrl}/opengraph-image.png`],
  },
};

export default function EventsPage() {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <main className="container mx-auto px-4" role="main">
        <EventBannerCarousel aria-labelledby="events-hero" />
        <EventCardsSection aria-labelledby="events-list" />
        <RecommendationsSection aria-labelledby="you-might-like" />
      </main>
      <SiteFooter />
      <div className="fixed right-5 bottom-5">
        <ThemeToggle />
      </div>
      <TailwindIndicator />
    </div>
  );
}
