"use client";
import ForgotPasswordContent from "@/components/auth/forgot-password-content";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
