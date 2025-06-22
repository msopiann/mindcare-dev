"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Message as ChatMessage } from "@/components/chat/message-list";
import Sidebar from "@/components/chat/sidebar";
import ChatWindow from "@/components/chat/chat-window";
import Header from "@/components/chat/header";
import {
  useChatSessions,
  useCreateChatSession,
  useChatMessages,
  useSendMessage,
  useDeleteChatSession,
} from "@/hooks/use-chat-api";
import { toast } from "sonner";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const { data: sessionsData, isLoading: sessionsLoading } = useChatSessions();
  const sessions = sessionsData?.sessions || [];

  const { data: messages = [], isLoading: messagesLoading } =
    useChatMessages(selectedSessionId);
  const createSession = useCreateChatSession();
  const sendMessage = useSendMessage();
  const deleteSession = useDeleteChatSession();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
    }
  }, [status, router]);

  // Auto-select first session
  useEffect(() => {
    if (!sessionsLoading && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, sessionsLoading, selectedSessionId]);

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
      toast.success("New chat created!");
    } catch (error) {
      toast.error("Failed to create new chat");
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this chat? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteSession.mutateAsync(sessionId);

      // If deleted session was selected, select another one
      if (selectedSessionId === sessionId) {
        const remainingSessions = sessions.filter((s) => s.id !== sessionId);
        setSelectedSessionId(
          remainingSessions.length > 0 ? remainingSessions[0].id : null,
        );
      }

      toast.success("Chat deleted successfully");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const currentSession = sessions.find((s) => s.id === selectedSessionId);

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
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSelectSession={setSelectedSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onSettings={() => router.push("/dashboard/settings")}
        user={session?.user}
        isLoading={sessionsLoading}
      />
      <div className="flex flex-1 flex-col">
        <Header
          user={session?.user}
          currentSessionTitle={currentSession?.title}
          onSettings={() => router.push("/dashboard/settings")}
        />
        <ChatWindow
          messages={chatMessages}
          onSendMessage={handleSend}
          isLoading={messagesLoading || sendMessage.isPending}
        />
      </div>
    </div>
  );
}
