"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Cloud,
  List,
} from "lucide-react";

interface KeywordData {
  keyword: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

interface KeywordCloudProps {
  keywords: KeywordData[];
}

const getTrendIcon = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    case "down":
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    case "stable":
      return <Minus className="h-3 w-3 text-gray-500" />;
  }
};

const getTrendColor = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return "text-green-600 bg-green-50 border-green-200";
    case "down":
      return "text-red-600 bg-red-50 border-red-200";
    case "stable":
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getKeywordSize = (count: number, maxCount: number) => {
  const ratio = count / maxCount;
  if (ratio > 0.8) return "text-3xl";
  if (ratio > 0.6) return "text-2xl";
  if (ratio > 0.4) return "text-xl";
  if (ratio > 0.2) return "text-lg";
  return "text-base";
};

export default function KeywordCloud({ keywords }: KeywordCloudProps) {
  const [viewMode, setViewMode] = useState<"cloud" | "list">("cloud");
  const [sortBy, setSortBy] = useState<"count" | "trend" | "alphabetical">(
    "count",
  );

  if (!keywords || keywords.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Cloud className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="text-gray-500">
            No keywords found in the selected time period.
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...keywords.map((k) => k.count));

  const sortedKeywords = [...keywords].sort((a, b) => {
    switch (sortBy) {
      case "count":
        return b.count - a.count;
      case "trend":
        const trendOrder = { up: 3, stable: 2, down: 1 };
        return trendOrder[b.trend] - trendOrder[a.trend];
      case "alphabetical":
        return a.keyword.localeCompare(b.keyword);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "cloud" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cloud")}
          >
            <Cloud className="mr-2 h-4 w-4" />
            Cloud View
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-2 h-4 w-4" />
            List View
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(value: any) => setSortBy(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="count">Frequency</SelectItem>
              <SelectItem value="trend">Trend</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Total Keywords</span>
            </div>
            <p className="text-2xl font-bold">{keywords.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Trending Up</span>
            </div>
            <p className="text-2xl font-bold">
              {keywords.filter((k) => k.trend === "up").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-600">Trending Down</span>
            </div>
            <p className="text-2xl font-bold">
              {keywords.filter((k) => k.trend === "down").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Stable</span>
            </div>
            <p className="text-2xl font-bold">
              {keywords.filter((k) => k.trend === "stable").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {viewMode === "cloud" ? (
              <Cloud className="h-5 w-5" />
            ) : (
              <List className="h-5 w-5" />
            )}
            Popular Keywords
          </CardTitle>
          <CardDescription>
            Keywords extracted from user messages, showing frequency and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "cloud" ? (
            <div className="flex flex-wrap justify-center gap-3 p-6">
              {sortedKeywords.map((keyword) => (
                <div
                  key={keyword.keyword}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-2 transition-all hover:shadow-md ${getTrendColor(keyword.trend)}`}
                >
                  <span
                    className={`font-medium ${getKeywordSize(keyword.count, maxCount)}`}
                  >
                    {keyword.keyword}
                  </span>
                  <div className="flex items-center gap-1 text-xs">
                    {getTrendIcon(keyword.trend)}
                    <span>{keyword.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedKeywords.map((keyword, index) => (
                <div
                  key={keyword.keyword}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm text-gray-500">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{keyword.keyword}</span>
                    {getTrendIcon(keyword.trend)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{keyword.count} times</span>
                    <Badge variant="secondary">{keyword.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
