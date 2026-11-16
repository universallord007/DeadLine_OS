"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ProjectFormSchema } from "@/validation/schemas";
import type { GoalCategory, PriorityLevel, Project } from "@/types";
import { useDeadlineStore } from "@/hooks/useDeadlineStore";

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  existingProject?: Project;
}

interface FormValues {
  title: string;
  description: string;
  deadline: string;
  category: GoalCategory;
  priority: PriorityLevel;
}

export function ProjectModal({ open, onClose, existingProject }: ProjectModalProps) {
  const { addProject, updateProject } = useDeadlineStore();

  const defaultDeadline = format(addDays(new Date(), 14), "yyyy-MM-dd'T'09:00");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      title: existingProject?.title ?? "",
      description: existingProject?.description ?? "",
      deadline: existingProject
        ? format(new Date(existingProject.deadline), "yyyy-MM-dd'T'HH:mm")
        : defaultDeadline,
      category: existingProject?.category ?? "Academic",
      priority: existingProject?.priority ?? "high",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: existingProject?.title ?? "",
        description: existingProject?.description ?? "",
        deadline: existingProject
          ? format(new Date(existingProject.deadline), "yyyy-MM-dd'T'HH:mm")
          : defaultDeadline,
        category: existingProject?.category ?? "Academic",
        priority: existingProject?.priority ?? "high",
      });
    }
  }, [open, existingProject, reset, defaultDeadline]);

  if (!open) return null;

  const onSubmit = (values: FormValues) => {
    const isoDeadline = new Date(values.deadline).toISOString();
    if (existingProject) {
      updateProject(existingProject.id, {
        title: values.title,
        description: values.description,
        deadline: isoDeadline,
        category: values.category,
        priority: values.priority,
      });
      toast.success("Deadline project updated");
    } else {
      addProject({
        title: values.title,
        description: values.description,
        deadline: isoDeadline,
        category: values.category,
        priority: values.priority,
        accentColor: "#A78BFA",
        milestones: [
          {
            id: `ms_${Date.now()}_1`,
            title: "Define scope & baseline inventory",
            description: "Break down core deliverables and gather required resources.",
            dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
            tMinusLabel: "T-Init",
            completed: false,
            priority: "high",
            dailyTasks: ["Outline core sub-tasks", "Block 90m daily focus window"],
          },
          {
            id: `ms_${Date.now()}_2`,
            title: "Mid-point execution checkpoint",
            description: "Complete 60% of core work and review quality against target.",
            dueDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
            tMinusLabel: "T-Mid",
            completed: false,
            priority: "high",
            dailyTasks: ["Audit progress against timeline", "Resolve blockers"],
          },
          {
            id: `ms_${Date.now()}_3`,
            title: "Final polish & completion verification",
            description: "Verify every requirement before the final deadline.",
            dueDate: format(new Date(isoDeadline), "yyyy-MM-dd"),
            tMinusLabel: "T-1",
            completed: false,
            priority: "critical",
            dailyTasks: ["Run final checklist", "Prepare lock screen countdown"],
          },
        ],
      });
      toast.success("New deadline created");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-bg-card border border-border-strong p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold">
              {existingProject ? "Edit Deadline Project" : "Create New Deadline"}
            </h2>
            <p className="text-xs text-text-secondary">
              Set your target date, priority, and category.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Project / Goal Title
            </label>
            <input
              {...register("title")}
              placeholder="e.g., Final Examination or SaaS v2 Launch"
              className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
            />
            {errors.title && (
              <p className="text-xs text-accent-rose mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="What does completion look like?"
              className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
            />
            {errors.description && (
              <p className="text-xs text-accent-rose mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Target Deadline
              </label>
              <input
                type="datetime-local"
                {...register("deadline")}
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs focus:outline-none focus:border-accent-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs focus:outline-none focus:border-accent-purple"
              >
                <option value="Academic">Academic</option>
                <option value="Career">Career</option>
                <option value="Product Launch">Product Launch</option>
                <option value="Fitness">Fitness</option>
                <option value="Creative">Creative</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Priority
              </label>
              <select
                {...register("priority")}
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2 text-xs focus:outline-none focus:border-accent-purple"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-bg-elevated hover:bg-white/10 text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-purple text-bg-primary hover:bg-accent-purple/90"
            >
              {existingProject ? "Save Changes" : "Create Deadline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
