"use client";
import ResetPasswordContent from "@/components/auth/reset-password-content";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
