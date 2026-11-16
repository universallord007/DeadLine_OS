"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Edit3,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { CountdownTicker } from "@/components/dashboard/CountdownTicker";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { useDeadlineStore } from "@/hooks/useDeadlineStore";
import { calculateProjectProgress, formatDeadlineDate, formatShortDate } from "@/utils/countdown";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    projects,
    toggleMilestone,
    addMilestone,
    deleteMilestone,
    deleteProject,
    reminders,
  } = useDeadlineStore();

  const project = projects.find((p) => p.id === params.id);
  const [editOpen, setEditOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDue, setNewDue] = useState(format(new Date(), "yyyy-MM-dd"));

  if (!project) {
    return (
      <AppShell>
        <div className="rounded-2xl bg-bg-card border border-border-subtle p-10 text-center space-y-3">
          <h2 className="text-lg font-semibold">Project Not Found</h2>
          <Link href="/dashboard" className="text-xs text-accent-purple hover:underline">
            ← Return to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const progress = calculateProjectProgress(project);
  const projectReminders = reminders.filter((r) => r.projectId === project.id);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addMilestone(project.id, {
      title: newTitle.trim(),
      description: newDesc.trim() || "Milestone execution checkpoint",
      dueDate: newDue,
      tMinusLabel: `T-${project.milestones.length + 1}`,
      priority: "high",
      dailyTasks: ["Focus on milestone deliverable"],
    });
    setNewTitle("");
    setNewDesc("");
    toast.success("Milestone added");
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    toast.success("Project deleted");
    router.push("/dashboard");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/wallpaper?projectId=${project.id}`}
              className="px-3.5 py-2 rounded-xl bg-accent-purple text-bg-primary text-xs font-semibold flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Lock Screen Studio
            </Link>
            <button
              onClick={() => setEditOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-bg-card border border-border-strong text-xs font-medium flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleDeleteProject}
              className="px-3.5 py-2 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs font-medium flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-bg-card border border-border-subtle p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-accent-purple/15 text-accent-purple">
                {project.category} • {project.priority}
              </span>
              <span className="text-xs text-text-muted">
                Due {formatDeadlineDate(project.deadline)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
            <p className="text-sm text-text-secondary">{project.description}</p>
            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">Completion Progress</span>
                <span className="font-mono font-bold text-accent-emerald">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-bg-primary overflow-hidden">
                <div
                  className="h-full bg-accent-emerald transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <CountdownTicker deadline={project.deadline} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl bg-bg-card border border-border-subtle p-6 space-y-4">
            <h2 className="text-base font-semibold">Milestone Timeline</h2>
            <div className="space-y-3">
              {project.milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="p-4 rounded-xl bg-bg-primary/60 border border-border-subtle flex items-start justify-between gap-3"
                >
                  <button
                    onClick={() => toggleMilestone(project.id, ms.id)}
                    className="flex items-start gap-3 text-left flex-1"
                  >
                    {ms.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-accent-purple shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-accent-purple font-bold">
                          {ms.tMinusLabel}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            ms.completed ? "line-through text-text-muted" : ""
                          }`}
                        >
                          {ms.title}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">{ms.description}</p>
                      <span className="text-[11px] font-mono text-text-muted mt-1.5 inline-block">
                        Target: {formatShortDate(ms.dueDate)}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteMilestone(project.id, ms.id)}
                    className="p-1.5 text-text-muted hover:text-accent-rose"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <form
              onSubmit={handleAddMilestone}
              className="rounded-2xl bg-bg-card border border-border-subtle p-5 space-y-3"
            >
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-accent-purple" />
                Add Milestone
              </h3>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Milestone title"
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs"
              />
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Actionable description"
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs"
              />
              <input
                type="date"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs font-mono"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-accent-purple text-bg-primary text-xs font-semibold"
              >
                Add to Timeline
              </button>
            </form>

            <div className="rounded-2xl bg-bg-card border border-border-subtle p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Project Reminders</h3>
                <Link href="/reminders" className="text-xs text-accent-sky hover:underline">
                  Manage
                </Link>
              </div>
              {projectReminders.length === 0 ? (
                <p className="text-xs text-text-muted">No reminders linked yet.</p>
              ) : (
                <ul className="space-y-2 text-xs">
                  {projectReminders.map((r) => (
                    <li
                      key={r.id}
                      className="p-2.5 rounded-lg bg-bg-primary/60 border border-border-subtle"
                    >
                      <div className="font-medium">{r.title}</div>
                      <div className="text-text-muted font-mono text-[11px]">
                        {formatDeadlineDate(r.dateTime)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProjectModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        existingProject={project}
      />
    </AppShell>
  );
}
