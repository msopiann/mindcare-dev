import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventQuerySchema } from "@/lib/validations/events";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      highlighted: searchParams.get("highlighted") || undefined,
      ticketAvailability: searchParams.get("ticketAvailability") || undefined,
      limit: searchParams.get("limit") || "20",
      offset: searchParams.get("offset") || "0",
    };

    const validatedQuery = eventQuerySchema.parse(queryParams);

    const whereClause: any = {};

    if (validatedQuery.highlighted !== undefined) {
      whereClause.highlighted = validatedQuery.highlighted;
    }

    if (validatedQuery.ticketAvailability !== undefined) {
      whereClause.ticketAvailability = validatedQuery.ticketAvailability;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ highlighted: "desc" }, { startDate: "asc" }],
        take: validatedQuery.limit,
        skip: validatedQuery.offset,
      }),
      prisma.event.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      events: events.map((event) => ({
        ...event,
        isFree: event.price === null || event.price === 0,
      })),
      total,
    });
  } catch (error) {
    console.error("Get events error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
