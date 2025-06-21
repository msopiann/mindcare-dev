import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resourceQuerySchema } from "@/lib/validations/resources";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Safely get query parameters with defaults
    const queryParams = {
      type: searchParams.get("type") || undefined,
      highlighted: searchParams.get("highlighted") || undefined,
      limit: searchParams.get("limit") || "20",
      offset: searchParams.get("offset") || "0",
    };

    const query = resourceQuerySchema.parse(queryParams);

    const where = {
      ...(query.type && { type: query.type }),
      ...(query.highlighted !== undefined && {
        highlighted: query.highlighted,
      }),
    };

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ highlighted: "desc" }, { createdAt: "desc" }],
        take: query.limit,
        skip: query.offset,
      }),
      prisma.resource.count({ where }),
    ]);

    return NextResponse.json({
      resources,
      total,
    });
  } catch (error) {
    console.error("Get resources error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
