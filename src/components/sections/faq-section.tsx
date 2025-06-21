"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  className?: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "How does Mindcare work?",
    answer:
      "Mindcare provides a comprehensive mental health platform that combines AI-powered support, licensed therapist sessions, guided meditation, and community resources. You can start with our AI chat for immediate support, book therapy sessions, or explore our wellness resources at your own pace.",
  },
  {
    id: 2,
    question: "Are the Mindcare therapists licensed?",
    answer:
      "Yes, all therapists on our platform are licensed mental health professionals with verified credentials. They undergo a thorough vetting process and maintain active licenses in their respective states. You can view each therapist's qualifications and specializations in their profile.",
  },
  {
    id: 3,
    question: "Is Mindcare covered by insurance?",
    answer:
      "Many insurance plans cover online therapy sessions through Mindcare. We accept most major insurance providers and can help you verify your coverage. We also offer affordable self-pay options and sliding scale fees for those without insurance coverage.",
  },
  {
    id: 4,
    question: "What should I expect in my first session?",
    answer:
      "Your first session is an opportunity to get acquainted with your therapist and discuss your goals. They'll ask about your background, current challenges, and what you hope to achieve. This helps create a personalized treatment plan tailored to your specific needs.",
  },
  {
    id: 5,
    question: "Is my information confidential?",
    answer:
      "Yes, your privacy and confidentiality are our top priorities. All data is encrypted, and sessions are conducted through secure, HIPAA-compliant systems. We never share your personal information without your explicit consent.",
  },
  {
    id: 6,
    question: "What if I’m in crisis or need immediate help?",
    answer:
      "Mindcare is not a crisis service. If you're in immediate danger or need urgent help, please call 911 or contact a crisis line like the Suicide & Crisis Lifeline at 988 in the U.S. We're here to support your ongoing mental health, but emergencies require immediate local assistance.",
  },
  {
    id: 7,
    question:
      "Do you offer support for specific conditions like anxiety or depression?",
    answer:
      "Yes, our therapists specialize in a range of conditions, including anxiety, depression, PTSD, OCD, and more. You can filter by specialization when selecting a therapist, ensuring you get matched with someone experienced in treating your concerns.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-0 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-[#FEEDD8]">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-6 text-left transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#00373E]/20 focus:outline-none dark:hover:bg-gray-800/50"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-foreground pr-4 text-lg font-semibold md:text-xl dark:text-[#00373E]">
              {faq.question}
            </h3>
            <div className="flex-shrink-0">
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-[#00373E] transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#00373E] transition-transform duration-200" />
              )}
            </div>
          </div>
        </button>

        {/* Expandable Answer */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6">
            <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
              {faq.answer}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FAQSection({ className }: FAQSectionProps) {
  const [openItem, setOpenItem] = useState<number | null>();

  const toggleItem = (id: number) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`bg-background py-16 md:py-24 xl:px-32 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Header & Illustration */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center lg:text-left">
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                NEED HELP?
              </span>
              <h2 className="text-foreground mb-4 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
                Frequently <br />
                Asked Questions
              </h2>
              <p className="text-muted-foreground mx-auto max-w-lg text-lg md:text-xl lg:mx-0">
                Find answers to common questions about our services, therapy,
                and mental well-being.
              </p>
            </div>

            {/* Illustration */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md">
                <div className="flex aspect-square items-center justify-center rounded-3xl">
                  <Image
                    src="/assets/image/section/faq-illustration.png"
                    alt="FAQ illustration"
                    width={300}
                    height={300}
                    className="pointer-events-none h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openItem === faq.id}
                onToggle={() => toggleItem(faq.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
