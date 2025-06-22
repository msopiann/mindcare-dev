import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string | null;
  lastMessageTime: string | null;
}

interface ChatMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: string;
  createdAt: string;
}

// Fetch all chat sessions
export function useChatSessions() {
  return useQuery<{ sessions: ChatSession[] }>({
    queryKey: ["chat-sessions"],
    queryFn: async () => {
      const response = await fetch("/api/chat/sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch chat sessions");
      }
      return response.json();
    },
  });
}

// Create new chat session
export function useCreateChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title?: string }) => {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat session");
      }

      const result = await response.json();
      return result.session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

// Delete chat session
export function useDeleteChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat session");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

// Fetch messages for a specific session
export function useChatMessages(sessionId: string | null) {
  return useQuery<ChatMessage[]>({
    queryKey: ["chat-messages", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];

      const response = await fetch(`/api/chat/sessions/${sessionId}/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      return data.messages || [];
    },
    enabled: !!sessionId,
  });
}

// Send message
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sessionId: string; content: string }) => {
      const response = await fetch(
        `/api/chat/sessions/${data.sessionId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: data.content }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", variables.sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}
