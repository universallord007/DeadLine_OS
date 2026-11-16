import type { WallpaperConfig, WallpaperFormatId, WallpaperTemplateId } from "@/types";

export interface WallpaperTemplateMeta {
  id: WallpaperTemplateId;
  name: string;
  tagline: string;
  bgColor: string;
  useGradient: boolean;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  textColor: string;
  fontFamily: "sans" | "mono" | "serif";
}

export const WALLPAPER_TEMPLATES: WallpaperTemplateMeta[] = [
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    tagline: "Obsidian precision with razor-sharp contrast",
    bgColor: "#09090B",
    useGradient: false,
    gradientFrom: "#09090B",
    gradientTo: "#18181B",
    accentColor: "#FAFAFA",
    textColor: "#FAFAFA",
    fontFamily: "sans",
  },
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    tagline: "Signature DEADLINE OS violet luminescence",
    bgColor: "#0B0814",
    useGradient: true,
    gradientFrom: "#09090B",
    gradientTo: "#1E1338",
    accentColor: "#A78BFA",
    textColor: "#FAFAFA",
    fontFamily: "sans",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    tagline: "High-voltage cyan & electric telemetry",
    bgColor: "#050811",
    useGradient: true,
    gradientFrom: "#050811",
    gradientTo: "#0C1E35",
    accentColor: "#38BDF8",
    textColor: "#F0F9FF",
    fontFamily: "mono",
  },
  {
    id: "clean-apple",
    name: "Clean Apple-Inspired",
    tagline: "Balanced slate elegance with soft depth",
    bgColor: "#111215",
    useGradient: true,
    gradientFrom: "#16181D",
    gradientTo: "#0C0D10",
    accentColor: "#60A5FA",
    textColor: "#F8FAFC",
    fontFamily: "sans",
  },
  {
    id: "productivity-grid",
    name: "Productivity Grid",
    tagline: "Architectural blueprint matrix & emerald accents",
    bgColor: "#0A0D0C",
    useGradient: false,
    gradientFrom: "#0A0D0C",
    gradientTo: "#101916",
    accentColor: "#34D399",
    textColor: "#ECFDF5",
    fontFamily: "mono",
  },
  {
    id: "aurora-gradient",
    name: "Aurora Gradient",
    tagline: "Boreal violet-to-teal ambient horizon",
    bgColor: "#090B14",
    useGradient: true,
    gradientFrom: "#191236",
    gradientTo: "#0B2936",
    accentColor: "#C084FC",
    textColor: "#FAFAFA",
    fontFamily: "sans",
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    tagline: "Gallery-grade alabaster & architectural ink",
    bgColor: "#F4F4F6",
    useGradient: true,
    gradientFrom: "#FFFFFF",
    gradientTo: "#E4E4E7",
    accentColor: "#18181B",
    textColor: "#09090B",
    fontFamily: "sans",
  },
  {
    id: "futuristic-glass",
    name: "Futuristic Glass",
    tagline: "Frosted translucent HUD cards on deep space",
    bgColor: "#090A10",
    useGradient: true,
    gradientFrom: "#0E101D",
    gradientTo: "#18122B",
    accentColor: "#818CF8",
    textColor: "#FAFAFA",
    fontFamily: "sans",
  },
];

export interface WallpaperFormatSpec {
  id: WallpaperFormatId;
  label: string;
  ratioLabel: string;
  width: number;
  height: number;
  description: string;
}

export const WALLPAPER_FORMATS: WallpaperFormatSpec[] = [
  {
    id: "mobile",
    label: "Mobile Lock Screen",
    ratioLabel: "9:16",
    width: 1170,
    height: 2532,
    description: "iPhone & Android flagship lock screen (clock-safe top margin)",
  },
  {
    id: "desktop",
    label: "Desktop Wallpaper",
    ratioLabel: "16:9",
    width: 2560,
    height: 1440,
    description: "macOS & Windows QHD widescreen monitor",
  },
  {
    id: "tablet",
    label: "Tablet / iPad",
    ratioLabel: "4:3",
    width: 2048,
    height: 2732,
    description: "iPad Pro portrait lock screen",
  },
  {
    id: "custom",
    label: "Custom Dimensions",
    ratioLabel: "Custom",
    width: 1080,
    height: 1920,
    description: "Specify exact pixel width and height",
  },
];

export function createDefaultWallpaperConfig(
  projectId: string,
  title = "FINAL EXAMINATION",
  subtitle = "T-MINUS COUNTDOWN",
  quote = "One day at a time. One goal at a time.",
  format: WallpaperFormatId = "mobile"
): WallpaperConfig {
  const tpl = WALLPAPER_TEMPLATES[1]; // Midnight Purple default
  return {
    projectId,
    template: tpl.id,
    format,
    customWidth: 1170,
    customHeight: 2532,
    bgColor: tpl.bgColor,
    useGradient: tpl.useGradient,
    gradientFrom: tpl.gradientFrom,
    gradientTo: tpl.gradientTo,
    accentColor: tpl.accentColor,
    textColor: tpl.textColor,
    fontFamily: tpl.fontFamily,
    fontScale: 1,
    countdownStyle: "stacked",
    customTitle: title,
    subtitle,
    showMilestones: true,
    maxMilestones: 5,
    checkboxStyle: "square",
    showMotivationalQuote: true,
    motivationalQuote: quote,
    clockSafeTopPadding: format === "mobile" ? 26 : format === "tablet" ? 20 : 12,
    showProgressBar: true,
    showBadge: true,
  };
}
