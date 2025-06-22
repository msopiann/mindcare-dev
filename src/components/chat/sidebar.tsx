"use client";

import { useState } from "react";
import Image from "next/image";
import {
  SettingsIcon,
  Plus,
  MessageSquare,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string | null;
  lastMessageTime: string | null;
}

export interface SidebarProps {
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onSettings: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  isLoading?: boolean;
}

export default function Sidebar({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onSettings,
  user,
  isLoading = false,
}: SidebarProps) {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <aside className="bg-background hidden h-full w-80 flex-col border-r md:flex">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/image/chat/avatar-web.png"
            alt="Logo"
            width={0}
            height={0}
            className="size-8"
          />
          <span className="text-lg font-semibold">Mindcare</span>
        </Link>
        <Button
          onClick={onNewChat}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-1 p-2">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">No chat sessions yet</p>
                <Button
                  onClick={onNewChat}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Start your first chat
                </Button>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors",
                    selectedSessionId === session.id
                      ? "border border-blue-200 bg-blue-50"
                      : "hover:bg-gray-50",
                  )}
                  onClick={() => onSelectSession(session.id)}
                  onMouseEnter={() => setHoveredSession(session.id)}
                  onMouseLeave={() => setHoveredSession(null)}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage
                      src="/assets/image/chat/avatar-bot.png"
                      alt="AI Assistant"
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="line-clamp-1 text-sm font-medium">
                        {session.title}
                      </h3>
                      <span className="ml-2 line-clamp-1 flex-shrink-0 text-xs text-gray-500">
                        {formatTime(session.lastMessageTime)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-600">
                      {session.lastMessage || "No messages yet"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {session.messageCount} messages
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  {(hoveredSession === session.id ||
                    selectedSessionId === session.id) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer with user info */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image} alt="User avatar" />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium">
                {user?.name || "User"}
              </p>
              <p className="line-clamp-1 text-xs text-gray-500">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="h-8 w-8 p-0"
          >
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
