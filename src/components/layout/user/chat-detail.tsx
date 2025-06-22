"use client";

import { cn } from "@/lib/utils";
import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat, Message } from "./chat-interface";
import { useEffect, useRef } from "react";

interface ChatDetailProps {
  chat: Chat;
  messages: Message[];
  isLoading?: boolean;
}

export function ChatDetail({
  chat,
  messages,
  isLoading = false,
}: ChatDetailProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-medium">{chat.topic}</h3>
            <p className="text-muted-foreground text-sm">
              {chat.messageCount} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative min-h-0 flex-1">
        <ScrollArea ref={scrollAreaRef} className="h-full w-full">
          <div className="p-4">
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                  <p className="text-sm text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.isOwn ? "justify-end" : "justify-start",
                    )}
                  >
                    {!message.isOwn && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={message.avatar}
                          alt={message.senderName}
                        />
                        <AvatarFallback>
                          {message.senderName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2 break-words",
                        message.isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-xs",
                          message.isOwn
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {message.timestamp}
                      </p>
                    </div>

                    {message.isOwn && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={message.avatar}
                          alt={message.senderName}
                        />
                        <AvatarFallback>
                          {message.senderName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {messages.length === 0 && !isLoading && (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-center text-sm text-gray-500">
                      No messages in this conversation yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
