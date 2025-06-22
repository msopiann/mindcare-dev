import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// POST - Activate a prompt (deactivates all others)
export async function POST(
  request: NextRequest,
  { params }: { params: { promptId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use transaction to ensure only one prompt is active
    await prisma.$transaction(async (tx) => {
      // Deactivate all prompts
      await tx.systemPrompt.updateMany({
        data: { active: false },
      });

      // Activate the selected prompt
      await tx.systemPrompt.update({
        where: { id: params.promptId },
        data: { active: true },
      });
    });

    const activePrompt = await prisma.systemPrompt.findUnique({
      where: { id: params.promptId },
    });

    return NextResponse.json({
      message: "Prompt activated successfully",
      activePrompt,
    });
  } catch (error) {
    console.error("Error activating prompt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
