"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "@/hooks/use-events-api";
import { format } from "date-fns";
import { normalizeImageUrl } from "@/lib/utils";

interface EventCardsSectionProps {
  className?: string;
}

const CARDS_PER_VIEW = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function EventCard({ event, isNew = false }: { event: any; isNew?: boolean }) {
  const [hasAnimated, setHasAnimated] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setHasAnimated(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const formatPrice = () => {
    if (event.isFree || event.price === null || event.price === 0) {
      return <span className="font-semibold text-green-600">Free</span>;
    }
    return (
      <span className="font-semibold text-orange-600">
        Rp {event.price.toLocaleString()}
      </span>
    );
  };

  const formatDate = () => {
    try {
      return format(new Date(event.startDate), "MMM dd, yyyy");
    } catch {
      return event.startDate;
    }
  };

  return (
    <Card
      className={`group rounded-3xl border-0 bg-white transition-all duration-300 hover:scale-101 hover:shadow-md ${
        isNew
          ? `transform transition-all duration-200 ease-out ${
              hasAnimated
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`
          : ""
      }`}
    >
      <CardContent className="flex h-full flex-col p-0">
        <div className="relative aspect-[4/3]">
          <Image
            src={normalizeImageUrl(event.image)}
            alt={event.title}
            fill
            className="rounded-t-2xl object-cover transition-transform duration-300"
          />
          {event.highlighted && (
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 bg-yellow-500/90 font-semibold text-yellow-900"
            >
              Featured
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col space-y-2 p-2.5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-black">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-black">
              <Calendar className="h-4 w-4" />
              <span>{formatDate()}</span>
            </div>
          </div>
          <Link href={event.link}>
            <h3 className="line-clamp-2 text-lg leading-tight font-bold text-black">
              {event.title}
            </h3>
          </Link>
          <div className="mt-auto flex justify-between gap-4 pt-4">
            <div className="flex-1 space-y-1">
              <div className="text-muted-foreground text-xs">Mulai dari</div>
              <div className="text-xs">{formatPrice()}</div>
            </div>
            <div className="flex-1 text-end">
              {event.ticketAvailability ? (
                <span className="text-xs text-teal-500 hover:text-teal-600">
                  Tiket Tersedia
                </span>
              ) : (
                <span className="text-xs text-red-600">Tiket Habis</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventCardsSection({ className }: EventCardsSectionProps) {
  // Replace static data with API call
  const { data: eventsData, isLoading } = useEvents({ limit: 12 });
  const events = eventsData?.events || [];

  const total = events.length;
  const maxStart = Math.max(0, total - CARDS_PER_VIEW);

  const [start, setStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_VIEW);
  const [previousVisibleCount, setPreviousVisibleCount] =
    useState(CARDS_PER_VIEW);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMdUp = useMediaQuery("(min-width: 768px)");

  const prev = () => {
    const newStart = clamp(start - 1, 0, maxStart);
    setStart(newStart);
  };

  const next = () => {
    const newStart = clamp(start + 1, 0, maxStart);
    setStart(newStart);
  };

  const loadMore = () => {
    setPreviousVisibleCount(visibleCount);
    const newCount = clamp(
      visibleCount + CARDS_PER_VIEW,
      CARDS_PER_VIEW,
      total,
    );
    setVisibleCount(newCount);
  };

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, [start, visibleCount]);

  if (isLoading) {
    return (
      <section className={`py-16 sm:px-6 xl:px-8 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between md:mb-12">
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              Event Terbaru
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-3xl border-0 bg-white">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] animate-pulse rounded-t-2xl bg-gray-200" />
                  <div className="space-y-2 p-2.5">
                    <div className="h-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 animate-pulse rounded bg-gray-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 sm:px-6 xl:px-8 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between md:mb-12">
          <div className="flex flex-col space-y-4 space-x-0 md:flex-row md:items-baseline md:space-y-0 md:space-x-4">
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              Event Terbaru
            </h2>
            <Link href="/events" className="text-xs text-blue-500">
              Lihat Semua
            </Link>
          </div>
          <div className="hidden space-x-2 md:flex">
            <Button
              onClick={prev}
              variant="outline"
              size="icon"
              aria-label="Previous"
              disabled={start === 0}
            >
              <ArrowLeft />
            </Button>
            <Button
              onClick={next}
              variant="outline"
              size="icon"
              aria-label="Next"
              disabled={start >= maxStart}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>

        <div
          ref={containerRef}
          tabIndex={-1}
          className="focus:ring-0 focus:outline-none"
        >
          {isMdUp ? (
            <div className="overflow-hidden p-3">
              <div
                className="grid auto-cols-[calc((100%-6rem)/4)] grid-flow-col gap-8 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${(start * 100) / CARDS_PER_VIEW}%)`,
                }}
              >
                {events.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            </div>
          ) : (
            <div
              key={visibleCount}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              {events.slice(0, visibleCount).map((evt, idx) => {
                const isNew = idx >= previousVisibleCount;
                return <EventCard key={evt.id} event={evt} isNew={isNew} />;
              })}
            </div>
          )}
        </div>

        {!isMdUp && visibleCount < total && (
          <div className="mt-6 flex justify-center">
            <Button onClick={loadMore} variant="outline">
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
