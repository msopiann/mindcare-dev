"use client";

import { memo } from "react";
import { ResourceCard } from "./card";
import { useResources } from "@/hooks/use-resources-api";

interface ResourcesSectionProps {
  id: string;
  title: string;
  description: string;
  resourceTypes?: ("ARTICLE" | "VIDEO" | "PODCAST" | "GUIDE" | "TOOL")[];
  variant: "articles" | "videos";
  className?: string;
  limit?: number;
}

export const ResourcesSection = memo<ResourcesSectionProps>(
  function ResourcesSection({
    id,
    title,
    description,
    resourceTypes,
    variant,
    className = "",
    limit = 6,
  }) {
    // Use the updated hook with multiple types support
    const { data: resourcesData, isLoading } = useResources({
      types: resourceTypes, // Pass array of types
      limit: limit,
    });

    const resources = resourcesData?.resources || [];

    if (isLoading) {
      return (
        <section
          id={id}
          className={`py-16 lg:py-24 ${className}`}
          aria-labelledby={`${id}-heading`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-32">
            <div className="mb-16 text-center">
              <h2
                id={`${id}-heading`}
                className="text-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
              >
                {title}
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
                {description}
              </p>
            </div>

            {/* Loading skeleton */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: limit }).map((_, i) => (
                <div
                  key={i}
                  className="mx-auto w-[90%] animate-pulse rounded-3xl bg-gray-200"
                >
                  <div className="p-6">
                    <div className="mb-6 aspect-[4/3] animate-pulse rounded-2xl bg-gray-300" />
                    <div className="space-y-2">
                      <div className="h-6 animate-pulse rounded bg-gray-300" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
                      <div className="mt-4 h-10 w-24 animate-pulse rounded bg-gray-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (resources.length === 0) {
      return (
        <section
          id={id}
          className={`py-16 lg:py-24 ${className}`}
          aria-labelledby={`${id}-heading`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-32">
            <div className="mb-16 text-center">
              <h2
                id={`${id}-heading`}
                className="text-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
              >
                {title}
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
                {description}
              </p>
            </div>
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No resources available at the moment.
              </p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section
        id={id}
        className={`py-16 lg:py-24 ${className}`}
        aria-labelledby={`${id}-heading`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-32">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2
              id={`${id}-heading`}
              className="text-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
              {description}
            </p>
          </div>

          {/* Resources Grid */}
          <div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label={`${title} resources`}
          >
            {resources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                variant={getCardVariant(index, variant)}
                priority={index < 3}
              />
            ))}
          </div>
        </div>
      </section>
    );
  },
);

function getCardVariant(
  index: number,
  sectionVariant: "articles" | "videos",
): "primary" | "secondary" {
  if (sectionVariant === "articles") {
    return index === 1 ? "secondary" : "primary";
  } else {
    return index === 1 ? "primary" : "secondary";
  }
}
