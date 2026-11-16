"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addHours, format } from "date-fns";
import { Bell, Calendar, CheckCircle2, Circle, Repeat, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useDeadlineStore } from "@/hooks/useDeadlineStore";
import { ReminderFormSchema } from "@/validation/schemas";
import { formatDeadlineDate } from "@/utils/countdown";

interface ReminderFormValues {
  projectId: string;
  title: string;
  notes?: string;
  dateTime: string;
  recurringDaily: boolean;
}

export default function RemindersPage() {
  const { projects, reminders, addReminder, toggleReminder, deleteReminder } =
    useDeadlineStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(ReminderFormSchema),
    defaultValues: {
      projectId: projects[0]?.id ?? "",
      title: "",
      notes: "",
      dateTime: format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
      recurringDaily: false,
    },
  });

  const onSubmit = (values: ReminderFormValues) => {
    addReminder({
      projectId: values.projectId || projects[0]?.id || "general",
      title: values.title,
      notes: values.notes,
      dateTime: new Date(values.dateTime).toISOString(),
      recurringDaily: values.recurringDaily,
    });
    toast.success("Accountability reminder scheduled");
    reset({
      projectId: values.projectId,
      title: "",
      notes: "",
      dateTime: format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
      recurringDaily: false,
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent-sky">
            Accountability Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Reminders & Check-Ins
          </h1>
        </div>

        <div className="rounded-2xl bg-bg-card border border-border-subtle p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-secondary">
          <div className="flex items-start gap-2.5">
            <Bell className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
            <span>
              In-app toast alerts trigger automatically while DEADLINE OS is open. For true
              background push notifications when the browser is closed, connect a persistent
              database + Web Push provider to the included{" "}
              <code className="font-mono text-text-primary">/api/cron/reminders</code> endpoint.
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle font-mono text-[11px] shrink-0">
            <Calendar className="w-3.5 h-3.5 text-accent-sky" />
            Google Calendar OAuth: Optional
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-5 rounded-2xl bg-bg-card border border-border-subtle p-6 space-y-4 h-fit"
          >
            <h2 className="text-base font-semibold">Schedule New Reminder</h2>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Associated Project</label>
              <select
                {...register("projectId")}
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3 py-2.5 text-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Reminder Title</label>
              <input
                {...register("title")}
                placeholder="e.g., Evening 90m Past Paper Drill"
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3.5 py-2.5 text-xs"
              />
              {errors.title && (
                <p className="text-xs text-accent-rose mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Date & Time</label>
              <input
                type="datetime-local"
                {...register("dateTime")}
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3.5 py-2.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Notes (Optional)</label>
              <textarea
                {...register("notes")}
                rows={2}
                placeholder="Focus target or checklist item..."
                className="w-full rounded-xl bg-bg-primary border border-border-subtle px-3.5 py-2 text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                {...register("recurringDaily")}
                className="accent-accent-purple"
              />
              Repeat daily at this time
            </label>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-accent-purple text-bg-primary font-semibold text-xs shadow-glow"
            >
              Create Reminder
            </button>
          </form>

          <div className="lg:col-span-7 rounded-2xl bg-bg-card border border-border-subtle p-6 space-y-3">
            <h2 className="text-base font-semibold mb-2">
              Scheduled Reminders ({reminders.length})
            </h2>

            {reminders.length === 0 ? (
              <p className="text-sm text-text-secondary py-10 text-center">
                No reminders configured yet.
              </p>
            ) : (
              reminders.map((rem) => {
                const proj = projects.find((p) => p.id === rem.projectId);
                return (
                  <div
                    key={rem.id}
                    className="p-4 rounded-xl bg-bg-primary/60 border border-border-subtle flex items-start justify-between gap-3"
                  >
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className="flex items-start gap-3 text-left flex-1 min-w-0"
                    >
                      {rem.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-accent-sky shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              rem.completed ? "line-through text-text-muted" : ""
                            }`}
                          >
                            {rem.title}
                          </span>
                          {rem.recurringDaily && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-accent-purple/15 text-accent-purple">
                              <Repeat className="w-3 h-3" />
                              Daily
                            </span>
                          )}
                        </div>
                        {rem.notes && (
                          <p className="text-xs text-text-secondary mt-1">{rem.notes}</p>
                        )}
                        <div className="text-[11px] font-mono text-text-muted mt-1.5">
                          {formatDeadlineDate(rem.dateTime)}
                          {proj ? ` • ${proj.title}` : ""}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        deleteReminder(rem.id);
                        toast.info("Reminder deleted");
                      }}
                      className="p-1.5 text-text-muted hover:text-accent-rose"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
