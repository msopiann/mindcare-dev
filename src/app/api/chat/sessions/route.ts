import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSessionSchema = z.object({
  title: z.string().optional(),
});

// GET - Fetch all chat sessions for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatSessions = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get the last message for preview
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedSessions = chatSessions.map((chatSession) => ({
      id: chatSession.id,
      title: `Chat ${chatSession.id.slice(-6)}`,
      createdAt: chatSession.createdAt.toISOString(),
      updatedAt: chatSession.updatedAt.toISOString(),
      messageCount: chatSession._count.messages,
      lastMessage: chatSession.messages[0]?.content || null,
      lastMessageTime: chatSession.messages[0]?.createdAt.toISOString() || null,
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// POST - Create a new chat session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      console.log("No body or invalid JSON, using empty object");
    }

    const validatedData = createSessionSchema.parse(body);

    const sessionCount = await prisma.chatSession.count({
      where: { userId: session.user.id },
    });

    const title = validatedData.title || `Chat ${sessionCount + 1}`;

    // Check if title field exists in schema
    const chatSession = await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        // Only include title if it exists in your schema
        ...(validatedData.title && { title }),
      },
    });

    return NextResponse.json({
      session: {
        id: chatSession.id,
        title: title,
        createdAt: chatSession.createdAt.toISOString(),
        updatedAt: chatSession.updatedAt.toISOString(),
        messageCount: 0,
        lastMessage: null,
        lastMessageTime: null,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/chat/sessions:", error);

    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
