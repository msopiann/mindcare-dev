"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useResourceBanners } from "@/hooks/use-resources-api";
import { normalizeImageUrl } from "@/lib/utils";

interface ResourcesBannerCarouselProps {
  className?: string;
}

export function ResourcesBannerCarousel({
  className,
}: ResourcesBannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [bannerWidth, setBannerWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Replace static data with API call
  const { data: bannersData, isLoading } = useResourceBanners();
  const banners = bannersData?.banners || [];

  const SLIDE_COUNT = banners.length;
  const AUTO_SCROLL_MS = 4000;
  const TRANSITION_MS = 600;

  const bufferSlides = [...banners, banners[0]];

  useEffect(() => {
    const measureBannerWidth = () => {
      const firstBanner =
        carouselRef.current?.querySelector<HTMLElement>("[data-banner]");
      if (!firstBanner) return;
      const width = firstBanner.getBoundingClientRect().width;
      setBannerWidth(width);
    };

    measureBannerWidth();
    window.addEventListener("resize", measureBannerWidth);
    return () => window.removeEventListener("resize", measureBannerWidth);
  }, [banners]);

  useEffect(() => {
    if (SLIDE_COUNT === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, AUTO_SCROLL_MS);

    return () => clearInterval(interval);
  }, [SLIDE_COUNT]);

  useEffect(() => {
    if (currentSlide === SLIDE_COUNT) {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setCurrentSlide(0);
        setTimeout(() => setIsAnimating(true), 50);
      }, TRANSITION_MS);
      return () => clearTimeout(timeout);
    }
  }, [currentSlide, SLIDE_COUNT]);

  // Loading state
  if (isLoading || banners.length === 0) {
    return (
      <section
        className={`overflow-hidden py-8 sm:px-6 md:py-12 xl:px-8 ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="aspect-[16/6] animate-pulse rounded-3xl bg-gray-200 md:aspect-[20/6] lg:aspect-[24/6]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`overflow-hidden py-8 sm:px-6 md:py-12 xl:px-8 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl" ref={carouselRef}>
          <div
            className="flex"
            style={{
              transform: `translateX(-${bannerWidth * currentSlide}px)`,
              transition: isAnimating
                ? `transform ${TRANSITION_MS}ms ease-in-out`
                : "none",
            }}
          >
            {bufferSlides.map((banner, idx) => (
              <Link
                href={banner.link || "#"}
                key={`${banner.id}-${idx}`}
                data-banner
                className="w-full flex-shrink-0"
                passHref
              >
                <div className="relative aspect-[16/6] md:aspect-[20/6] lg:aspect-[24/6]">
                  <Image
                    src={normalizeImageUrl(banner.image)}
                    alt={banner.title}
                    fill
                    className="rounded-3xl object-cover"
                    priority={idx === 0}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
