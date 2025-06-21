"use client";

import KeywordCloud from "@/components/chat/keyword-list";
import { usePopularKeywords } from "@/hooks/use-admin-chat-api";

export default function AdminChatPopularKeywordPage() {
  const { data: keywords = [], isLoading } = usePopularKeywords();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p>Loading popular keywords...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Popular Keywords Analysis</h2>
        <p className="mt-2 text-gray-600">
          Keywords extracted from user chat messages, showing frequency and
          trends.
        </p>
      </div>
      <KeywordCloud keywords={keywords} />
    </div>
  );
}
