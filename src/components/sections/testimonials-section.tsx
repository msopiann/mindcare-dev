"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: number;
  name: string;
  content: string;
  age: number;
}

interface TestimonialsSectionProps {
  className?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    content:
      "Mindcare has completely transformed my approach to mental health. The AI chat feature is incredibly helpful for daily check-ins, and the meditation sessions have become an essential part of my routine.",
    age: 35,
  },
  {
    id: 2,
    name: "Michael Chen",
    content:
      "As someone who struggles with anxiety, finding the right support was crucial. The one-on-one therapy sessions through Mindcare have been life-changing. Highly recommend!",
    age: 25,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    content:
      "The mindfulness exercises and guided meditations have helped me manage stress so much better. The platform is user-friendly and the content is top-notch.",
    age: 25,
  },
  {
    id: 4,
    name: "David Thompson",
    content:
      "I was skeptical about online mental health support, but Mindcare exceeded my expectations. The AI assistant is surprisingly insightful and the human therapists are excellent.",
    age: 25,
  },
  {
    id: 5,
    name: "Lisa Park",
    content:
      "Working in healthcare, I needed reliable mental health support. Mindcare's 24/7 availability and professional guidance have been invaluable for my well-being.",
    age: 25,
  },
  {
    id: 6,
    name: "James Wilson",
    content:
      "The combination of AI support and human expertise is perfect. I can get immediate help when needed and schedule deeper sessions with therapists. Game-changer!",
    age: 35,
  },
];

export function TestimonialsSection({
  className = "",
}: TestimonialsSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const SLIDE_COUNT = TESTIMONIALS.length;
  const AUTO_SCROLL_MS = 3000;
  const TRANSITION_MS = 600;

  // Create buffer slides: add first slide at the end for seamless loop
  const bufferSlides = [...TESTIMONIALS, TESTIMONIALS[0]];

  // Measure card width including margin
  useEffect(() => {
    const measureCardWidth = () => {
      const firstCard =
        carouselRef.current?.querySelector<HTMLElement>("[data-testimonial]");
      if (!firstCard) return;

      const style = getComputedStyle(firstCard);
      const marginRight = Number.parseFloat(style.marginRight);
      const width = firstCard.getBoundingClientRect().width;
      setCardWidth(width + marginRight);
    };

    // Initial measurement
    measureCardWidth();

    // Remeasure on resize
    window.addEventListener("resize", measureCardWidth);
    return () => window.removeEventListener("resize", measureCardWidth);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, AUTO_SCROLL_MS);

    return () => clearInterval(interval);
  }, []);

  // Handle infinite loop reset
  useEffect(() => {
    if (currentSlide === SLIDE_COUNT) {
      // Wait for the transition to complete, then reset
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setCurrentSlide(0);

        // Re-enable animation after a brief delay
        setTimeout(() => {
          setIsAnimating(true);
        }, 50);
      }, TRANSITION_MS);

      return () => clearTimeout(timeout);
    }
  }, [currentSlide, SLIDE_COUNT]);

  return (
    <section className={`overflow-hidden py-16 xl:px-32 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 xl:flex-row xl:items-start">
          {/* LEFT SIDE: Heading + copy */}
          <div className="space-y-4 text-center xl:w-1/2 xl:text-left">
            <span className="text-muted-foreground text-xs tracking-wider uppercase">
              Testimonials
            </span>
            <h2 className="text-foreground text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
              What they say
              <br />
              about mental health
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-lg md:text-xl xl:mx-0">
              Hear directly from professionals about the importance of
              maintaining mental health on campus.
            </p>
          </div>

          {/* RIGHT SIDE: Carousel */}
          <div className="relative overflow-hidden xl:w-1/2" ref={carouselRef}>
            {/* Gradient masks for fade edges */}
            <div className="dark:from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-gray-50 to-transparent md:w-10" />
            <div className="dark:from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-gray-50 to-transparent md:w-10" />

            {/* Scrolling container */}
            <div className="relative w-80 overflow-hidden xl:w-full">
              <div
                className="flex space-x-3"
                style={{
                  transform: `translateX(-${cardWidth * currentSlide}px)`,
                  transition: isAnimating
                    ? `transform ${TRANSITION_MS}ms ease-in-out`
                    : "none",
                }}
              >
                {bufferSlides.map((testimonial, idx) => {
                  const isPeach = idx % 2 === 0;
                  return (
                    <Card
                      key={`${testimonial.id}-${idx}`}
                      data-testimonial
                      className={`w-80 flex-shrink-0 rounded-3xl border-0 shadow-lg md:w-96 ${
                        isPeach
                          ? "bg-[#FEEDD8] text-teal-900"
                          : "bg-teal-900 text-white"
                      }`}
                    >
                      <CardContent className="flex h-full flex-col p-8">
                        {/* Testimonial content */}
                        <div className="flex flex-1 items-start">
                          <p className="text-sm leading-relaxed md:text-base">
                            &ldquo;{testimonial.content}&rdquo;
                          </p>
                        </div>
                        {/* Name section  */}
                        <div className="mt-auto flex items-center pt-6">
                          <span className="mr-2">—</span>
                          <span className="font-semibold">
                            {testimonial.name},
                          </span>
                          <span className="ml-2 text-sm">
                            {testimonial.age}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
