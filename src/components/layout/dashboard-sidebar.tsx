"use client";

import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Cloud,
  Command,
  Drum,
  File,
  MessageCircle,
  Notebook,
  Settings,
  Users,
} from "lucide-react";
import { DashboardNavMain } from "./dashboard-nav-main";
import { DashboardNavUser } from "./dashboard-nav-user";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types/auth";

const userNavigationItems = [
  {
    title: "Chat Overview",
    url: "/dashboard",
    icon: Notebook,
  },
  {
    title: "Go to Chatbot",
    url: "/chat",
    icon: MessageCircle,
  },
];

const adminNavigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: Notebook,
  },
  {
    title: "Chatbot Setting",
    url: "/dashboard/admin/chat",
    icon: MessageCircle,
    items: [
      {
        title: "System Prompt",
        url: "/dashboard/admin/chat/system-prompt",
        icon: Settings,
      },
      {
        title: "Users Chat",
        url: "/dashboard/admin/chat/users",
        icon: Users,
      },
      {
        title: "Popular Keyword",
        url: "/dashboard/admin/chat/popular-keyword",
        icon: Cloud,
      },
    ],
  },
  {
    title: "Resources",
    url: "/dashboard/admin/resources",
    icon: File,
  },
  {
    title: "Events",
    url: "/dashboard/admin/events",
    icon: Drum,
  },
  {
    title: "Content",
    url: "/dashboard/admin/content",
    icon: Command,
  },
];

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || "",
      }
    : null;

  const navigationItems =
    session?.user?.role === UserRole.ADMIN
      ? adminNavigationItems
      : userNavigationItems;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="text-lg font-bold">
                Mindcare
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>{user && <DashboardNavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
