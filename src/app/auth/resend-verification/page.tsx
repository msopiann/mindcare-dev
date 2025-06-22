"use client";
import ResendVerificationContent from "@/components/auth/resend-verification-content";
import { Suspense } from "react";

export default function ResendVerificationPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ResendVerificationContent />
    </Suspense>
  );
}
