"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  resendVerificationSchema,
  type ResendVerificationInput,
} from "@/lib/validations/auth";
import { useResendVerification } from "@/hooks/use-auth-api";

interface ResendVerificationPageProps {
  className?: string;
}

export default function ResendVerificationPage({
  className,
}: ResendVerificationPageProps) {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const fromRegistration = searchParams.get("from") === "registration";

  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const resendVerificationMutation = useResendVerification();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: emailParam || "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = (data: ResendVerificationInput) => {
    resendVerificationMutation.mutate(data, {
      onSuccess: () => {
        setEmailSent(true);
        setSentToEmail(data.email);
      },
    });
  };

  if (emailSent) {
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
            <CardTitle className="mt-4 text-xl">
              Verification Email Sent!
            </CardTitle>
            <CardDescription>
              We&apos;ve sent a new verification email to{" "}
              <strong>{sentToEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 space-y-4">
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p>Please check your email inbox and spam folder.</p>
                  <p className="text-muted-foreground text-xs">
                    The verification link will expire in 24 hours.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/sign-in">Go to Sign In</Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmailSent(false);
                  setSentToEmail("");
                }}
              >
                Send to Different Email
              </Button>
            </div>

            <div className="text-muted-foreground text-center text-sm">
              <p>Still having trouble?</p>
              <Link
                href="/contact"
                className="hover:text-foreground underline underline-offset-4"
              >
                Contact Support
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
          <CardTitle className="mt-4 text-xl">
            {fromRegistration
              ? "Didn't Receive Your Email?"
              : "Resend Verification Email"}
          </CardTitle>
          <CardDescription>
            {fromRegistration
              ? "No worries! We can send you another verification email."
              : "Enter your email address and we'll send you a new verification link."}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          {fromRegistration && (
            <Alert className="mb-6">
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Check these common issues:</p>
                  <ul className="ml-4 list-disc space-y-1 text-sm">
                    <li>Check your spam/junk folder</li>
                    <li>Make sure you entered the correct email</li>
                    <li>Wait a few minutes for delivery</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={resendVerificationMutation.isPending}
            >
              {resendVerificationMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Verification Email"
              )}
            </Button>

            <div className="text-muted-foreground space-y-2 text-center text-sm">
              <p>
                Already verified?{" "}
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
              {!fromRegistration && (
                <p>
                  Need to create an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
