"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AppSettings, Milestone, Project, Reminder } from "@/types";
import {
  DEFAULT_SETTINGS,
  loadInitialState,
  saveActiveProjectId,
  saveProjects,
  saveReminders,
  saveSettings,
} from "@/lib/storage";
import { createInitialDemoProjects, createInitialDemoReminders } from "@/lib/demo-data";
import { generateId } from "@/utils/countdown";

interface DeadlineContextValue {
  hydrated: boolean;
  projects: Project[];
  reminders: Reminder[];
  settings: AppSettings;
  activeProjectId: string | null;
  activeProject: Project | null;
  setActiveProjectId: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt" | "completed">) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  addMilestone: (projectId: string, milestone: Omit<Milestone, "id" | "completed">) => void;
  updateMilestone: (projectId: string, milestoneId: string, patch: Partial<Milestone>) => void;
  deleteMilestone: (projectId: string, milestoneId: string) => void;
  addReminder: (reminder: Omit<Reminder, "id" | "createdAt" | "completed">) => Reminder;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  clearDemoData: () => void;
  restoreDemoData: () => void;
  resetAllData: () => void;
}

const DeadlineContext = createContext<DeadlineContextValue | null>(null);

export function DeadlineProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const initial = loadInitialState();
    setProjects(initial.projects);
    setReminders(initial.reminders);
    setSettings(initial.settings);
    setActiveProjectIdState(initial.activeProjectId);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !settings.inAppRemindersEnabled) return;
    const interval = setInterval(() => {
      const now = Date.now();
      reminders.forEach((rem) => {
        if (rem.completed || notifiedIdsRef.current.has(rem.id)) return;
        const targetTime = new Date(rem.dateTime).getTime();
        if (!Number.isNaN(targetTime) && targetTime <= now && now - targetTime < 120_000) {
          notifiedIdsRef.current.add(rem.id);
          toast.info(`Reminder: ${rem.title}`, {
            description: rem.notes || "Scheduled accountability check-in is due now.",
            duration: 8000,
          });
        }
      });
    }, 15_000);

    return () => clearInterval(interval);
  }, [hydrated, reminders, settings.inAppRemindersEnabled]);

  const setActiveProjectId = useCallback((id: string) => {
    setActiveProjectIdState(id);
    saveActiveProjectId(id);
  }, []);

  const addProject = useCallback(
    (input: Omit<Project, "id" | "createdAt" | "completed">) => {
      const newProject: Project = {
        ...input,
        id: generateId("proj"),
        createdAt: new Date().toISOString(),
        completed: false,
        isDemo: false,
      };
      setProjects((prev) => {
        const next = [newProject, ...prev];
        saveProjects(next);
        return next;
      });
      setActiveProjectIdState(newProject.id);
      saveActiveProjectId(newProject.id);
      return newProject;
    },
    []
  );

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      saveProjects(next);
      return next;
    });
  }, []);

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => {
        const next = prev.filter((p) => p.id !== id);
        saveProjects(next);
        if (activeProjectId === id) {
          const fallback = next[0]?.id ?? null;
          setActiveProjectIdState(fallback);
          saveActiveProjectId(fallback);
        }
        return next;
      });
      setReminders((prev) => {
        const next = prev.filter((r) => r.projectId !== id);
        saveReminders(next);
        return next;
      });
    },
    [activeProjectId]
  );

  const toggleMilestone = useCallback((projectId: string, milestoneId: string) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id !== projectId) return p;
        const milestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const allDone = milestones.length > 0 && milestones.every((m) => m.completed);
        return { ...p, milestones, completed: allDone };
      });
      saveProjects(next);
      return next;
    });
  }, []);

  const addMilestone = useCallback(
    (projectId: string, milestone: Omit<Milestone, "id" | "completed">) => {
      const created: Milestone = {
        ...milestone,
        id: generateId("ms"),
        completed: false,
      };
      setProjects((prev) => {
        const next = prev.map((p) =>
          p.id === projectId
            ? { ...p, completed: false, milestones: [...p.milestones, created] }
            : p
        );
        saveProjects(next);
        return next;
      });
    },
    []
  );

  const updateMilestone = useCallback(
    (projectId: string, milestoneId: string, patch: Partial<Milestone>) => {
      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id !== projectId) return p;
          const milestones = p.milestones.map((m) =>
            m.id === milestoneId ? { ...m, ...patch } : m
          );
          return { ...p, milestones };
        });
        saveProjects(next);
        return next;
      });
    },
    []
  );

  const deleteMilestone = useCallback((projectId: string, milestoneId: string) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id !== projectId) return p;
        return { ...p, milestones: p.milestones.filter((m) => m.id !== milestoneId) };
      });
      saveProjects(next);
      return next;
    });
  }, []);

  const addReminder = useCallback((input: Omit<Reminder, "id" | "createdAt" | "completed">) => {
    const created: Reminder = {
      ...input,
      id: generateId("rem"),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => {
      const next = [created, ...prev];
      saveReminders(next);
      return next;
    });
    return created;
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
      saveReminders(next);
      return next;
    });
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveReminders(next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const clearDemoData = useCallback(() => {
    setProjects((prev) => {
      const next = prev.filter((p) => !p.isDemo);
      saveProjects(next);
      const fallback = next[0]?.id ?? null;
      setActiveProjectIdState(fallback);
      saveActiveProjectId(fallback);
      return next;
    });
    setReminders((prev) => {
      const next = prev.filter((r) => !r.id.startsWith("demo_"));
      saveReminders(next);
      return next;
    });
  }, []);

  const restoreDemoData = useCallback(() => {
    const demos = createInitialDemoProjects();
    const demoRems = createInitialDemoReminders();
    setProjects((prev) => {
      const nonDemo = prev.filter((p) => !p.isDemo);
      const next = [...nonDemo, ...demos];
      saveProjects(next);
      if (!activeProjectId && next[0]) {
        setActiveProjectIdState(next[0].id);
        saveActiveProjectId(next[0].id);
      }
      return next;
    });
    setReminders((prev) => {
      const nonDemo = prev.filter((r) => !r.id.startsWith("demo_"));
      const next = [...nonDemo, ...demoRems];
      saveReminders(next);
      return next;
    });
  }, [activeProjectId]);

  const resetAllData = useCallback(() => {
    const demos = createInitialDemoProjects();
    const demoRems = createInitialDemoReminders();
    setProjects(demos);
    setReminders(demoRems);
    setSettings(DEFAULT_SETTINGS);
    setActiveProjectIdState(demos[0]?.id ?? null);
    saveProjects(demos);
    saveReminders(demoRems);
    saveSettings(DEFAULT_SETTINGS);
    saveActiveProjectId(demos[0]?.id ?? null);
  }, []);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? projects[0] ?? null;

  return (
    <DeadlineContext.Provider
      value={{
        hydrated,
        projects,
        reminders,
        settings,
        activeProjectId: activeProject?.id ?? null,
        activeProject,
        setActiveProjectId,
        addProject,
        updateProject,
        deleteProject,
        toggleMilestone,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addReminder,
        toggleReminder,
        deleteReminder,
        updateSettings,
        clearDemoData,
        restoreDemoData,
        resetAllData,
      }}
    >
      {children}
    </DeadlineContext.Provider>
  );
}

export function useDeadlineStore() {
  const ctx = useContext(DeadlineContext);
  if (!ctx) throw new Error("useDeadlineStore must be used inside DeadlineProvider");
  return ctx;
}
