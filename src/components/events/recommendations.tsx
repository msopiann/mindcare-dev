"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRecommendations } from "@/hooks/use-events-api";
import { normalizeImageUrl } from "@/lib/utils";

interface RecommendationsSectionProps {
  className?: string;
}

function RecommendationCard({ recommendation }: { recommendation: any }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <Image
            src={normalizeImageUrl(recommendation.image)}
            alt={recommendation.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="space-y-3 p-4">
          <Link href={recommendation.link}>
            <h3 className="line-clamp-2 text-base leading-tight font-semibold text-gray-800 transition-colors hover:text-teal-600">
              {recommendation.title}
            </h3>
          </Link>
          {recommendation.description && (
            <p className="line-clamp-2 text-sm text-gray-600">
              {recommendation.description}
            </p>
          )}
          <div className="pt-2">
            <div className="text-sm text-gray-500">Category</div>
            <div className="text-sm font-medium">{recommendation.category}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecommendationsSection({
  className,
}: RecommendationsSectionProps) {
  const { data: recommendationsData, isLoading } = useRecommendations();
  const recommendations = recommendationsData?.recommendations || [];

  if (isLoading) {
    return (
      <section className={`py-16 sm:px-6 xl:px-16 ${className}`}>
        <div className="relative container mx-auto animate-pulse rounded-3xl bg-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mx-auto h-12 w-64 animate-pulse rounded bg-gray-300" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white p-4">
                  <div className="mb-4 aspect-[4/3] animate-pulse rounded-t-2xl bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 sm:px-6 xl:px-16 ${className}`}>
      <div className="relative container mx-auto bg-[url('/assets/image/events/recommendations-bg.png')] bg-cover bg-center p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Rekomendasi untuk mu
            </h2>
          </div>
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
          <div className="text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-2 border-white bg-transparent px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-gray-900"
            >
              <Link href="/events">Lihat Lebih Banyak</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
