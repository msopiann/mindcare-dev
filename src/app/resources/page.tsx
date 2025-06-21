import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ResourcesBannerCarousel } from "@/components/resources/banner-carousel";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import TailwindIndicator from "@/components/tailwind-indicator";
import { ResourcesSection } from "@/components/resources/resources-section";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Resources",
      item: `${baseUrl}/resources`,
    },
  ],
};

const collectionData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Mindcare Resources",
  description:
    "Dive into Mindcare's expert articles, self-care guides, and therapy tips to support your mental wellness journey.",
  url: `${baseUrl}/resources`,
};

export const metadata: Metadata = {
  title: "Resources | Mindcare",
  description:
    "Explore Mindcare's library of expert articles, self-care guides, and blog posts to nurture your mental wellbeing.",
  keywords: [
    "mental health articles",
    "self-care guides",
    "therapy tips",
    "wellness blog",
    "Mindcare resources",
  ],
  alternates: {
    canonical: `${baseUrl}/resources`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Mindcare Resources",
    description:
      "Browse our articles, guides & blog posts—everything you need for better mental health.",
    url: `${baseUrl}/resources`,
    siteName: "Mindcare",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Mindcare Resources Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindcare Resources",
    description:
      "Dive into expert articles, self-care tips, and therapy insights on Mindcare's blog.",
    images: [`${baseUrl}/opengraph-image.png`],
  },
};

export default function ResourcesPage() {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbData, collectionData]),
        }}
      />

      <main className="container mx-auto px-4" role="main">
        <ResourcesBannerCarousel />

        {/* Articles & Guides - Combined */}
        <ResourcesSection
          id="articles-guides"
          title="Articles & Guides"
          description="Practical tips on stress management, mindfulness, and emotional resilience."
          resourceTypes={["ARTICLE", "GUIDE"]}
          variant="articles"
          limit={6}
        />

        {/* Videos & Podcasts - Combined */}
        <ResourcesSection
          id="video-podcast"
          title="Videos & Podcasts"
          description="Watch and listen to expert discussions on mental health topics and guided sessions."
          resourceTypes={["VIDEO", "PODCAST"]}
          variant="videos"
          limit={6}
        />
      </main>

      <SiteFooter />
      <div className="fixed right-5 bottom-5">
        <ThemeToggle />
      </div>
      <TailwindIndicator />
    </div>
  );
}
