"use client";

import React, { useMemo, useState, useEffect } from "react";

export interface Keyword {
  label: string;
  percentage: number;
}

interface KeywordCloudProps {
  keywords: Keyword[];
  minFontSize?: number;
  maxFontSize?: number;
}

export default function KeywordCloud({
  keywords,
  minFontSize = 16,
  maxFontSize = 48,
}: KeywordCloudProps) {
  const [shuffled, setShuffled] = useState<Keyword[]>([]);

  // Shuffle only once when keywords change
  useEffect(() => {
    const arr = [...keywords];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
  }, [keywords]);

  const sizes = useMemo(() => {
    const values = keywords.map((k) => k.percentage);
    const minP = Math.min(...values);
    const maxP = Math.max(...values);

    return shuffled.map((k) => {
      if (maxP === minP) return (minFontSize + maxFontSize) / 2;
      const ratio = (k.percentage - minP) / (maxP - minP);
      return minFontSize + ratio * (maxFontSize - minFontSize);
    });
  }, [keywords, shuffled, minFontSize, maxFontSize]);

  return (
    <div className="flex h-[80vh] flex-wrap items-center justify-center gap-3">
      {shuffled.map((k, i) => (
        <span
          key={k.label}
          className="hover:text-primary cursor-pointer font-medium text-gray-700 transition-colors"
          style={{ fontSize: `${Math.round(sizes[i])}px` }}
        >
          {k.label}
        </span>
      ))}
    </div>
  );
}
