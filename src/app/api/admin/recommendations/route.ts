import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole, createAuthResponse } from "@/lib/auth/server-utils";
import { createRecommendationSchema } from "@/lib/validations/banners";

export async function GET() {
  try {
    const user = await requireAdminRole();

    const recommendations = await prisma.recommendationCard.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Admin get recommendations error:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return createAuthResponse("Authentication required");
    }

    if (
      error instanceof Error &&
      error.message === "Insufficient permissions"
    ) {
      return createAuthResponse("Admin access required", 403);
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdminRole();
    const body = await request.json();
    const validatedData = createRecommendationSchema.parse(body);

    const recommendation = await prisma.recommendationCard.create({
      data: validatedData,
    });

    return NextResponse.json({ recommendation }, { status: 201 });
  } catch (error) {
    console.error("Admin create recommendation error:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return createAuthResponse("Authentication required");
    }

    if (
      error instanceof Error &&
      error.message === "Insufficient permissions"
    ) {
      return createAuthResponse("Admin access required", 403);
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
