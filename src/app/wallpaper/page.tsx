"use client";

import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Eye, RotateCcw, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { WallpaperCanvas } from "@/components/wallpaper/WallpaperCanvas";
import { useDeadlineStore } from "@/hooks/useDeadlineStore";
import {
  WALLPAPER_FORMATS,
  WALLPAPER_TEMPLATES,
  createDefaultWallpaperConfig,
} from "@/lib/wallpaper-presets";
import type {
  CheckboxStyle,
  CountdownDisplayStyle,
  FontChoice,
  WallpaperConfig,
  WallpaperFormatId,
  WallpaperTemplateId,
} from "@/types";
import { calculateProjectProgress } from "@/utils/countdown";

export default function WallpaperStudioPage() {
  const { projects, activeProject, settings } = useDeadlineStore();
  const exportRef = useRef<HTMLDivElement | null>(null);

  const selectedProject = activeProject ?? projects[0] ?? null;

  const [config, setConfig] = useState<WallpaperConfig>(() =>
    createDefaultWallpaperConfig(
      selectedProject?.id ?? "default",
      selectedProject?.title?.toUpperCase() ?? "FINAL EXAMINATION",
      "T-MINUS COUNTDOWN",
      "One day at a time. One goal at a time.",
      settings.defaultWallpaperFormat
    )
  );
  const [exporting, setExporting] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      setConfig((prev) => ({
        ...prev,
        projectId: selectedProject.id,
        customTitle: selectedProject.title.toUpperCase(),
      }));
    }
  }, [selectedProject?.id]);

  const activeSpec = WALLPAPER_FORMATS.find((f) => f.id === config.format) ?? WALLPAPER_FORMATS[0];
  const targetWidth = config.format === "custom" ? config.customWidth : activeSpec.width;
  const targetHeight = config.format === "custom" ? config.customHeight : activeSpec.height;

  const maxPreviewHeight = 560;
  const maxPreviewWidth = 460;
  const scale = Math.min(maxPreviewHeight / targetHeight, maxPreviewWidth / targetWidth);

  const applyTemplate = (tplId: WallpaperTemplateId) => {
    const tpl = WALLPAPER_TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;
    setConfig((prev) => ({
      ...prev,
      template: tpl.id,
      bgColor: tpl.bgColor,
      useGradient: tpl.useGradient,
      gradientFrom: tpl.gradientFrom,
      gradientTo: tpl.gradientTo,
      accentColor: tpl.accentColor,
      textColor: tpl.textColor,
      fontFamily: tpl.fontFamily,
    }));
  };

  const handleFormatChange = (fmt: WallpaperFormatId) => {
    setConfig((prev) => ({
      ...prev,
      format: fmt,
      clockSafeTopPadding: fmt === "mobile" ? 26 : fmt === "tablet" ? 20 : 12,
    }));
  };

  const handleExportPng = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        width: targetWidth,
        height: targetHeight,
        pixelRatio: 1,
        cacheBust: true,
      });

      const link = document.createElement("a");
      const slug = (config.customTitle || "deadline-os")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      link.download = `${slug}-${targetWidth}x${targetHeight}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`Exported ${targetWidth}×${targetHeight} PNG wallpaper`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to render PNG export");
    } finally {
      setExporting(false);
    }
  };

  const handleReset = () => {
    setConfig(
      createDefaultWallpaperConfig(
        selectedProject?.id ?? "default",
        selectedProject?.title?.toUpperCase() ?? "FINAL EXAMINATION",
        "T-MINUS COUNTDOWN",
        "One day at a time. One goal at a time.",
        settings.defaultWallpaperFormat
      )
    );
    toast.info("Wallpaper customization reset");
  };

  const currentProject =
    projects.find((p) => p.id === config.projectId) ?? selectedProject;
  const deadlineIso =
    currentProject?.deadline ?? new Date(Date.now() + 14 * 86400 * 1000).toISOString();
  const milestones = currentProject?.milestones ?? [];
  const progress = currentProject ? calculateProjectProgress(currentProject) : 35;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-accent-purple" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-purple">
                Signature Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Countdown Lock Screen Studio
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-bg-card hover:bg-bg-elevated border border-border-strong text-xs font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={() => setFullPreview(!fullPreview)}
              className="px-3.5 py-2.5 rounded-xl bg-bg-card hover:bg-bg-elevated border border-border-strong text-xs font-medium flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              {fullPreview ? "Exit Preview" : "Preview Mode"}
            </button>
            <button
              onClick={handleExportPng}
              disabled={exporting}
              className="px-5 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-purple/90 text-bg-primary text-xs font-bold flex items-center gap-2 shadow-glow disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Rendering PNG..." : `Download PNG (${targetWidth}×${targetHeight})`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {!fullPreview && (
            <div className="lg:col-span-5 space-y-5 rounded-2xl bg-bg-card border border-border-subtle p-5 max-h-[760px] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Source Deadline Project
                </label>
                <select
                  value={config.projectId}
                  onChange={(e) => {
                    const p = projects.find((item) => item.id === e.target.value);
                    setConfig((prev) => ({
                      ...prev,
                      projectId: e.target.value,
                      customTitle: p ? p.title.toUpperCase() : prev.customTitle,
                    }));
                  }}
                  className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2.5 text-xs"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Device Aspect Ratio & Resolution
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WALLPAPER_FORMATS.map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => handleFormatChange(fmt.id)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        config.format === fmt.id
                          ? "bg-accent-purple/15 border-accent-purple text-text-primary"
                          : "bg-bg-primary border-border-subtle text-text-secondary hover:border-border-strong"
                      }`}
                    >
                      <div className="text-xs font-semibold">{fmt.label}</div>
                      <div className="text-[11px] font-mono opacity-75">
                        {fmt.ratioLabel} • {fmt.width}×{fmt.height}
                      </div>
                    </button>
                  ))}
                </div>
                {config.format === "custom" && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="number"
                      min={640}
                      max={3840}
                      value={config.customWidth}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          customWidth: Number(e.target.value) || 1080,
                        }))
                      }
                      className="rounded-lg bg-bg-primary border border-border-subtle px-3 py-1.5 text-xs font-mono"
                      placeholder="Width px"
                    />
                    <input
                      type="number"
                      min={640}
                      max={3840}
                      value={config.customHeight}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          customHeight: Number(e.target.value) || 1920,
                        }))
                      }
                      className="rounded-lg bg-bg-primary border border-border-subtle px-3 py-1.5 text-xs font-mono"
                      placeholder="Height px"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Theme Template (8 Presets)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WALLPAPER_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => applyTemplate(tpl.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                        config.template === tpl.id
                          ? "border-accent-purple bg-bg-elevated"
                          : "border-border-subtle bg-bg-primary hover:border-border-strong"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: tpl.accentColor }}
                      />
                      <span className="text-xs font-medium truncate">{tpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Countdown Layout
                  </label>
                  <select
                    value={config.countdownStyle}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        countdownStyle: e.target.value as CountdownDisplayStyle,
                      }))
                    }
                    className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs"
                  >
                    <option value="stacked">Stacked T-Minus</option>
                    <option value="days-hero">Hero Days Counter</option>
                    <option value="inline-colon">Inline Digital</option>
                    <option value="minimal-pill">Minimal HUD Pill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Font Style
                  </label>
                  <select
                    value={config.fontFamily}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        fontFamily: e.target.value as FontChoice,
                      }))
                    }
                    className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs"
                  >
                    <option value="sans">Modern Sans</option>
                    <option value="mono">Technical Mono</option>
                    <option value="serif">Editorial Serif</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Wallpaper Headline
                  </label>
                  <input
                    value={config.customTitle}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, customTitle: e.target.value }))
                    }
                    className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Top Badge Subtitle
                  </label>
                  <input
                    value={config.subtitle}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Motivational Quote
                  </label>
                  <input
                    value={config.motivationalQuote}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, motivationalQuote: e.target.value }))
                    }
                    className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1">Accent</label>
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, accentColor: e.target.value }))
                    }
                    className="w-full h-9 rounded-lg bg-bg-primary border border-border-subtle cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1">Base / From</label>
                  <input
                    type="color"
                    value={config.gradientFrom}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        bgColor: e.target.value,
                        gradientFrom: e.target.value,
                      }))
                    }
                    className="w-full h-9 rounded-lg bg-bg-primary border border-border-subtle cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1">Gradient To</label>
                  <input
                    type="color"
                    value={config.gradientTo}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, gradientTo: e.target.value }))
                    }
                    className="w-full h-9 rounded-lg bg-bg-primary border border-border-subtle cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Clock-Safe Top Margin</span>
                    <span className="font-mono">{config.clockSafeTopPadding}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={38}
                    value={config.clockSafeTopPadding}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        clockSafeTopPadding: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-accent-purple"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Typography Scale</span>
                    <span className="font-mono">{Math.round(config.fontScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.8}
                    max={1.25}
                    step={0.05}
                    value={config.fontScale}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, fontScale: Number(e.target.value) }))
                    }
                    className="w-full accent-accent-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showMilestones}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showMilestones: e.target.checked }))
                    }
                    className="accent-accent-purple"
                  />
                  Show Milestones
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showProgressBar}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showProgressBar: e.target.checked }))
                    }
                    className="accent-accent-purple"
                  />
                  Show Progress Bar
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showMotivationalQuote}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        showMotivationalQuote: e.target.checked,
                      }))
                    }
                    className="accent-accent-purple"
                  />
                  Show Quote
                </label>

                <select
                  value={config.checkboxStyle}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      checkboxStyle: e.target.value as CheckboxStyle,
                    }))
                  }
                  className="rounded-lg bg-bg-primary border border-border-subtle px-2 py-1 text-xs"
                >
                  <option value="square">Square Boxes</option>
                  <option value="circle">Circle Boxes</option>
                  <option value="diamond">Diamond Boxes</option>
                  <option value="dash">Minimal Dashes</option>
                </select>
              </div>
            </div>
          )}

          <div
            className={`${
              fullPreview ? "lg:col-span-12" : "lg:col-span-7"
            } rounded-2xl bg-bg-secondary border border-border-subtle p-6 flex flex-col items-center justify-center min-h-[640px] relative overflow-hidden`}
          >
            <div className="text-xs font-mono text-text-muted mb-4">
              LIVE LOCK SCREEN PREVIEW • {targetWidth} × {targetHeight}px ({activeSpec.ratioLabel})
            </div>

            <div
              style={{
                width: targetWidth * scale,
                height: targetHeight * scale,
              }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15"
            >
              <div
                style={{
                  width: targetWidth,
                  height: targetHeight,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <WallpaperCanvas
                  config={config}
                  deadline={deadlineIso}
                  milestones={milestones}
                  progress={progress}
                  width={targetWidth}
                  height={targetHeight}
                />
              </div>
            </div>

            <div className="fixed -left-[99999px] -top-[99999px] pointer-events-none">
              <WallpaperCanvas
                canvasRef={exportRef}
                config={config}
                deadline={deadlineIso}
                milestones={milestones}
                progress={progress}
                width={targetWidth}
                height={targetHeight}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
