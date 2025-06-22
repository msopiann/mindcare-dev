"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useChatSessions, useChatMessages } from "@/hooks/use-chat-api";
import { ChatList } from "./chat-list";
import { ChatDetail } from "./chat-detail";

export interface Chat {
  id: string;
  topic: string;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  avatar?: string;
  senderName?: string;
}

export function ChatInterface() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const { data: sessionsData, isLoading: sessionsLoading } = useChatSessions();
  const sessions = useMemo(() => sessionsData?.sessions || [], [sessionsData]);

  const { data: messages = [], isLoading: messagesLoading } =
    useChatMessages(selectedChatId);

  // Auto-select first session once loaded
  useEffect(() => {
    if (!sessionsLoading && sessions.length > 0 && !selectedChatId) {
      setSelectedChatId(sessions[0].id);
    }
  }, [sessionsLoading, sessions, selectedChatId]);

  const chats: Chat[] = sessions.map((session) => ({
    id: session.id,
    topic: session.title,
    lastMessage: session.lastMessage || "",
    messageCount: session.messageCount,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }));

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const formattedMessages: Message[] = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    timestamp: msg.timestamp,
    isOwn: msg.isFromUser,
    avatar: msg.isFromUser
      ? "/assets/image/chat/avatar-user.png"
      : "/assets/image/chat/avatar-bot.png",
    senderName: msg.isFromUser ? "You" : "Chatbot",
  }));

  if (sessionsLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p>Loading chat sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <Card className="flex w-80 flex-col">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </Card>

      <Card className="flex flex-1 flex-col">
        {selectedChat ? (
          <ChatDetail
            chat={selectedChat}
            messages={formattedMessages}
            isLoading={messagesLoading}
          />
        ) : (
          <div className="text-muted-foreground flex flex-1 items-center justify-center">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-medium">No chat selected</h3>
              <p>
                Choose a conversation from the list or start new chat{" "}
                <Link href="/chat" className="text-blue-500 underline">
                  here
                </Link>
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
