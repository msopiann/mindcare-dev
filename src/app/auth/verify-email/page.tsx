"use client";
import VerifyEmailContent from "@/components/auth/verify-email-content";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
