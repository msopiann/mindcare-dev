import { type NextRequest, NextResponse } from "next/server";
import { updateProfileSchema } from "@/lib/validations/user";
import { prisma } from "@/lib/prisma";
import { requireAuth, createAuthResponse } from "@/lib/auth/server-utils";

export async function GET() {
  try {
    const user = await requireAuth();

    // Get user with OAuth accounts
    const userWithAccounts = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            provider: true,
            type: true,
          },
        },
      },
    });

    if (!userWithAccounts) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Split name into firstName and lastName for the frontend
    const nameParts = userWithAccounts.name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Check OAuth status
    const oauthAccounts = userWithAccounts.accounts.filter(
      (account) => account.type === "oauth",
    );
    const hasPassword = !!userWithAccounts.password;
    const isOAuthOnly = oauthAccounts.length > 0 && !hasPassword;

    return NextResponse.json({
      id: userWithAccounts.id,
      firstName,
      lastName,
      name: userWithAccounts.name,
      email: userWithAccounts.email,
      avatar: userWithAccounts.image,
      role: userWithAccounts.role,
      emailVerified: userWithAccounts.emailVerified,
      createdAt: userWithAccounts.createdAt,
      updatedAt: userWithAccounts.updatedAt,
      hasPassword,
      isOAuthOnly,
      oauthProviders: oauthAccounts.map((account) => account.provider),
    });
  } catch (error) {
    console.error("Get profile error:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return createAuthResponse("Authentication required");
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if email is being changed and if it's already taken
    if (validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 },
        );
      }
    }

    // Combine firstName and lastName into name
    const fullName =
      `${validatedData.firstName} ${validatedData.lastName}`.trim();

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: fullName,
        email: validatedData.email,
        // If email changed, mark as unverified (except for admin users)
        ...(validatedData.email !== user.email &&
          user.role !== "ADMIN" && {
            emailVerified: null,
          }),
      },
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

    // Split name back for response
    const nameParts = updatedUser.name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        firstName,
        lastName,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.image,
        role: updatedUser.role,
        emailVerified: updatedUser.emailVerified,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

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
