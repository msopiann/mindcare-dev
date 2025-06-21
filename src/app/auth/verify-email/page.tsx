"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyEmail, useResendVerification } from "@/hooks/use-auth-api";

interface VerifyEmailPageProps {
  className?: string;
}

export default function VerifyEmailPage({ className }: VerifyEmailPageProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerification();

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(
        { token },
        {
          onSuccess: () => setVerificationStatus("success"),
          onError: () => setVerificationStatus("error"),
        },
      );
    }
  }, [token]);

  const handleResendVerification = () => {
    if (email) {
      resendVerificationMutation.mutate({ email });
    }
  };

  if (verificationStatus === "success") {
    return (
      <div
        className={cn(
          "flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8",
          className,
        )}
      >
        <Card className="w-full max-w-md py-6">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="mt-4 text-xl">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now sign in to
              your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <Button asChild className="w-full">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div
        className={cn(
          "flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8",
          className,
        )}
      >
        <Card className="w-full max-w-md py-6">
          <CardHeader className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <CardTitle className="mt-4 text-xl">Verification Failed</CardTitle>
            <CardDescription>
              The verification link is invalid or has expired. Please request a
              new verification email.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 grid gap-4">
            {email && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={resendVerificationMutation.isPending}
              >
                {resendVerificationMutation.isPending
                  ? "Sending..."
                  : "Resend verification email"}
              </Button>
            )}
            <div className="text-muted-foreground text-center text-sm">
              <Link
                href="/auth/sign-in"
                className="underline underline-offset-4"
              >
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8",
        className,
      )}
    >
      <Card className="w-full max-w-md py-6">
        <CardHeader className="text-center">
          <Mail className="text-muted-foreground mx-auto h-12 w-12" />
          <CardTitle className="mt-4 text-xl">Verifying your email</CardTitle>
          <CardDescription>
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
