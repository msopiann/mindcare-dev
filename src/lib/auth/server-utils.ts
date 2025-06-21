import { getServerSession } from "next-auth";
import { authOptions } from "./config";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

export async function requireRole(requiredRole: UserRole) {
  const user = await requireAuth();

  if (user.role !== requiredRole) {
    throw new Error("Insufficient permissions");
  }

  return user;
}

export async function requireAdminRole() {
  return requireRole("ADMIN");
}

export function createAuthResponse(error: string, status = 401) {
  return Response.json({ error }, { status });
}
