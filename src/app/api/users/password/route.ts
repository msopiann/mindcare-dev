import { type NextRequest, NextResponse } from "next/server";
import { updatePasswordSchema } from "@/lib/validations/user";
import { prisma } from "@/lib/prisma";
import { requireAuth, createAuthResponse } from "@/lib/auth/server-utils";
import { verifyPassword, hashPassword } from "@/lib/auth/utils";

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = updatePasswordSchema.parse(body);

    // Get user with password and accounts
    const userWithDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        password: true,
        accounts: {
          select: {
            provider: true,
            type: true,
          },
        },
      },
    });

    if (!userWithDetails) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has OAuth accounts
    const hasOAuthAccount = userWithDetails.accounts.some(
      (account) => account.type === "oauth",
    );

    // If user has OAuth account but no password, they're OAuth-only
    if (hasOAuthAccount && !userWithDetails.password) {
      const oauthProviders = userWithDetails.accounts
        .filter((account) => account.type === "oauth")
        .map((account) => account.provider)
        .join(", ");

      return NextResponse.json(
        {
          error: "Password change not available for OAuth accounts",
          details: `Your account is linked with ${oauthProviders}. Please change your password through your ${oauthProviders} account settings.`,
          isOAuthUser: true,
          providers: oauthProviders,
        },
        { status: 400 },
      );
    }

    // If user doesn't have a password (shouldn't happen, but safety check)
    if (!userWithDetails.password) {
      return NextResponse.json(
        {
          error: "No password set for this account",
          details:
            "This account doesn't have a password. Please contact support if you believe this is an error.",
        },
        { status: 400 },
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      userWithDetails.password,
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // Check if new password is different from current
    const isSamePassword = await verifyPassword(
      validatedData.newPassword,
      userWithDetails.password,
    );

    if (isSamePassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(validatedData.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return createAuthResponse("Authentication required");
    }

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
