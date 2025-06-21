"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface ResourceCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  href: string;
  bgColor: string;
}

interface ResourcesSectionProps {
  className?: string;
}

const RESOURCES: ResourceCardProps[] = [
  {
    title: "Articles & Guides",
    description:
      "In-depth articles and comprehensive guides covering various mental health topics and wellness strategies.",
    buttonText: "Read Article More",
    buttonColor: "bg-yellow-400 hover:bg-yellow-500 text-white",
    href: "/resources",
    bgColor: "dark:bg-[#FEEDD8]",
  },
  {
    title: "Meditation & Relaxation",
    description:
      "Guided meditation sessions, breathing exercises, and relaxation techniques for daily practice.",
    buttonText: "Explore",
    buttonColor: "bg-teal-400 hover:bg-teal-500 text-white",
    href: "/resources",
    bgColor: "dark:bg-[#FEEDD8]",
  },
  {
    title: "Webinars & Workshops",
    description:
      "Live and recorded sessions with mental health professionals covering important wellness topics.",
    buttonText: "Join Now",
    buttonColor: "bg-pink-400 hover:bg-pink-500 text-white",
    href: "/events",
    bgColor: "dark:bg-[#FEEDD8]",
  },
];

function ResourceCard({ resource }: { resource: ResourceCardProps }) {
  return (
    <Card
      className={`group rounded-5xl relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${resource.bgColor}`}
    >
      <CardContent className="flex h-full flex-col p-8">
        {/* Icon */}

        {/* Content */}
        <div className="flex-1 space-y-4 text-center">
          <h3 className="text-xl font-bold md:text-2xl dark:text-[#00373E]">
            {resource.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            {resource.description}
          </p>
        </div>

        {/* Button */}
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            size="lg"
            className={`rounded-full px-8 py-3 font-semibold transition-all duration-300 ${resource.buttonColor}`}
          >
            <Link href={resource.href}>{resource.buttonText}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResourcesSection({ className }: ResourcesSectionProps) {
  return (
    <section className={`bg-background py-16 xl:px-32 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="text-muted-foreground text-xs tracking-wider uppercase">
            EXPLORE & LEARN
          </span>
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
            Resources for <br />
            Your Well-being
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
            Explore expert insights, self-care guides, <br />
            and tools to support your mental health journey.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {RESOURCES.map((resource, index) => (
            <ResourceCard key={index} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
}
