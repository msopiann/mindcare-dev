"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    isAdmin: session?.user?.role === UserRole.ADMIN,
  };
}
