"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the navigation structure with proper TypeScript interfaces
interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface SiteHeaderProps {
  className?: string;
}

// Navigation data
const leftNavItems: NavItem[] = [
  { label: "Home", href: "/", ariaLabel: "Go to homepage" },
  { label: "About", href: "/about", ariaLabel: "Learn about Mindcare" },
  { label: "Chat bot", href: "/chat", ariaLabel: "Start AI wellness chat" },
];

const rightNavItems: NavItem[] = [
  {
    label: "Events",
    href: "/events",
    ariaLabel: "View upcoming mental health events",
  },
  {
    label: "Resources",
    href: "/resources",
    ariaLabel: "Access mental health resources",
  },
  { label: "Contact", href: "#contact", ariaLabel: "Contact Mindcare support" },
];

export function SiteHeader({ className }: SiteHeaderProps) {
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu with proper state management
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when navigation item is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur ${className}`}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-32">
        <div className="flex h-16 items-center justify-between">
          {/* Left Navigation - Hidden on mobile, shown on desktop */}
          <nav
            className="hidden items-center space-x-8 md:flex"
            role="navigation"
            aria-label="Primary navigation"
          >
            {leftNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200 dark:text-white dark:hover:text-white/60"
                aria-label={item.ariaLabel}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logo - Centered on desktop, left-aligned on mobile */}
          <div className="flex-1 md:flex-none">
            <Link
              href="/"
              className="flex items-center justify-start md:justify-center"
              aria-label="Mindcare - Mental health support platform"
            >
              <span className="text-foreground text-2xl font-bold dark:text-white">
                Mindcare
              </span>
            </Link>
          </div>

          {/* Right Navigation - Hidden on mobile, shown on desktop */}
          <nav
            className="hidden items-center space-x-8 md:flex"
            role="navigation"
            aria-label="Secondary navigation"
          >
            {rightNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200 dark:text-white dark:hover:text-white/60"
                aria-label={item.ariaLabel}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button - Only visible on mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu - Slides down when open */}
        {isMobileMenuOpen && (
          <div className="bg-background border-t md:hidden" id="mobile-menu">
            <nav
              className="flex flex-col space-y-1 px-4 py-4"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {/* Combine all navigation items for mobile */}
              {[...leftNavItems, ...rightNavItems].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200 dark:hover:text-white"
                  onClick={closeMobileMenu}
                  aria-label={item.ariaLabel}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
