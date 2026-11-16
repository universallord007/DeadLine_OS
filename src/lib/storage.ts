import type { AppSettings, Project, Reminder } from "@/types";
import { createInitialDemoProjects, createInitialDemoReminders } from "./demo-data";

const KEYS = {
  PROJECTS: "deadline_os_projects_v1",
  REMINDERS: "deadline_os_reminders_v1",
  SETTINGS: "deadline_os_settings_v1",
  ACTIVE_PROJECT_ID: "deadline_os_active_project_v1",
  INITIALIZED: "deadline_os_initialized_v1",
};

export const DEFAULT_SETTINGS: AppSettings = {
  userName: "Alex",
  defaultWallpaperFormat: "mobile",
  inAppRemindersEnabled: true,
  soundAlertsEnabled: false,
  reducedMotionOverride: false,
  compactSidebar: false,
};

export function loadInitialState(): {
  projects: Project[];
  reminders: Reminder[];
  settings: AppSettings;
  activeProjectId: string | null;
} {
  if (typeof window === "undefined") {
    return {
      projects: [],
      reminders: [],
      settings: DEFAULT_SETTINGS,
      activeProjectId: null,
    };
  }

  try {
    const initialized = window.localStorage.getItem(KEYS.INITIALIZED);
    if (!initialized) {
      const demoProjects = createInitialDemoProjects();
      const demoReminders = createInitialDemoReminders();
      window.localStorage.setItem(KEYS.PROJECTS, JSON.stringify(demoProjects));
      window.localStorage.setItem(KEYS.REMINDERS, JSON.stringify(demoReminders));
      window.localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      window.localStorage.setItem(KEYS.ACTIVE_PROJECT_ID, demoProjects[0]?.id ?? "");
      window.localStorage.setItem(KEYS.INITIALIZED, "true");
      return {
        projects: demoProjects,
        reminders: demoReminders,
        settings: DEFAULT_SETTINGS,
        activeProjectId: demoProjects[0]?.id ?? null,
      };
    }

    const rawProjects = window.localStorage.getItem(KEYS.PROJECTS);
    const rawReminders = window.localStorage.getItem(KEYS.REMINDERS);
    const rawSettings = window.localStorage.getItem(KEYS.SETTINGS);
    const activeId = window.localStorage.getItem(KEYS.ACTIVE_PROJECT_ID);

    const projects: Project[] = rawProjects ? JSON.parse(rawProjects) : [];
    const reminders: Reminder[] = rawReminders ? JSON.parse(rawReminders) : [];
    const settings: AppSettings = rawSettings
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) }
      : DEFAULT_SETTINGS;

    return {
      projects,
      reminders,
      settings,
      activeProjectId: activeId && projects.some((p) => p.id === activeId)
        ? activeId
        : projects[0]?.id ?? null,
    };
  } catch {
    return {
      projects: [],
      reminders: [],
      settings: DEFAULT_SETTINGS,
      activeProjectId: null,
    };
  }
}

export function saveProjects(projects: Project[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  }
}

export function saveReminders(reminders: Reminder[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  }
}

export function saveSettings(settings: AppSettings) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
}

export function saveActiveProjectId(id: string | null) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.ACTIVE_PROJECT_ID, id ?? "");
  }
}
