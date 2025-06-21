import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegisterForm } from "@/components/auth/register-form";

export default function SignUpPage() {
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
        <RegisterForm />
        <div className="fixed right-5 bottom-5">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
