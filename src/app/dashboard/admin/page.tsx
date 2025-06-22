"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Add admin dashboard content here */}
    </div>
  );
}

export default function DashboardPage() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  }

  if (!isAdmin) {
    redirect("/chat");
  }

  return <AdminDashboard />;
}
