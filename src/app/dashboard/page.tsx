"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Circle,
  Clock,
  FolderPlus,
  Smartphone,
  Sparkles,
  Target,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CountdownTicker } from "@/components/dashboard/CountdownTicker";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { useDeadlineStore } from "@/hooks/useDeadlineStore";
import { calculateProjectProgress, formatDeadlineDate, formatShortDate } from "@/utils/countdown";

export default function DashboardPage() {
  const {
    hydrated,
    projects,
    activeProject,
    setActiveProjectId,
    toggleMilestone,
    reminders,
    settings,
  } = useDeadlineStore();
  const [createOpen, setCreateOpen] = useState(false);

  if (!hydrated) {
    return (
      <AppShell>
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-64 rounded-xl bg-bg-card" />
          <div className="h-56 rounded-2xl bg-bg-card" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 rounded-2xl bg-bg-card" />
            <div className="h-32 rounded-2xl bg-bg-card" />
            <div className="h-32 rounded-2xl bg-bg-card" />
          </div>
        </div>
      </AppShell>
    );
  }

  const allMilestones = projects.flatMap((p) =>
    p.milestones.map((m) => ({ ...m, projectId: p.id, projectTitle: p.title }))
  );
  const completedCount = allMilestones.filter((m) => m.completed).length;
  const upcomingMilestones = allMilestones.filter((m) => !m.completed).slice(0, 5);
  const completedMilestones = allMilestones.filter((m) => m.completed).slice(0, 4);
  const activeProgress = activeProject ? calculateProjectProgress(activeProject) : 0;
  const upcomingRemindersCount = reminders.filter((r) => !r.completed).length;

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-accent-purple">
              Command Center
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Welcome back, {settings.userName}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/planner"
              className="px-4 py-2.5 rounded-xl bg-bg-card hover:bg-bg-elevated border border-border-strong text-xs font-semibold flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-accent-purple" />
              AI Plan Generator
            </Link>
            <Link
              href="/wallpaper"
              className="px-4 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-purple/90 text-bg-primary text-xs font-semibold flex items-center gap-2 shadow-glow transition"
            >
              <Smartphone className="w-4 h-4" />
              Design Lock Screen
            </Link>
          </div>
        </div>

        {activeProject ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-br from-bg-card via-bg-card to-bg-elevated border border-border-strong p-6 sm:p-8 shadow-glass relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono uppercase bg-accent-purple/15 text-accent-purple border border-accent-purple/30">
                    Active Focus • {activeProject.category}
                  </span>
                  {activeProject.isDemo && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/25">
                      Sample Project
                    </span>
                  )}
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDeadlineDate(activeProject.deadline)}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {activeProject.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {activeProject.description}
                </p>

                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-secondary">Milestone Completion</span>
                    <span className="font-mono font-semibold text-accent-emerald">
                      {activeProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-bg-primary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeProgress}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-emerald"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:w-[420px] space-y-4">
                <CountdownTicker
                  deadline={activeProject.deadline}
                  accentColor={activeProject.accentColor || "#A78BFA"}
                />
                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    href={`/projects/${activeProject.id}`}
                    className="text-xs font-medium text-accent-sky hover:underline flex items-center gap-1"
                  >
                    Open Full Timeline
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/wallpaper?projectId=${activeProject.id}`}
                    className="text-xs font-medium text-accent-purple hover:underline flex items-center gap-1"
                  >
                    Generate Wallpaper
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-3xl bg-bg-card border border-border-subtle p-10 text-center space-y-4">
            <h2 className="text-xl font-semibold">No Active Deadlines Yet</h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Create your first goal manually or let Gemini AI build a backward milestone
              schedule for you.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setCreateOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-accent-purple text-bg-primary text-xs font-semibold"
              >
                Create Deadline
              </button>
              <Link
                href="/planner"
                className="px-4 py-2.5 rounded-xl bg-bg-elevated border border-border-strong text-xs font-semibold"
              >
                Launch AI Planner
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-bg-card border border-border-subtle p-5">
            <div className="flex items-center justify-between text-text-secondary text-xs">
              <span>Active Projects</span>
              <Target className="w-4 h-4 text-accent-purple" />
            </div>
            <div className="text-2xl font-bold font-mono mt-2">{projects.length}</div>
            <p className="text-xs text-text-muted mt-1">Tracked across workspace</p>
          </div>

          <div className="rounded-2xl bg-bg-card border border-border-subtle p-5">
            <div className="flex items-center justify-between text-text-secondary text-xs">
              <span>Milestones Completed</span>
              <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
            </div>
            <div className="text-2xl font-bold font-mono mt-2">
              {completedCount} / {allMilestones.length}
            </div>
            <p className="text-xs text-text-muted mt-1">Total execution velocity</p>
          </div>

          <div className="rounded-2xl bg-bg-card border border-border-subtle p-5">
            <div className="flex items-center justify-between text-text-secondary text-xs">
              <span>Active Progress</span>
              <Sparkles className="w-4 h-4 text-accent-sky" />
            </div>
            <div className="text-2xl font-bold font-mono mt-2">{activeProgress}%</div>
            <p className="text-xs text-text-muted mt-1 truncate">
              {activeProject?.title ?? "No active project"}
            </p>
          </div>

          <div className="rounded-2xl bg-bg-card border border-border-subtle p-5">
            <div className="flex items-center justify-between text-text-secondary text-xs">
              <span>Upcoming Reminders</span>
              <Bell className="w-4 h-4 text-accent-amber" />
            </div>
            <div className="text-2xl font-bold font-mono mt-2">{upcomingRemindersCount}</div>
            <Link href="/reminders" className="text-xs text-accent-sky hover:underline mt-1 inline-block">
              Manage schedule →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-bg-card border border-border-subtle p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base">Upcoming Milestones</h3>
              <span className="text-xs font-mono text-text-muted">Click to complete</span>
            </div>
            {upcomingMilestones.length === 0 ? (
              <p className="text-sm text-text-secondary py-6 text-center">
                All milestones completed!
              </p>
            ) : (
              <div className="space-y-2.5">
                {upcomingMilestones.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(m.projectId, m.id)}
                    className="w-full text-left p-3.5 rounded-xl bg-bg-primary/60 hover:bg-bg-elevated border border-border-subtle flex items-start justify-between gap-3 transition"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <Circle className="w-4 h-4 text-accent-purple shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{m.title}</p>
                        <p className="text-xs text-text-muted truncate">{m.projectTitle}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-accent-sky shrink-0">
                      {formatShortDate(m.dueDate)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-bg-card border border-border-subtle p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base">Recently Completed</h3>
              <span className="text-xs font-mono text-accent-emerald">
                {completedCount} Done
              </span>
            </div>
            {completedMilestones.length === 0 ? (
              <p className="text-sm text-text-secondary py-6 text-center">
                Check off your first milestone to track momentum.
              </p>
            ) : (
              <div className="space-y-2.5">
                {completedMilestones.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(m.projectId, m.id)}
                    className="w-full text-left p-3.5 rounded-xl bg-bg-primary/40 border border-border-subtle flex items-center justify-between gap-3 opacity-80 hover:opacity-100 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
                      <span className="text-sm line-through text-text-secondary truncate">
                        {m.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-text-muted shrink-0">
                      {m.tMinusLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">All Deadline Projects</h3>
            <button
              onClick={() => setCreateOpen(true)}
              className="text-xs font-semibold text-accent-purple hover:underline flex items-center gap-1"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              Add Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const prog = calculateProjectProgress(proj);
              return (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-bg-card border border-border-subtle p-5 flex flex-col justify-between hover:border-border-strong transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono uppercase text-text-muted">
                        {proj.category}
                      </span>
                      {proj.isDemo ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Demo
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                          Custom
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="text-base font-semibold hover:text-accent-purple transition line-clamp-1"
                    >
                      {proj.title}
                    </Link>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border-subtle space-y-3">
                    <CountdownTicker
                      deadline={proj.deadline}
                      compact
                      accentColor={proj.accentColor}
                    />
                    <div className="w-full h-1.5 rounded-full bg-bg-primary overflow-hidden">
                      <div
                        className="h-full bg-accent-purple rounded-full"
                        style={{ width: `${prog}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <button
                        onClick={() => setActiveProjectId(proj.id)}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        Set Active
                      </button>
                      <Link
                        href={`/projects/${proj.id}`}
                        className="font-medium text-accent-sky hover:underline"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </AppShell>
  );
}
