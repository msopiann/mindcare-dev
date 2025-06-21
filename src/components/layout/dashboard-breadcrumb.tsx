"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  chat: "Chat",
  "popular-keyword": "Popular Keyword",
  "system-prompt": "System Prompt",
  resources: "Resources",
  events: "Events",
  users: "Users",

  create: "Create",
  edit: "Edit",

  setting: "Settings",
};

export default function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter((seg) => seg && seg !== "dashboard");

  const crumbs = segments.map((seg, idx) => {
    const isLast = idx === segments.length - 1;
    const label = titleMap[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    const href = ["/dashboard", ...segments.slice(0, idx + 1)].join("/");

    return { label, href, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex items-center space-x-2">
        {/* Always start with Dashboard */}
        <li>
          {crumbs.length > 0 ? (
            <Link href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
          ) : (
            <span className="text-base font-medium">Dashboard</span>
          )}
        </li>

        {crumbs.map(({ label, href, isLast }) => (
          <li key={href} className="flex items-center space-x-2">
            <span className="text-gray-400">/</span>
            {isLast ? (
              <span className="text-base font-medium">{label}</span>
            ) : (
              <Link href={href} className="text-sm hover:underline">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
