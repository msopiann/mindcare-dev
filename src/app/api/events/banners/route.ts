import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.eventBanner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Get event banners error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
