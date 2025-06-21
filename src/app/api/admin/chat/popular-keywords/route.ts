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

    // Get all user messages
    const messages = await prisma.message.findMany({
      where: { isFromUser: true },
      select: { content: true },
    });

    // Extract keywords and count frequency
    const keywordCounts = new Map<string, number>();
    const totalMessages = messages.length;

    const keywords = [
      "kecemasan",
      "depresi",
      "stres",
      "terapi",
      "perawatan diri",
      "kesadaran penuh",
      "strategi koping",
      "kelelahan",
      "kesepian",
      "motivasi",
      "gangguan tidur",
      "kelompok dukungan",
      "hotline krisis",
      "dukungan emosional",
      "konseling",
      "psikolog",
      "meditasi",
      "trauma",
      "burnout",
      "mindfulness",
      "overthinking",
      "gangguan panik",
      "self-esteem",
      "bipolar",
      "psikosomatis",
      "inner child",
      "toxic relationship",
      "self-harm",
      "support system",
      "healing",
      "distorsi kognitif",
      "terapi perilaku",
      "kesehatan jiwa",
      "emosi tidak stabil",
      "penerimaan diri",
      "regulasi emosi",
      "mental breakdown",
      "self-awareness",
      "gaslighting",
      "trauma healing",
      "anhedonia",
      "toxic positivity",
      "journaling",
      "self-compassion",
      "inner peace",
      "emosional burnout",
      "self-regulation",
      "coping mechanism",
      "intervensi psikologis",
      "konflik batin",
      "dukungan sosial",
      "krisis identitas",
      "terapi kelompok",
      "psikiater",
      "disosiasi",
      "emotional validation",
    ];

    // Count keyword occurrences
    messages.forEach((message) => {
      const content = message.content.toLowerCase();
      keywords.forEach((keyword) => {
        if (content.includes(keyword.toLowerCase())) {
          keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
        }
      });
    });

    // Convert to percentage and sort
    const keywordStats = Array.from(keywordCounts.entries())
      .map(([keyword, count]) => ({
        label: keyword,
        percentage:
          totalMessages > 0 ? Math.round((count / totalMessages) * 100) : 0,
        count,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 50); // Top 50 keywords

    return NextResponse.json({ keywords: keywordStats });
  } catch (error) {
    console.error("Error fetching popular keywords:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
