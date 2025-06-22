import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    const users = await prisma.user.findMany({
      where: { role: "USER" },
      include: {
        _count: {
          select: {
            chatSessions: true,
          },
        },
        chatSessions: {
          include: {
            _count: {
              select: { messages: true },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
    });

    const userStats = users.map((user) => ({
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email,
      sessionCount: user._count.chatSessions,
      lastActivity: user.chatSessions[0]?.updatedAt?.toISOString() || null,
      totalMessages: user.chatSessions.reduce(
        (sum, session) => sum + session._count.messages,
        0,
      ),
    }));

    return NextResponse.json({ users: userStats });
  } catch (error) {
    console.error("Error fetching user chat stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
