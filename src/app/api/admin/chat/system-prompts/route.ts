import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { systemPromptSchema } from "@/lib/validations/chat";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompts = await prisma.systemPrompt.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("Error fetching system prompts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = systemPromptSchema.parse(body);

    const prompt = await prisma.systemPrompt.create({
      data: validatedData,
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Error creating system prompt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
