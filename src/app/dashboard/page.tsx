"use client";

import { ChatInterface } from "@/components/layout/user/chat-interface";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  }

  return <ChatInterface />;
}
