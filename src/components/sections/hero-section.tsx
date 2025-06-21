"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={`bg-background relative overflow-hidden ${className}`}>
      {/* Main Content Container */}
      <div className="rounded-6xl relative z-10 mx-auto my-4 w-[80vw] overflow-hidden bg-[#F9E6D0] px-4 sm:my-6 sm:px-6 lg:my-8 lg:px-8">
        {/* Decorations */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-0 hidden sm:block lg:w-80">
          <Image
            src="/assets/image/hero/hero-left-decoration.png"
            alt="Decorative illustration showing mental wellness support"
            width={350}
            height={350}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0 z-0 sm:block lg:w-80">
          <Image
            src="/assets/image/hero/hero-right-decoration.png"
            alt="Decorative illustration representing emotional well-being"
            width={334}
            height={560}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Content  */}
        <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center py-16 text-center md:py-24">
          {/* Main Heading */}
          <h1 className="text-foreground mb-6 max-w-4xl text-4xl leading-tight font-bold md:text-5xl lg:text-6xl xl:text-7xl dark:text-[#00373E]">
            Empowering Your Emotional Well-being
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground mb-8 max-w-2xl text-lg leading-relaxed md:text-xl lg:text-2xl dark:text-[#00373E]">
            A Calm Mind is the Key to a Bright Future.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#00373E] px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:shadow-xl dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Link
                href="/auth/sign-in"
                aria-label="Start your mental wellness journey with Mindcare"
              >
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
