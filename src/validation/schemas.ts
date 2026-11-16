import { z } from "zod";

export const PrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export const CategorySchema = z.enum([
  "Academic",
  "Career",
  "Product Launch",
  "Fitness",
  "Creative",
  "Personal",
]);

export const MilestoneItemSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(2).max(260),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  tMinusLabel: z.string().min(2).max(16),
  priority: PrioritySchema,
  dailyTasks: z.array(z.string().min(1).max(140)).min(1).max(5),
});

export const GeneratedPlanSchema = z.object({
  projectTitle: z.string().min(2).max(100),
  description: z.string().min(4).max(300),
  deadline: z.string().min(8),
  category: CategorySchema,
  priority: PrioritySchema,
  motivationalQuote: z.string().min(4).max(160),
  milestones: z.array(MilestoneItemSchema).min(3).max(12),
});

export const PlannerApiResponseSchema = z.object({
  mode: z.enum(["clarify", "plan"]),
  reply: z.string().min(2),
  followUpQuestions: z.array(z.string()).optional(),
  plan: GeneratedPlanSchema.optional(),
});

export const ProjectFormSchema = z.object({
  title: z.string().min(2, "Project title must be at least 2 characters").max(100),
  description: z.string().min(4, "Provide a brief description").max(400),
  deadline: z.string().min(1, "Deadline date and time is required"),
  category: CategorySchema,
  priority: PrioritySchema,
});

export const ReminderFormSchema = z.object({
  projectId: z.string().min(1, "Select a project"),
  title: z.string().min(2, "Reminder title is required").max(120),
  notes: z.string().max(300).optional(),
  dateTime: z.string().min(1, "Date and time is required"),
  recurringDaily: z.boolean().default(false),
});

export type GeneratedPlanOutput = z.infer<typeof GeneratedPlanSchema>;
export type PlannerApiOutput = z.infer<typeof PlannerApiResponseSchema>;
