import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { updateSystemPromptSchema } from "@/lib/validations/chat";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateSystemPromptSchema.parse(body);

    const prompt = await prisma.systemPrompt.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Error updating system prompt:", error);
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.systemPrompt.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "System prompt deleted successfully" });
  } catch (error) {
    console.error("Error deleting system prompt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
