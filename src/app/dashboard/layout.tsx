import DashboardLayout from "@/components/layout/dashboard-layout";
import type React from "react";

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
