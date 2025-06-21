import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { sendMessageSchema } from "@/lib/validations/chat";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatSession = await prisma.chatSession.findFirst({
      where: {
        id: params.sessionId,
        userId: session.user.id,
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { sessionId: params.sessionId },
      orderBy: { createdAt: "asc" },
    });

    const formattedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      isFromUser: message.isFromUser,
      timestamp: message.createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: message.createdAt.toISOString(),
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = sendMessageSchema.parse(body);

    const chatSession = await prisma.chatSession.findFirst({
      where: {
        id: params.sessionId,
        userId: session.user.id,
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Create user message
    const userMessage = await prisma.message.create({
      data: {
        sessionId: params.sessionId,
        content: validatedData.content,
        isFromUser: true,
      },
    });

    // Generate bot response (mock for now)
    const botResponse = await generateBotResponse(validatedData.content);

    const botMessage = await prisma.message.create({
      data: {
        sessionId: params.sessionId,
        content: botResponse,
        isFromUser: false,
      },
    });

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: params.sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      message: {
        id: userMessage.id,
        content: userMessage.content,
        isFromUser: true,
        timestamp: userMessage.createdAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: userMessage.createdAt.toISOString(),
      },
      botResponse: {
        id: botMessage.id,
        content: botMessage.content,
        isFromUser: false,
        timestamp: botMessage.createdAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: botMessage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function generateBotResponse(userMessage: string): Promise<string> {
  // Mock bot response - replace with actual AI integration
  const responses = [
    "Terima kasih sudah berbagi. Bagaimana perasaanmu sekarang?",
    "Aku mengerti. Apakah ada hal lain yang ingin kamu ceritakan?",
    "Itu terdengar sulit. Aku di sini untuk mendengarkan.",
    "Mari kita coba teknik pernapasan untuk membantu menenangkan diri.",
    "Kamu tidak sendirian dalam menghadapi ini. Bagaimana kalau kita cari solusi bersama?",
  ];

  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("stres") || lowerMessage.includes("cemas")) {
    return "Aku mengerti kamu sedang merasa stres. Mari kita coba teknik relaksasi sederhana. Tarik napas dalam-dalam selama 4 detik, tahan 4 detik, lalu buang perlahan selama 6 detik. Ulangi 3 kali.";
  }

  if (lowerMessage.includes("sedih") || lowerMessage.includes("depresi")) {
    return "Terima kasih sudah mempercayai aku dengan perasaanmu. Perasaan sedih itu wajar dan valid. Apakah ada aktivitas kecil yang biasanya membuatmu merasa sedikit lebih baik?";
  }

  if (lowerMessage.includes("lelah") || lowerMessage.includes("capek")) {
    return "Kelelahan bisa sangat menguras. Sudahkah kamu istirahat yang cukup hari ini? Kadang tubuh dan pikiran kita butuh waktu untuk recharge.";
  }

  return responses[Math.floor(Math.random() * responses.length)];
}
