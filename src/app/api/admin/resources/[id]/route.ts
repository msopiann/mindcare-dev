import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole, createAuthResponse } from "@/lib/auth/server-utils";
import { updateResourceSchema } from "@/lib/validations/resources";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAdminRole();
    const body = await request.json();
    const validatedData = updateResourceSchema.parse(body);

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: params.id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ resource });
  } catch (error) {
    console.error("Admin update resource error:", error);

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

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: params.id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    await prisma.resource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete resource error:", error);

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
