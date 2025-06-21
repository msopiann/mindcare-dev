import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole, createAuthResponse } from "@/lib/auth/server-utils";
import { updateResourceBannerSchema } from "@/lib/validations/banners";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAdminRole();
    const body = await request.json();
    const validatedData = updateResourceBannerSchema.parse(body);

    // Check if banner exists
    const existingBanner = await prisma.resourceBanner.findUnique({
      where: { id: params.id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    const banner = await prisma.resourceBanner.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Admin update resource banner error:", error);

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

    // Check if banner exists
    const existingBanner = await prisma.resourceBanner.findUnique({
      where: { id: params.id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    await prisma.resourceBanner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete resource banner error:", error);

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
