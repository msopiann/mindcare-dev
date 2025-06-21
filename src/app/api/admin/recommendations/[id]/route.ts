import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole, createAuthResponse } from "@/lib/auth/server-utils";
import { updateRecommendationSchema } from "@/lib/validations/banners";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAdminRole();
    const body = await request.json();
    const validatedData = updateRecommendationSchema.parse(body);

    // Check if recommendation exists
    const existingRecommendation = await prisma.recommendationCard.findUnique({
      where: { id: params.id },
    });

    if (!existingRecommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 },
      );
    }

    const recommendation = await prisma.recommendationCard.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error("Admin update recommendation error:", error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAdminRole();

    // Check if recommendation exists
    const existingRecommendation = await prisma.recommendationCard.findUnique({
      where: { id: params.id },
    });

    if (!existingRecommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 },
      );
    }

    await prisma.recommendationCard.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Recommendation deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete recommendation error:", error);

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
