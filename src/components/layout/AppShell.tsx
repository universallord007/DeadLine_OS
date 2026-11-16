"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Clock,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Plus,
  Settings,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useDeadlineStore } from "@/hooks/useDeadlineStore";
import { ProjectModal } from "@/components/dashboard/ProjectModal";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "AI Planner", icon: Sparkles, badge: "Gemini" },
  { href: "/wallpaper", label: "Lock Screen Studio", icon: Smartphone },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { projects, activeProject, setActiveProjectId, reminders } = useDeadlineStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const pendingReminders = reminders.filter((r) => !r.completed).length;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col lg:flex-row">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-bg-secondary border-r border-border-subtle z-30">
        <div className="p-5 flex items-center justify-between border-b border-border-subtle">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-sky flex items-center justify-center shadow-glow">
              <Clock className="w-4 h-4 text-bg-primary stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm block leading-none">
                DEADLINE OS
              </span>
              <span className="text-[10px] text-text-muted tracking-widest uppercase">
                Command Center
              </span>
            </div>
          </Link>
        </div>

        <div className="p-4">
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-accent-purple hover:bg-accent-purple/90 text-bg-primary font-semibold text-sm flex items-center justify-center gap-2 transition shadow-glow active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            New Deadline
          </button>
        </div>

        <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Workspace
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname.startsWith("/projects"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-bg-elevated text-text-primary border border-border-strong shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      active ? "text-accent-purple" : "text-text-muted"
                    )}
                  />
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent-purple/15 text-accent-purple border border-accent-purple/30 font-mono">
                    {item.badge}
                  </span>
                )}
                {item.href === "/reminders" && pendingReminders > 0 && (
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-accent-sky/15 text-accent-sky font-mono">
                    {pendingReminders}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-5">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center justify-between">
              <span>Active Deadlines</span>
              <span className="font-mono">{projects.length}</span>
            </div>
            <div className="space-y-1 mt-1">
              {projects.slice(0, 6).map((project) => {
                const isSelected = activeProject?.id === project.id;
                return (
                  <div
                    key={project.id}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition",
                      isSelected
                        ? "bg-white/[0.06] text-text-primary"
                        : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary"
                    )}
                  >
                    <button
                      onClick={() => setActiveProjectId(project.id)}
                      className="flex items-center gap-2 truncate text-left flex-1"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: project.accentColor || "#A78BFA" }}
                      />
                      <span className="truncate">{project.title}</span>
                    </button>
                    <Link
                      href={`/projects/${project.id}`}
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-accent-sky hover:underline ml-1"
                    >
                      Open
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-border-subtle">
          <Link
            href="/wallpaper"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-accent-purple/15 to-accent-sky/10 border border-accent-purple/25 hover:border-accent-purple/50 transition"
          >
            <FolderKanban className="w-4 h-4 text-accent-purple shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">
                Export Lock Screen
              </p>
              <p className="text-[11px] text-text-secondary truncate">
                9:16 & 16:9 PNG Studio
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <header className="lg:hidden sticky top-0 z-30 bg-bg-secondary/90 backdrop-blur-md border-b border-border-subtle px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-purple to-accent-sky flex items-center justify-center">
            <Clock className="w-4 h-4 text-bg-primary stroke-[2.5]" />
          </div>
          <span className="font-bold text-sm tracking-tight">DEADLINE OS</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="p-2 rounded-lg bg-accent-purple text-bg-primary"
            aria-label="New deadline"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-bg-card border border-border-subtle text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="lg:hidden fixed inset-x-0 top-14 z-30 bg-bg-secondary border-b border-border-subtle p-4 space-y-2 shadow-2xl"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium",
                    active
                      ? "bg-bg-elevated text-text-primary border border-border-strong"
                      : "text-text-secondary"
                  )}
                >
                  <Icon className="w-4 h-4 text-accent-purple" />
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:pl-64 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>

      <ProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
