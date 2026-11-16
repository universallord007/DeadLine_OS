"use client";

import React from "react";
import type { Milestone, WallpaperConfig } from "@/types";
import { calculateCountdown, padZero } from "@/utils/countdown";

interface WallpaperCanvasProps {
  config: WallpaperConfig;
  deadline: string;
  milestones: Milestone[];
  progress: number;
  width: number;
  height: number;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

export function WallpaperCanvas({
  config,
  deadline,
  milestones,
  progress,
  width,
  height,
  canvasRef,
}: WallpaperCanvasProps) {
  const countdown = calculateCountdown(deadline);
  const isLight = config.template === "minimal-white";
  const isGrid = config.template === "productivity-grid";
  const isGlass = config.template === "futuristic-glass";
  const isNeon = config.template === "cyberpunk-neon";
  const isLandscape = width > height;

  const fontClass =
    config.fontFamily === "mono"
      ? "font-mono"
      : config.fontFamily === "serif"
        ? "font-serif"
        : "font-sans";

  const backgroundStyle: React.CSSProperties = config.useGradient
    ? {
        background: `linear-gradient(155deg, ${config.gradientFrom} 0%, ${config.gradientTo} 100%)`,
      }
    : {
        backgroundColor: config.bgColor,
      };

  const visibleMilestones = milestones.slice(0, config.maxMilestones);

  const renderCheckbox = (completed: boolean) => {
    const borderColor = completed ? config.accentColor : `${config.textColor}55`;
    const fill = completed ? config.accentColor : "transparent";
    if (config.checkboxStyle === "dash") {
      return (
        <span
          className="inline-block font-mono font-bold mr-2.5"
          style={{ color: completed ? config.accentColor : `${config.textColor}88` }}
        >
          {completed ? "✓" : "—"}
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center justify-center mr-3 shrink-0"
        style={{
          width: 18 * config.fontScale,
          height: 18 * config.fontScale,
          border: `2px solid ${borderColor}`,
          backgroundColor: fill,
          borderRadius:
            config.checkboxStyle === "circle"
              ? "9999px"
              : config.checkboxStyle === "diamond"
                ? "3px"
                : "4px",
          transform: config.checkboxStyle === "diamond" ? "rotate(45deg)" : undefined,
        }}
      >
        {completed && (
          <span
            style={{
              color: isLight ? "#FFFFFF" : "#09090B",
              fontSize: 11 * config.fontScale,
              fontWeight: 800,
              transform: config.checkboxStyle === "diamond" ? "rotate(-45deg)" : undefined,
            }}
          >
            ✓
          </span>
        )}
      </span>
    );
  };

  return (
    <div
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        color: config.textColor,
        ...backgroundStyle,
      }}
      className={`relative overflow-hidden select-none flex flex-col justify-between ${fontClass}`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 24%, ${config.accentColor}26 0%, transparent 62%)`,
        }}
      />

      {isGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundSize: "48px 48px",
            backgroundImage: `linear-gradient(to right, ${config.accentColor}33 1px, transparent 1px), linear-gradient(to bottom, ${config.accentColor}33 1px, transparent 1px)`,
          }}
        />
      )}

      <div
        style={{
          paddingTop: `${config.clockSafeTopPadding}%`,
          paddingLeft: isLandscape ? "8%" : "8.5%",
          paddingRight: isLandscape ? "8%" : "8.5%",
          paddingBottom: isLandscape ? "6%" : "8%",
        }}
        className={`relative z-10 flex-1 flex ${
          isLandscape
            ? "flex-row items-center justify-between gap-12"
            : "flex-col justify-between"
        }`}
      >
        <div className={isLandscape ? "w-1/2" : "w-full"}>
          {config.showBadge && (
            <div className="mb-3 flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: config.accentColor }}
              />
              <span
                style={{
                  color: config.accentColor,
                  fontSize: `${15 * config.fontScale}px`,
                  letterSpacing: "0.24em",
                }}
                className="font-mono font-semibold uppercase"
              >
                {config.subtitle || "T-MINUS COUNTDOWN"}
              </span>
            </div>
          )}

          <h1
            style={{
              fontSize: `${(isLandscape ? 46 : 48) * config.fontScale}px`,
              lineHeight: 1.08,
            }}
            className="font-extrabold tracking-tight uppercase break-words"
          >
            {config.customTitle || "DEADLINE TARGET"}
          </h1>

          <div className="mt-7">
            {config.countdownStyle === "days-hero" && (
              <div className="flex items-baseline gap-4">
                <span
                  style={{
                    fontSize: `${112 * config.fontScale}px`,
                    color: config.accentColor,
                    lineHeight: 0.95,
                  }}
                  className="font-mono font-black tracking-tighter"
                >
                  {countdown.days}
                </span>
                <div>
                  <div
                    style={{ fontSize: `${26 * config.fontScale}px` }}
                    className="font-bold tracking-widest uppercase"
                  >
                    DAYS LEFT
                  </div>
                  <div
                    style={{
                      fontSize: `${17 * config.fontScale}px`,
                      color: `${config.textColor}99`,
                    }}
                    className="font-mono mt-1"
                  >
                    {padZero(countdown.hours)}H : {padZero(countdown.minutes)}M
                  </div>
                </div>
              </div>
            )}

            {config.countdownStyle === "inline-colon" && (
              <div
                style={{
                  fontSize: `${56 * config.fontScale}px`,
                  color: config.accentColor,
                }}
                className="font-mono font-extrabold tracking-tight"
              >
                {padZero(countdown.days)}d : {padZero(countdown.hours)}h :{" "}
                {padZero(countdown.minutes)}m
              </div>
            )}

            {config.countdownStyle === "minimal-pill" && (
              <div
                style={{
                  borderColor: `${config.accentColor}66`,
                  backgroundColor: `${config.accentColor}18`,
                  fontSize: `${24 * config.fontScale}px`,
                }}
                className="inline-flex items-center gap-4 px-6 py-3.5 rounded-2xl border font-mono font-bold"
              >
                <span>{countdown.days} DAYS</span>
                <span style={{ color: config.accentColor }}>•</span>
                <span>{padZero(countdown.hours)} HRS</span>
                <span style={{ color: config.accentColor }}>•</span>
                <span>{padZero(countdown.minutes)} MIN</span>
              </div>
            )}

            {config.countdownStyle === "stacked" && (
              <div className="space-y-1.5 font-mono">
                <div
                  style={{
                    fontSize: `${58 * config.fontScale}px`,
                    color: config.accentColor,
                    lineHeight: 1.05,
                  }}
                  className="font-black tracking-tight"
                >
                  {padZero(countdown.days)} DAYS
                </div>
                <div
                  style={{
                    fontSize: `${34 * config.fontScale}px`,
                    opacity: 0.92,
                    lineHeight: 1.15,
                  }}
                  className="font-bold tracking-tight"
                >
                  {padZero(countdown.hours)} HOURS
                </div>
                <div
                  style={{
                    fontSize: `${28 * config.fontScale}px`,
                    opacity: 0.72,
                    lineHeight: 1.15,
                  }}
                  className="font-semibold tracking-tight"
                >
                  {padZero(countdown.minutes)} MINUTES
                </div>
              </div>
            )}
          </div>

          {config.showProgressBar && (
            <div className="mt-7 max-w-md">
              <div
                style={{ fontSize: `${13 * config.fontScale}px`, opacity: 0.75 }}
                className="flex justify-between font-mono uppercase tracking-wider mb-2"
              >
                <span>Execution Progress</span>
                <span>{progress}%</span>
              </div>
              <div
                className="w-full h-2.5 rounded-full overflow-hidden"
                style={{
                  backgroundColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.12)",
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: config.accentColor,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className={isLandscape ? "w-1/2" : "w-full mt-8"}>
          {config.showMilestones && visibleMilestones.length > 0 && (
            <div
              style={{
                backgroundColor: isGlass
                  ? "rgba(255, 255, 255, 0.06)"
                  : isLight
                    ? "rgba(0, 0, 0, 0.04)"
                    : "rgba(255, 255, 255, 0.035)",
                borderColor: isNeon
                  ? `${config.accentColor}55`
                  : isLight
                    ? "rgba(0,0,0,0.12)"
                    : "rgba(255,255,255,0.1)",
              }}
              className="rounded-3xl border p-6"
            >
              <div
                style={{
                  color: config.accentColor,
                  fontSize: `${13 * config.fontScale}px`,
                  letterSpacing: "0.2em",
                }}
                className="font-mono font-bold uppercase mb-4"
              >
                YOUR MILESTONES
              </div>

              <ul className="space-y-3.5">
                {visibleMilestones.map((m) => (
                  <li
                    key={m.id}
                    style={{
                      fontSize: `${19 * config.fontScale}px`,
                      opacity: m.completed ? 0.52 : 0.96,
                    }}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center min-w-0">
                      {renderCheckbox(m.completed)}
                      <span className={m.completed ? "line-through truncate" : "truncate"}>
                        {m.title}
                      </span>
                    </div>
                    <span
                      style={{
                        color: config.accentColor,
                        fontSize: `${13 * config.fontScale}px`,
                      }}
                      className="font-mono shrink-0 opacity-80"
                    >
                      {m.tMinusLabel}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {config.showMotivationalQuote && config.motivationalQuote && (
            <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-between gap-4">
              <p
                style={{
                  fontSize: `${17 * config.fontScale}px`,
                  opacity: 0.78,
                }}
                className="italic"
              >
                &ldquo;{config.motivationalQuote}&rdquo;
              </p>
              <span
                style={{ fontSize: `${11 * config.fontScale}px`, opacity: 0.45 }}
                className="font-mono uppercase tracking-widest shrink-0"
              >
                DEADLINE OS
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
