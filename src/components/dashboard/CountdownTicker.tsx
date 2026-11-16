"use client";

import React, { useEffect, useState } from "react";
import { calculateCountdown, padZero } from "@/utils/countdown";
import { cn } from "@/utils/cn";

interface CountdownTickerProps {
  deadline: string;
  compact?: boolean;
  accentColor?: string;
}

export function CountdownTicker({
  deadline,
  compact = false,
  accentColor = "#A78BFA",
}: CountdownTickerProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = calculateCountdown(deadline, now);

  if (compact) {
    return (
      <div className="font-mono text-sm font-semibold tracking-tight flex items-center gap-1.5">
        {parts.isExpired ? (
          <span className="text-accent-rose">DEADLINE REACHED</span>
        ) : (
          <>
            <span>{parts.days}d</span>
            <span className="text-text-muted">:</span>
            <span>{padZero(parts.hours)}h</span>
            <span className="text-text-muted">:</span>
            <span>{padZero(parts.minutes)}m</span>
            <span className="text-text-muted">:</span>
            <span style={{ color: accentColor }}>{padZero(parts.seconds)}s</span>
          </>
        )}
      </div>
    );
  }

  const blocks = [
    { label: "DAYS", value: padZero(parts.days) },
    { label: "HOURS", value: padZero(parts.hours) },
    { label: "MINUTES", value: padZero(parts.minutes) },
    { label: "SECONDS", value: padZero(parts.seconds) },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
      {blocks.map((block, idx) => (
        <div
          key={block.label}
          className={cn(
            "rounded-2xl bg-bg-primary/80 border border-border-subtle p-3 sm:p-4 text-center relative overflow-hidden"
          )}
        >
          <div
            className="font-mono text-2xl sm:text-4xl font-bold tracking-tight tabular-nums"
            style={idx === 3 ? { color: accentColor } : undefined}
          >
            {block.value}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-text-muted mt-1">
            {block.label}
          </div>
        </div>
      ))}
    </div>
  );
}
