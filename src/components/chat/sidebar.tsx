"use client";

import Image from "next/image";
import { Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export interface ChatItem {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface SidebarProps {
  chats: ChatItem[];
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onSettings: () => void;
}

export default function Sidebar({ onSettings }: SidebarProps) {
  return (
    <aside
      role="complementary"
      className="bg-background hidden h-full w-26 flex-col border-r md:flex"
    >
      <div className="flex h-17 items-center justify-center px-4 py-2">
        <Link href="/">
          <Image
            src="/assets/image/chat/avatar-web.png"
            alt="Logo Tertiary"
            width={50}
            height={50}
          />
        </Link>
      </div>

      {/* Footer settings */}
      <div className="mt-auto space-y-4 px-4 py-2 pb-8 text-center">
        <button
          onClick={onSettings}
          aria-label="Settings"
          className="rounded p-2 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:hover:bg-gray-800"
        >
          <SettingsIcon className="h-4 w-4" />
        </button>
        <div className="flex items-center justify-center">
          <Image
            src="/assets/image/chat/avatar-user.png"
            alt="Logo Tertiary"
            width={40}
            height={40}
            className="items-center rounded-full"
          />
        </div>
      </div>
    </aside>
  );
}
