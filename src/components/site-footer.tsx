"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

const FOOTER_LINKS = {
  main: [
    {
      label: "About",
      href: "#",
      ariaLabel: "Learn about Mindcare's mission",
    },
    {
      label: "Events",
      href: "/events",
      ariaLabel: "View mental health events",
    },
    {
      label: "Resources",
      href: "/resources",
      ariaLabel: "Access wellness resources",
    },
    {
      label: "Contact",
      href: "#contact",
      ariaLabel: "Contact our support team",
    },
  ],
  social: [
    {
      label: "Instagram",
      href: "https://instagram.com/mindcare",
      ariaLabel: "Follow Mindcare on Instagram",
    },
    {
      label: "Facebook",
      href: "https://facebook.com/mindcare",
      ariaLabel: "Follow Mindcare on Facebook",
    },
    {
      label: "YouTube",
      href: "https://youtube.com/mindcare",
      ariaLabel: "Subscribe to Mindcare on YouTube",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/mindcare",
      ariaLabel: "Connect with Mindcare on LinkedIn",
    },
  ],
  legal: [
    {
      label: "Terms Of Use",
      href: "#",
      ariaLabel: "Read our terms of service",
    },
    {
      label: "Privacy Policy",
      href: "#",
      ariaLabel: "Read our privacy policy",
    },
  ],
};

export function SiteFooter({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className={`container mx-auto px-4 py-16 xl:px-32 ${className}`}
      role="contentinfo"
      aria-label="Site footer with contact information and links"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Brand & Links */}
          <div className="order-2 lg:order-1">
            <div className="h-full space-y-8 rounded-3xl p-8 shadow-2xl">
              {/* Brand Name */}
              <div>
                <h3 className="text-2xl font-bold text-[#00373E] md:text-3xl dark:text-white">
                  Mindcare
                </h3>
              </div>

              {/* Footer Links Grid */}
              <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                {/* Main Links */}
                <div className="space-y-4">
                  <h4 className="sr-only">Main Navigation</h4>
                  {FOOTER_LINKS.main.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-muted-foreground block text-sm transition-colors duration-200 hover:text-[#00373E] md:text-base dark:hover:text-white"
                      aria-label={link.ariaLabel}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h4 className="sr-only">Social Media</h4>
                  {FOOTER_LINKS.social.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground block text-sm transition-colors duration-200 hover:text-[#00373E] md:text-base dark:hover:text-white"
                      aria-label={link.ariaLabel}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Legal Links */}
                <div className="space-y-4">
                  <h4 className="sr-only">Legal Information</h4>
                  {FOOTER_LINKS.legal.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-muted-foreground block text-sm transition-colors duration-200 hover:text-[#00373E] md:text-base dark:hover:text-white"
                      aria-label={link.ariaLabel}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Copyright */}
              <div className="pt-8">
                <p className="text-muted-foreground text-sm">
                  © [{currentYear}] Mindcare.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - CTA Card */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative h-full w-full">
              <div className="relative h-full overflow-hidden rounded-3xl bg-[#00373E] p-8 lg:p-12 dark:bg-white">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[200px]">
                  <Image
                    src="/assets/image/section/footer-illustration.png"
                    alt="Illustration representing mental health support and guidance"
                    width={300}
                    height={300}
                    className="w-full object-contain"
                    priority
                    sizes="200px"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  <h3 className="text-2xl leading-tight font-bold text-white md:text-3xl lg:text-4xl dark:text-[#00373E]">
                    Find <br />
                    Support, <br />
                    Guidance, <br />
                    and Balance.
                  </h3>

                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-full bg-white px-8 py-6 text-lg font-semibold text-[#00373E] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:bg-[#00373E] dark:text-white"
                  >
                    <Link
                      href="/auth/sign-in"
                      aria-label="Start your mental wellness journey now"
                    >
                      Find Support Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
