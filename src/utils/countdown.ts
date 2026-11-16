import { differenceInSeconds, format, isPast, parseISO } from "date-fns";
import type { Milestone, Project } from "@/types";

export interface CountdownParts {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function calculateCountdown(deadlineIso: string, now: Date = new Date()): CountdownParts {
  const target = new Date(deadlineIso);
  if (Number.isNaN(target.getTime())) {
    return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const diff = differenceInSeconds(target, now);
  if (diff <= 0) {
    return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return {
    totalSeconds: diff,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

export function padZero(num: number): string {
  return String(Math.max(0, Math.floor(num))).padStart(2, "0");
}

export function calculateProjectProgress(project: Project): number {
  if (!project.milestones || project.milestones.length === 0) {
    return project.completed ? 100 : 0;
  }
  const done = project.milestones.filter((m) => m.completed).length;
  return Math.round((done / project.milestones.length) * 100);
}

export function formatDeadlineDate(deadlineIso: string): string {
  try {
    const d = new Date(deadlineIso);
    return format(d, "MMM d, yyyy · h:mm a");
  } catch {
    return deadlineIso;
  }
}

export function formatShortDate(isoDate: string): string {
  try {
    const parsed = isoDate.includes("T") ? parseISO(isoDate) : parseISO(`${isoDate}T12:00:00`);
    return format(parsed, "MMM d, yyyy");
  } catch {
    return isoDate;
  }
}

export function isMilestoneOverdue(milestone: Milestone): boolean {
  if (milestone.completed) return false;
  try {
    const due = parseISO(`${milestone.dueDate}T23:59:59`);
    return isPast(due);
  } catch {
    return false;
  }
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
