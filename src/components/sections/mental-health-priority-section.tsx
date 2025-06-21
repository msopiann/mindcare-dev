"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface MentalHealthPrioritySectionProps {
  className?: string;
}

export function MentalHealthPrioritySection({
  className,
}: MentalHealthPrioritySectionProps) {
  return (
    <section className={`bg-background py-16 xl:px-32 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <span className="text-xs uppercase">How it Works</span>
            <h2 className="text-foreground mx-auto text-3xl leading-tight font-bold md:text-4xl lg:mx-0 lg:w-full lg:text-5xl">
              Help You Prioritize Your Mental Health
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
              Find your way, share your feelings, and <br /> start your healing
              journey
            </p>

            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#00373E] px-8 py-2 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:shadow-xl dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <Link href="/auth/sign-in">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Main illustration container */}
              <div className="rounded-5xl relative bg-[#00373E] px-8 pt-8 dark:bg-[#F9E6D0]">
                <div className="flex aspect-square items-center justify-center rounded-3xl">
                  <Image
                    src="/assets/image/section/priority-illustration.png"
                    alt="Mental health priority illustration"
                    width={100}
                    height={100}
                    className="pointer-events-none h-full w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
