"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
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
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { useResetPassword } from "@/hooks/use-auth-api";

interface ResetPasswordContentProps {
  className?: string;
}

export default function ResetPasswordContent({
  className,
}: ResetPasswordContentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const onSubmit = (data: ResetPasswordInput) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2000);
      },
    });
  };

  if (!token) {
    return (
      <div
        className={cn(
          "flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8",
          className,
        )}
      >
        <Card className="w-full max-w-md py-6">
          <CardHeader className="text-center">
            <Lock className="text-muted-foreground mx-auto h-12 w-12" />
            <CardTitle className="mt-4 text-xl">Invalid Reset Link</CardTitle>
            <CardDescription>
              The password reset link is invalid or missing. Please request a
              new password reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <Button asChild className="w-full">
              <Link href="/auth/forgot-password">Request New Reset Link</Link>
            </Button>
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
          <Lock className="text-muted-foreground mx-auto h-12 w-12" />
          <CardTitle className="mt-4 text-xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <input type="hidden" {...register("token")} />

            <div className="grid gap-3">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending
                ? "Resetting..."
                : "Reset Password"}
            </Button>

            <div className="text-muted-foreground text-center text-sm">
              Remembered your password?{" "}
              <Link
                href="/auth/sign-in"
                className="underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
