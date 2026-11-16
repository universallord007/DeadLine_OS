export type PriorityLevel = "low" | "medium" | "high" | "critical";

export type GoalCategory =
  | "Academic"
  | "Career"
  | "Product Launch"
  | "Fitness"
  | "Creative"
  | "Personal";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  tMinusLabel: string; // e.g., "T-14"
  completed: boolean;
  priority: PriorityLevel;
  dailyTasks: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO datetime string
  category: GoalCategory;
  priority: PriorityLevel;
  milestones: Milestone[];
  completed: boolean;
  createdAt: string;
  isDemo?: boolean;
  accentColor?: string;
}

export interface Reminder {
  id: string;
  projectId: string;
  title: string;
  notes?: string;
  dateTime: string; // ISO datetime
  recurringDaily: boolean;
  completed: boolean;
  createdAt: string;
}

export type WallpaperTemplateId =
  | "minimal-dark"
  | "midnight-purple"
  | "cyberpunk-neon"
  | "clean-apple"
  | "productivity-grid"
  | "aurora-gradient"
  | "minimal-white"
  | "futuristic-glass";

export type WallpaperFormatId = "mobile" | "desktop" | "tablet" | "custom";

export type CountdownDisplayStyle = "stacked" | "inline-colon" | "days-hero" | "minimal-pill";

export type CheckboxStyle = "square" | "circle" | "diamond" | "dash";

export type FontChoice = "sans" | "mono" | "serif";

export interface WallpaperConfig {
  projectId: string;
  template: WallpaperTemplateId;
  format: WallpaperFormatId;
  customWidth: number;
  customHeight: number;
  bgColor: string;
  useGradient: boolean;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  textColor: string;
  fontFamily: FontChoice;
  fontScale: number; // 0.8 to 1.3
  countdownStyle: CountdownDisplayStyle;
  customTitle: string;
  subtitle: string;
  showMilestones: boolean;
  maxMilestones: number;
  checkboxStyle: CheckboxStyle;
  showMotivationalQuote: boolean;
  motivationalQuote: string;
  clockSafeTopPadding: number; // percentage 12 - 38
  showProgressBar: boolean;
  showBadge: boolean;
}

export interface AppSettings {
  userName: string;
  defaultWallpaperFormat: WallpaperFormatId;
  inAppRemindersEnabled: boolean;
  soundAlertsEnabled: boolean;
  reducedMotionOverride: boolean;
  compactSidebar: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isDemoResponse?: boolean;
  generatedPlan?: {
    projectTitle: string;
    description: string;
    deadline: string;
    category: GoalCategory;
    priority: PriorityLevel;
    motivationalQuote: string;
    milestones: Omit<Milestone, "id" | "completed">[];
  };
}
