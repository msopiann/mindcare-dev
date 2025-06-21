import { z } from "zod";

export const createSessionSchema = z.object({
  topic: z.string().optional(),
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content is required")
    .max(1000, "Message too long"),
});

export const systemPromptSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
});

export const updateSystemPromptSchema = systemPromptSchema.partial();

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SystemPromptInput = z.infer<typeof systemPromptSchema>;
export type UpdateSystemPromptInput = z.infer<typeof updateSystemPromptSchema>;
