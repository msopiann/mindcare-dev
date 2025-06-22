"use client";

import { useState } from "react";
import KeywordCloud from "@/components/chat/keyword-list";
import { usePopularKeywords } from "@/hooks/use-admin-chat-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function AdminChatPopularKeywordPage() {
  const [days, setDays] = useState(30);
  const [limit, setLimit] = useState(50);

  const { data, isLoading, refetch, error } = usePopularKeywords(days, limit);

  const handleRefresh = () => {
    refetch();
    toast.success("Keywords refreshed!");
  };

  const handleExport = () => {
    if (!data?.keywords) return;

    const csvContent = [
      ["Keyword", "Count", "Percentage", "Trend"],
      ...data.keywords.map((k) => [
        k.keyword,
        k.count.toString(),
        k.percentage.toString(),
        k.trend,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `popular-keywords-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Keywords exported!");
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-600">
              Error loading keywords: {error.message}
            </p>
            <Button onClick={handleRefresh} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold">Popular Keywords Analysis</h2>
            <p className="mt-2 text-gray-600">
              Keywords extracted from user chat messages, showing frequency and
              trends.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Time Period:</span>
            <Select
              value={days.toString()}
              onValueChange={(value) => setDays(Number.parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(Number.parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">Top 25</SelectItem>
                <SelectItem value="50">Top 50</SelectItem>
                <SelectItem value="100">Top 100</SelectItem>
                <SelectItem value="200">Top 200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        {data?.summary && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Analysis Summary</CardTitle>
              <CardDescription>
                Data from{" "}
                {new Date(data.summary.dateRange.start).toLocaleDateString()} to{" "}
                {new Date(data.summary.dateRange.end).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {data.summary.totalMessages}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Messages Analyzed
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {data.summary.uniqueKeywords}
                  </p>
                  <p className="text-sm text-gray-600">Unique Keywords Found</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {data.summary.avgKeywordsPerMessage}
                  </p>
                  <p className="text-sm text-gray-600">
                    Avg Keywords per Message
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <KeywordCloud keywords={data?.keywords || []} />
    </div>
  );
}
