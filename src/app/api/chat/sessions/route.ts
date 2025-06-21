import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { createSessionSchema } from "@/lib/validations/chat";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      topic:
        session.topic ||
        `Chat ${new Date(session.createdAt).toLocaleDateString()}`,
      lastMessage: session.messages[0]?.content || "No messages yet",
      messageCount: session._count.messages,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    const chatSession = await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        topic: validatedData.topic,
      },
    });

    return NextResponse.json({
      session: {
        id: chatSession.id,
        topic:
          chatSession.topic ||
          `Chat ${new Date(chatSession.createdAt).toLocaleDateString()}`,
        lastMessage: "No messages yet",
        messageCount: 0,
        createdAt: chatSession.createdAt.toISOString(),
        updatedAt: chatSession.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
