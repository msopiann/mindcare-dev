import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

interface KeywordData {
  keyword: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

// Common stop words to filter out
const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "my",
  "your",
  "his",
  "her",
  "its",
  "our",
  "their",
  "mine",
  "yours",
  "hers",
  "ours",
  "theirs",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "can",
  "shall",
  "this",
  "that",
  "these",
  "those",
  "here",
  "there",
  "where",
  "when",
  "why",
  "how",
  "what",
  "who",
  "yes",
  "no",
  "not",
  "so",
  "very",
  "just",
  "now",
  "then",
  "well",
  "also",
  "too",
  "much",
  "many",
]);

// Mental health related keywords to prioritize
const MENTAL_HEALTH_KEYWORDS = new Set([
  "anxiety",
  "depression",
  "stress",
  "worry",
  "fear",
  "panic",
  "sad",
  "happy",
  "angry",
  "frustrated",
  "overwhelmed",
  "tired",
  "exhausted",
  "lonely",
  "isolated",
  "hopeless",
  "hopeful",
  "confident",
  "therapy",
  "counseling",
  "medication",
  "treatment",
  "healing",
  "recovery",
  "support",
  "help",
  "family",
  "relationship",
  "work",
  "school",
  "sleep",
  "eating",
  "exercise",
  "mindfulness",
  "meditation",
  "breathing",
  "relaxation",
  "coping",
  "strategies",
  "techniques",
]);

function extractKeywords(text: string): string[] {
  // Convert to lowercase and remove punctuation
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, " ");

  // Split into words and filter
  const words = cleanText.split(/\s+/).filter(
    (word) =>
      word.length > 2 && // At least 3 characters
      !STOP_WORDS.has(word) && // Not a stop word
      !/^\d+$/.test(word), // Not just numbers
  );

  return words;
}

function calculateTrend(
  currentCount: number,
  previousCount: number,
): "up" | "down" | "stable" {
  if (previousCount === 0) return "stable";
  const change = (currentCount - previousCount) / previousCount;
  if (change > 0.1) return "up";
  if (change < -0.1) return "down";
  return "stable";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = Number.parseInt(searchParams.get("days") || "30");
    const limit = Number.parseInt(searchParams.get("limit") || "50");

    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get previous period for trend calculation
    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - days * 2);
    const previousEndDate = startDate;

    // Fetch messages from current period
    const currentMessages = await prisma.message.findMany({
      where: {
        isFromUser: true, // Only analyze user messages
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        content: true,
        createdAt: true,
      },
    });

    // Fetch messages from previous period for trend analysis
    const previousMessages = await prisma.message.findMany({
      where: {
        isFromUser: true,
        createdAt: {
          gte: previousStartDate,
          lte: previousEndDate,
        },
      },
      select: {
        content: true,
      },
    });

    // Extract keywords from current period
    const currentKeywordCounts = new Map<string, number>();
    let totalCurrentWords = 0;

    currentMessages.forEach((message) => {
      const keywords = extractKeywords(message.content);
      totalCurrentWords += keywords.length;
      keywords.forEach((keyword) => {
        currentKeywordCounts.set(
          keyword,
          (currentKeywordCounts.get(keyword) || 0) + 1,
        );
      });
    });

    // Extract keywords from previous period
    const previousKeywordCounts = new Map<string, number>();
    previousMessages.forEach((message) => {
      const keywords = extractKeywords(message.content);
      keywords.forEach((keyword) => {
        previousKeywordCounts.set(
          keyword,
          (previousKeywordCounts.get(keyword) || 0) + 1,
        );
      });
    });

    // Convert to array and calculate percentages and trends
    const keywordData: KeywordData[] = Array.from(
      currentKeywordCounts.entries(),
    )
      .map(([keyword, count]) => {
        const percentage =
          totalCurrentWords > 0 ? (count / totalCurrentWords) * 100 : 0;
        const previousCount = previousKeywordCounts.get(keyword) || 0;
        const trend = calculateTrend(count, previousCount);

        return {
          keyword,
          count,
          percentage: Math.round(percentage * 100) / 100,
          trend,
        };
      })
      .sort((a, b) => {
        // Prioritize mental health keywords
        const aIsMentalHealth = MENTAL_HEALTH_KEYWORDS.has(a.keyword);
        const bIsMentalHealth = MENTAL_HEALTH_KEYWORDS.has(b.keyword);

        if (aIsMentalHealth && !bIsMentalHealth) return -1;
        if (!aIsMentalHealth && bIsMentalHealth) return 1;

        // Then sort by count
        return b.count - a.count;
      })
      .slice(0, limit);

    // Calculate summary statistics
    const totalMessages = currentMessages.length;
    const uniqueKeywords = currentKeywordCounts.size;
    const avgKeywordsPerMessage =
      totalMessages > 0 ? totalCurrentWords / totalMessages : 0;

    return NextResponse.json({
      keywords: keywordData,
      summary: {
        totalMessages,
        uniqueKeywords,
        avgKeywordsPerMessage: Math.round(avgKeywordsPerMessage * 100) / 100,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching popular keywords:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
