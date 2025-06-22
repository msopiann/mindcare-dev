import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
          Mindcare
        </Link>
        <Suspense fallback={<div>Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
