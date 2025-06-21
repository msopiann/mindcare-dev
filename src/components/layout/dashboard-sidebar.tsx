"use client";

import * as React from "react";

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

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/assets/image/chat/avatar-user.png",
  },
  DashboardNavMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Notebook,
    },
    {
      title: "Chatbot Setting",
      url: "/dashboard/chat",
      icon: MessageCircle,
      items: [
        {
          title: "System Prompt",
          url: "/dashboard/chat/system-prompt",
          icon: Settings,
        },
        {
          title: "Users Chat",
          url: "/dashboard/chat/users",
          icon: Users,
        },
        {
          title: "Popular Keyword",
          url: "/dashboard/chat/popular-keyword",
          icon: Cloud,
        },
      ],
    },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: File,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Drum,
    },
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
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">Mindcare.</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={data.DashboardNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
