import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "@/lib/prisma";

const systemPrompt = `You are a mental health assistant designed to provide support and guidance. 
Your responses should be empathetic, informative, and helpful. 
Avoid giving medical advice; instead, offer general wellness tips and suggest seeking professional help when necessary.`;

export async function generateChatResponse(
  sessionId: string,
  userMessage: string,
) {
  try {
    const activePrompt = await prisma.systemPrompt.findFirst({
      where: { active: true },
    });

    const systemPromptContent = activePrompt?.content || systemPrompt;

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: userMessage,
      system: systemPromptContent,
    });

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
}
