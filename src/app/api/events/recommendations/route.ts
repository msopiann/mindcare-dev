import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const recommendations = await prisma.recommendationCard.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
