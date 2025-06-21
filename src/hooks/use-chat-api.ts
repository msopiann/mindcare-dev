import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChatSession {
  id: string;
  topic: string;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: string;
  createdAt: string;
}

interface CreateSessionInput {
  topic?: string;
}

interface SendMessageInput {
  content: string;
}

// Chat Sessions
export function useChatSessions() {
  return useQuery({
    queryKey: ["chat-sessions"],
    queryFn: async (): Promise<ChatSession[]> => {
      const response = await fetch("/api/chat/sessions");
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const data = await response.json();
      return data.sessions;
    },
  });
}

export function useCreateChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSessionInput): Promise<ChatSession> => {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to create session");
      const data = await response.json();
      return data.session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
      toast.success("New chat session created");
    },
    onError: () => {
      toast.error("Failed to create chat session");
    },
  });
}

export function useDeleteChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete session");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
      toast.success("Chat session deleted");
    },
    onError: () => {
      toast.error("Failed to delete chat session");
    },
  });
}

// Messages
export function useChatMessages(sessionId: string | null) {
  return useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: async (): Promise<Message[]> => {
      if (!sessionId) return [];
      const response = await fetch(`/api/chat/sessions/${sessionId}/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      return data.messages;
    },
    enabled: !!sessionId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      content,
    }: {
      sessionId: string;
      content: string;
    }) => {
      const response = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });
}
