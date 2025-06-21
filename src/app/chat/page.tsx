"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Message as ChatMessage } from "@/components/chat/message-list";
import Sidebar, { type ChatItem } from "@/components/chat/sidebar";
import ChatWindow from "@/components/chat/chat-window";
import Header from "@/components/chat/header";
import {
  useChatSessions,
  useCreateChatSession,
  useChatMessages,
  useSendMessage,
} from "@/hooks/use-chat-api";
import { toast } from "sonner";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const { data: sessions = [], isLoading: sessionsLoading } = useChatSessions();
  const { data: messages = [], isLoading: messagesLoading } =
    useChatMessages(selectedSessionId);
  const createSession = useCreateChatSession();
  const sendMessage = useSendMessage();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
    }
  }, [status, router]);

  // Auto-select first session or create new one
  useEffect(() => {
    if (!sessionsLoading && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, sessionsLoading, selectedSessionId]);

  const chats: ChatItem[] = [
    {
      id: "mindcare",
      name: "Mindcare",
      avatarUrl: "/assets/image/chat/avatar-bot.png",
    },
  ];

  const chatMessages: ChatMessage[] = messages.map((msg) => ({
    id: msg.id,
    text: msg.content,
    sender: msg.isFromUser ? "user" : "bot",
    timestamp: msg.timestamp,
  }));

  const handleSend = async (text: string) => {
    if (!selectedSessionId) {
      // Create new session if none exists
      try {
        const newSession = await createSession.mutateAsync({});
        setSelectedSessionId(newSession.id);
        // Send message to new session
        await sendMessage.mutateAsync({
          sessionId: newSession.id,
          content: text,
        });
      } catch (error) {
        toast.error("Failed to start chat session");
      }
    } else {
      // Send to existing session
      try {
        await sendMessage.mutateAsync({
          sessionId: selectedSessionId,
          content: text,
        });
      } catch (error) {
        toast.error("Failed to send message");
      }
    }
  };

  const handleNewChat = async () => {
    try {
      const newSession = await createSession.mutateAsync({});
      setSelectedSessionId(newSession.id);
    } catch (error) {
      toast.error("Failed to create new chat");
    }
  };

  if (status === "loading" || sessionsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        selectedChatId="mindcare"
        onSelectChat={() => {}}
        onNewChat={handleNewChat}
        onSettings={() => router.push("/dashboard/settings")}
      />
      <div className="flex flex-1 flex-col">
        <Header />
        <ChatWindow
          messages={chatMessages}
          onSendMessage={handleSend}
          isLoading={messagesLoading || sendMessage.isPending}
        />
      </div>
    </div>
  );
}
