"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface WellbeingPathSectionProps {
  className?: string;
}

export function WellbeingPathSection({ className }: WellbeingPathSectionProps) {
  return (
    <section className={`bg-background py-16 xl:px-32 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="text-muted-foreground text-xs uppercase">
            Services
          </span>
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Your Path to <br />
            Well-being
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
            Discover expert guidance for a healthier
            <br />
            mind and balanced life.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Mindfulness & Meditation Card */}
          <Card className="relative overflow-hidden rounded-3xl border-0 bg-[#FDE5C8]">
            <CardContent className="relative z-10 flex h-full flex-col justify-between p-8">
              <div className="z-10 space-y-4">
                <h3 className="text-foreground text-xl font-semibold md:text-2xl dark:text-[#00373E]">
                  Mindfulness & <br /> Meditation
                </h3>
                <p className="text-muted-foreground text-sm md:text-base dark:text-[#00373E]">
                  Guided meditation sessions
                  <br />
                  and stress management <br /> techniques.
                </p>
              </div>
              <div className="mt-6">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-foreground text-foreground rounded-full border bg-transparent px-6 py-4 dark:bg-white dark:text-[#00373E]"
                >
                  <Link href="/resources">Explore Resources</Link>
                </Button>
              </div>
              <div className="pointer-events-none absolute right-0 bottom-10 z-0 lg:right-10">
                <Image
                  src="/assets/image/section/mindfulness-icon.png"
                  alt="Mindfulness hearts"
                  width={200}
                  height={300}
                />
              </div>
            </CardContent>
          </Card>

          {/* One-on-One Therapy Card */}
          <Card className="relative overflow-hidden rounded-3xl border-0 bg-white">
            <CardContent className="relative z-10 flex h-full flex-col justify-between p-8">
              <div className="space-y-4">
                <h3 className="text-foreground text-xl font-semibold md:text-2xl dark:text-[#00373E]">
                  One-on-One <br /> Therapy
                </h3>
                <p className="text-muted-foreground text-sm md:text-base dark:text-[#00373E]">
                  Virtual and in-person therapy
                  <br />
                  sessions with licensed <br /> professionals.
                </p>
              </div>
              <div className="mt-6">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-foreground text-foreground rounded-full border bg-transparent px-6 py-4 dark:bg-[#FEEDD8] dark:text-[#00373E]"
                >
                  <Link href="/auth/sign-in">Book a Therapy Session </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Wellness Chat with AI Card */}
          <Card className="relative overflow-hidden rounded-3xl border-0 bg-white md:col-span-2">
            <CardContent className="relative z-10 grid grid-cols-1 items-center gap-6 p-8 md:grid-cols-2">
              <div className="z-10">
                <h3 className="text-foreground text-xl font-semibold md:text-2xl dark:text-[#00373E]">
                  Wellness Chat with AI
                </h3>
                <p className="text-muted-foreground mt-2 w-[200px] text-sm md:w-full md:text-base dark:text-[#00373E]">
                  Meet a virtual assistant who is ready to help you understand
                  your feelings, give you helpful advice, and guide you to the
                  right resources – anytime, anywhere. Not a substitute for a
                  professional, but a good start.
                </p>
                <div className="mt-6">
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="border-foreground rounded-full border bg-[#00373E] px-6 py-4 text-white"
                  >
                    <Link href="/chat">Start A Conversation</Link>
                  </Button>
                </div>
              </div>
              <div className="pointer-events-none absolute right-0 bottom-0 z-0">
                <Image
                  src="/assets/image/section/ai-chat-icon.png"
                  alt="AI Chat Illustration"
                  width={300}
                  height={300}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
