"use client";

import React from "react";
import { Database, KeyRound, RotateCcw, Sliders, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useDeadlineStore } from "@/hooks/useDeadlineStore";
import type { WallpaperFormatId } from "@/types";

export default function SettingsPage() {
  const { settings, updateSettings, clearDemoData, restoreDemoData, resetAllData } =
    useDeadlineStore();

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent-purple">
            System Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Settings</h1>
        </div>

        <div className="rounded-2xl bg-bg-card border border-border-subtle p-6 space-y-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Sliders className="w-4 h-4 text-accent-purple" />
            Workspace & Appearance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Display Name</label>
              <input
                value={settings.userName}
                onChange={(e) => updateSettings({ userName: e.target.value })}
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Default Wallpaper Format
              </label>
              <select
                value={settings.defaultWallpaperFormat}
                onChange={(e) =>
                  updateSettings({
                    defaultWallpaperFormat: e.target.value as WallpaperFormatId,
                  })
                }
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3.5 py-2.5 text-sm"
              >
                <option value="mobile">Mobile Lock Screen (9:16)</option>
                <option value="desktop">Desktop Wallpaper (16:9)</option>
                <option value="tablet">Tablet / iPad (4:3)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 text-sm">
            <label className="flex items-center justify-between p-3 rounded-xl bg-bg-primary/60 border border-border-subtle cursor-pointer">
              <span>Enable in-app reminder toast alerts</span>
              <input
                type="checkbox"
                checked={settings.inAppRemindersEnabled}
                onChange={(e) =>
                  updateSettings({ inAppRemindersEnabled: e.target.checked })
                }
                className="accent-accent-purple"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-bg-primary/60 border border-border-subtle cursor-pointer">
              <span>Reduce motion animations</span>
              <input
                type="checkbox"
                checked={settings.reducedMotionOverride}
                onChange={(e) =>
                  updateSettings({ reducedMotionOverride: e.target.checked })
                }
                className="accent-accent-purple"
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl bg-bg-card border border-border-subtle p-6 space-y-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-accent-sky" />
            Google Gemini API Configuration
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            DEADLINE OS calls <code className="font-mono text-text-primary">gemini-2.5-flash</code>{" "}
            securely from a server-side Next.js Route Handler (<code className="font-mono">/api/ai/plan</code>).
            Your API key is never exposed in client-side bundles.
          </p>
          <pre className="p-3.5 rounded-xl bg-bg-primary border border-border-subtle text-xs font-mono text-accent-emerald overflow-x-auto">
            GEMINI_API_KEY=your_api_key_from_google_ai_studio
          </pre>
        </div>

        <div className="rounded-2xl bg-bg-card border border-border-subtle p-6 space-y-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Database className="w-4 h-4 text-accent-amber" />
            Data Management (LocalStorage)
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                clearDemoData();
                toast.success("Sample demo projects removed");
              }}
              className="px-4 py-2.5 rounded-xl bg-bg-elevated hover:bg-white/10 border border-border-strong text-xs font-medium flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 text-accent-amber" />
              Clear Demo Data Only
            </button>

            <button
              onClick={() => {
                restoreDemoData();
                toast.success("Sample demo projects restored");
              }}
              className="px-4 py-2.5 rounded-xl bg-bg-elevated hover:bg-white/10 border border-border-strong text-xs font-medium flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-accent-sky" />
              Restore Demo Data
            </button>

            <button
              onClick={() => {
                resetAllData();
                toast.info("Workspace reset to factory defaults");
              }}
              className="px-4 py-2.5 rounded-xl bg-accent-rose/10 hover:bg-accent-rose/20 border border-accent-rose/30 text-accent-rose text-xs font-semibold"
            >
              Reset All Local Data
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
