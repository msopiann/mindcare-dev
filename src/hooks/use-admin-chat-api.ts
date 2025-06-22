import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UserChatStats {
  id: string;
  name: string;
  email: string;
  sessionCount: number;
  lastActivity: string | null;
  totalMessages: number;
}

interface AdminChatSession {
  id: string;
  topic: string;
  lastMessage: string;
  messageCount: number;
  startedAt: string;
  updatedAt: string;
}

interface AdminMessage {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
  avatar?: string;
  senderName?: string;
  createdAt: string;
}

interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KeywordData {
  keyword: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

interface PopularKeywordsResponse {
  keywords: KeywordData[];
  summary: {
    totalMessages: number;
    uniqueKeywords: number;
    avgKeywordsPerMessage: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

// User Stats
export function useAdminChatUsers() {
  return useQuery({
    queryKey: ["admin-chat-users"],
    queryFn: async (): Promise<UserChatStats[]> => {
      const response = await fetch("/api/admin/chat/users");
      if (!response.ok) throw new Error("Failed to fetch user stats");
      const data = await response.json();
      return data.users;
    },
  });
}

// User Sessions
export function useAdminUserSessions(userId: string | null) {
  return useQuery({
    queryKey: ["admin-user-sessions", userId],
    queryFn: async (): Promise<AdminChatSession[]> => {
      if (!userId) return [];
      const response = await fetch(`/api/admin/chat/users/${userId}/sessions`);
      if (!response.ok) throw new Error("Failed to fetch user sessions");
      const data = await response.json();
      return data.sessions;
    },
    enabled: !!userId,
  });
}

// Session Messages
export function useAdminSessionMessages(
  userId: string | null,
  sessionId: string | null,
) {
  return useQuery({
    queryKey: ["admin-session-messages", userId, sessionId],
    queryFn: async (): Promise<AdminMessage[]> => {
      if (!userId || !sessionId) return [];
      const response = await fetch(
        `/api/admin/chat/users/${userId}/sessions/${sessionId}/messages`,
      );
      if (!response.ok) throw new Error("Failed to fetch session messages");
      const data = await response.json();
      return data.messages;
    },
    enabled: !!(userId && sessionId),
  });
}

// Popular Keywords
export function usePopularKeywords(days = 30, limit = 50) {
  return useQuery<PopularKeywordsResponse>({
    queryKey: ["popular-keywords", days, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/chat/popular-keywords?days=${days}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch popular keywords");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// System Prompts
export function useSystemPrompts() {
  return useQuery({
    queryKey: ["system-prompts"],
    queryFn: async (): Promise<SystemPrompt[]> => {
      const response = await fetch("/api/admin/chat/system-prompts");
      if (!response.ok) throw new Error("Failed to fetch system prompts");
      const data = await response.json();
      return data.prompts;
    },
  });
}

export function useCreateSystemPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      content: string;
    }): Promise<SystemPrompt> => {
      const response = await fetch("/api/admin/chat/system-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to create system prompt");
      const data = await response.json();
      return data.prompt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-prompts"] });
      toast.success("System prompt created");
    },
    onError: () => {
      toast.error("Failed to create system prompt");
    },
  });
}

export function useUpdateSystemPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: {
      id: string;
      name?: string;
      content?: string;
    }): Promise<SystemPrompt> => {
      const response = await fetch(`/api/admin/chat/system-prompts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to update system prompt");
      const data = await response.json();
      return data.prompt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-prompts"] });
      toast.success("System prompt updated");
    },
    onError: () => {
      toast.error("Failed to update system prompt");
    },
  });
}

export function useDeleteSystemPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/chat/system-prompts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete system prompt");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-prompts"] });
      toast.success("System prompt deleted");
    },
    onError: () => {
      toast.error("Failed to delete system prompt");
    },
  });
}
