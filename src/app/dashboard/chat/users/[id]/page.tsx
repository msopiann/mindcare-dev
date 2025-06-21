"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useAdminUserSessions,
  useAdminSessionMessages,
} from "@/hooks/use-admin-chat-api";

export default function AdminChatUsersDetailPage() {
  const params = useParams();
  const userId = params?.id as string;
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");

  const { data: sessions = [], isLoading: sessionsLoading } =
    useAdminUserSessions(userId);
  const { data: messages = [], isLoading: messagesLoading } =
    useAdminSessionMessages(userId, selectedSessionId);

  // Auto-select first session
  React.useEffect(() => {
    if (!sessionsLoading && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, sessionsLoading, selectedSessionId]);

  if (sessionsLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p>Loading user sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 p-6">
      {/* Sidebar: Chat Sessions */}
      <Card className="flex w-80 flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <Link
            href="/admin/dashboard/chat/users"
            className="text-sm text-blue-500 underline"
          >
            ← Back to Users
          </Link>
          <h3 className="text-lg font-semibold">Sessions</h3>
        </div>
        <ScrollArea className="flex-1 p-2">
          {sessions.map((session, idx) => (
            <React.Fragment key={session.id}>
              <div
                onClick={() => setSelectedSessionId(session.id)}
                className={`cursor-pointer rounded-lg p-3 transition-colors ${
                  selectedSessionId === session.id
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{session.topic}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(session.startedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 truncate text-sm">
                  {session.lastMessage}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {session.messageCount} messages
                </p>
              </div>
              {idx < sessions.length - 1 && <Separator className="my-1" />}
            </React.Fragment>
          ))}
          {sessions.length === 0 && (
            <p className="p-4 text-center text-sm text-gray-500">
              No sessions found for this user.
            </p>
          )}
        </ScrollArea>
      </Card>

      {/* Main: Chat Detail */}
      <Card className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="text-lg font-medium">
              Session: {sessions.find((s) => s.id === selectedSessionId)?.topic}
            </h3>
            <p className="text-muted-foreground text-xs">User ID: {userId}</p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {messagesLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                <p className="text-sm text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!msg.isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={msg.avatar || "/placeholder.svg"}
                        alt={msg.senderName}
                      />
                      <AvatarFallback>
                        {msg.senderName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      msg.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                  {msg.isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar} alt={msg.senderName} />
                      <AvatarFallback>
                        {msg.senderName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {messages.length === 0 && !messagesLoading && (
                <p className="text-center text-sm text-gray-500">
                  No messages in this session.
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
