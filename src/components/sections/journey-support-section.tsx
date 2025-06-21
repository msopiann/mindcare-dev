"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface JourneySupportSectionProps {
  className?: string;
}

export function JourneySupportSection({
  className = "",
}: JourneySupportSectionProps) {
  return (
    <section className={`relative py-16 md:py-24 xl:px-32 ${className}`}>
      {/* Card */}
      <div className="relative z-10 container mx-auto overflow-hidden rounded-[40px] bg-white px-6 py-12 shadow-2xl lg:px-8 lg:py-16 dark:bg-[#FEEDD8]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* — Left content */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Label */}
            <span className="text-xs tracking-wider uppercase dark:text-[#00373E]">
              COMMUNITY
            </span>

            {/* Heading */}
            <h2 className="mt-2 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl dark:text-[#00373E]">
              You’re Not Alone
              <br />
              on This Journey
            </h2>

            {/* Paragraph */}
            <p className="mx-auto max-w-lg text-lg leading-relaxed md:text-xl lg:mx-0 dark:text-[#00373E]">
              Connect with others, share experiences, and find encouragement in
              a safe, supportive space.
            </p>

            {/* Button */}
            <div className="flex justify-center pt-4 sm:justify-start">
              <Button
                asChild
                size="lg"
                className="mx-auto rounded-full bg-[#00373E] px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-[#012F35] hover:shadow-xl lg:mx-0"
              >
                <Link href="/community">Join The Community</Link>
              </Button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 -z-10 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px]">
            {/* Empty div to maintain grid structure */}
          </div>
        </div>

        {/* Absolute Illustration Image */}
        <div className="absolute right-0 bottom-0 -z-10 w-[300px] sm:w-[400px] md:w-[450px] lg:w-[520px] xl:w-[600px]">
          <Image
            src="/assets/image/section/community-illustration.png"
            alt="Community support illustration"
            width={713}
            height={443}
            className="pointer-events-none h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
