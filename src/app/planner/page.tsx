"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useDeadlineStore } from "@/hooks/useDeadlineStore";
import type { ChatMessage, Milestone } from "@/types";
import { generateId } from "@/utils/countdown";

const SAMPLE_PROMPTS = [
  "I have my final examination on December 15. I need to finish five subjects and revise everything before the exam. I can study 3 hours daily.",
  "I am launching my SaaS MVP in 21 days and need milestones for beta testing, landing page copy, billing setup, and Product Hunt launch.",
  "I want to prepare for a 10K charity run 6 weeks from today with 4 training days per week.",
];

export default function AIPlannerPage() {
  const router = useRouter();
  const { addProject } = useDeadlineStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Tell me about your upcoming goal or deadline. Include your target date, current progress, and how much time you can dedicate each day—I will work backward from T-0 to architect your milestone schedule.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDemoBanner, setIsDemoBanner] = useState(false);
  const [draftPlan, setDraftPlan] = useState<ChatMessage["generatedPlan"] | null>(null);
  const [editableMilestones, setEditableMilestones] = useState<Milestone[]>([]);

  const callPlannerApi = async (
    nextMessages: ChatMessage[],
    options?: { forceGenerate?: boolean; regenerateContext?: string }
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          forceGenerate: options?.forceGenerate,
          regenerateContext: options?.regenerateContext,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to generate plan");
      }

      setIsDemoBanner(Boolean(json.isDemo));
      const payload = json.data;

      const assistantMsg: ChatMessage = {
        id: generateId("msg"),
        role: "assistant",
        content: payload.followUpQuestions?.length
          ? `${payload.reply}\n\n• ${payload.followUpQuestions.join("\n• ")}`
          : payload.reply,
        timestamp: new Date().toISOString(),
        isDemoResponse: Boolean(json.isDemo),
        generatedPlan: payload.plan,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (payload.mode === "plan" && payload.plan) {
        setDraftPlan(payload.plan);
        setEditableMilestones(
          payload.plan.milestones.map((m: Omit<Milestone, "id" | "completed">) => ({
            ...m,
            id: generateId("ms"),
            completed: false,
          }))
        );
        toast.success("Backward milestone roadmap generated!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Planner request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (customText?: string, forceGenerate = false) => {
    const text = (customText ?? input).trim();
    if (!text && !forceGenerate) return;

    const userMsg: ChatMessage = {
      id: generateId("msg"),
      role: "user",
      content: text || "Generate the complete backward milestone plan now.",
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    if (!customText) setInput("");
    await callPlannerApi(updated, { forceGenerate });
  };

  const handleUpdateDraftMilestone = (id: string, patch: Partial<Milestone>) => {
    setEditableMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  };

  const handleDeleteDraftMilestone = (id: string) => {
    setEditableMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveProject = () => {
    if (!draftPlan) return;
    if (editableMilestones.length === 0) {
      toast.error("Keep at least one milestone before saving");
      return;
    }

    const created = addProject({
      title: draftPlan.projectTitle,
      description: draftPlan.description,
      deadline: draftPlan.deadline,
      category: draftPlan.category,
      priority: draftPlan.priority,
      accentColor: "#A78BFA",
      milestones: editableMilestones,
    });

    toast.success("Project added to DEADLINE OS!");
    router.push(`/projects/${created.id}`);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-purple" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-purple">
                Gemini AI Execution Architect
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              AI Milestone Planner
            </h1>
          </div>

          {isDemoBanner && (
            <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              Demo Fallback Active — Set <code className="font-mono">GEMINI_API_KEY</code> in{" "}
              <code className="font-mono">.env.local</code> for live Gemini responses.
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-left text-xs px-3 py-2 rounded-xl bg-bg-card hover:bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary transition max-w-md truncate"
            >
              “{prompt}”
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl bg-bg-card border border-border-subtle flex flex-col h-[620px]">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <span className="text-xs font-semibold">Planning Assistant</span>
              <button
                onClick={() => handleSend("Generate my milestone plan now.", true)}
                disabled={loading || messages.length < 2}
                className="text-xs font-mono text-accent-purple hover:underline disabled:opacity-40"
              >
                Force Generate Plan →
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                      m.role === "user"
                        ? "bg-accent-purple text-bg-primary font-medium"
                        : "bg-bg-elevated border border-border-subtle text-text-primary"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-text-secondary p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent-purple" />
                  <span>Architecting backward timeline...</span>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-border-subtle flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your goal, deadline & daily hours..."
                className="flex-1 rounded-xl bg-bg-primary border border-border-subtle px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 rounded-xl bg-accent-purple text-bg-primary font-semibold disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-bg-card border border-border-subtle p-6 flex flex-col justify-between min-h-[620px]">
            {!draftPlan ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 border border-accent-purple/25 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent-purple" />
                </div>
                <h3 className="text-lg font-semibold">Your Backward Timeline Will Appear Here</h3>
                <p className="text-sm text-text-secondary max-w-md">
                  Share your deadline in the chat on the left. Once generated, you can edit
                  milestone titles, adjust calendar dates, or regenerate before saving.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-accent-sky">
                      {draftPlan.category} • {draftPlan.priority} priority
                    </span>
                    <h2 className="text-xl font-bold mt-0.5">{draftPlan.projectTitle}</h2>
                    <p className="text-xs text-text-secondary mt-1">{draftPlan.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        callPlannerApi(messages, {
                          forceGenerate: true,
                          regenerateContext: "Provide an alternative pacing breakdown.",
                        })
                      }
                      disabled={loading}
                      className="px-3 py-2 rounded-xl bg-bg-elevated border border-border-strong text-xs font-medium flex items-center gap-1.5 hover:bg-white/10"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                    <button
                      onClick={handleSaveProject}
                      className="px-4 py-2 rounded-xl bg-accent-emerald text-bg-primary text-xs font-bold flex items-center gap-1.5 shadow-glow"
                    >
                      <Check className="w-4 h-4" />
                      Save Project
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {editableMilestones.map((ms) => (
                    <motion.div
                      key={ms.id}
                      layout
                      className="rounded-xl bg-bg-primary/70 border border-border-subtle p-4 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="px-2 py-0.5 rounded bg-accent-purple/15 text-accent-purple font-mono text-xs font-bold">
                            {ms.tMinusLabel}
                          </span>
                          <input
                            value={ms.title}
                            onChange={(e) =>
                              handleUpdateDraftMilestone(ms.id, { title: e.target.value })
                            }
                            className="bg-transparent font-semibold text-sm flex-1 focus:outline-none focus:border-b focus:border-accent-purple"
                          />
                        </div>
                        <input
                          type="date"
                          value={ms.dueDate}
                          onChange={(e) =>
                            handleUpdateDraftMilestone(ms.id, { dueDate: e.target.value })
                          }
                          className="bg-bg-card border border-border-subtle rounded-lg px-2 py-1 text-xs font-mono"
                        />
                        <button
                          onClick={() => handleDeleteDraftMilestone(ms.id)}
                          className="p-1.5 text-text-muted hover:text-accent-rose"
                          title="Delete milestone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        value={ms.description}
                        onChange={(e) =>
                          handleUpdateDraftMilestone(ms.id, { description: e.target.value })
                        }
                        className="w-full bg-transparent text-xs text-text-secondary focus:outline-none"
                      />

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ms.dailyTasks.map((task, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-bg-card border border-border-subtle text-text-secondary"
                          >
                            • {task}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setEditableMilestones((prev) => [
                      ...prev,
                      {
                        id: generateId("ms"),
                        title: "New Custom Milestone",
                        description: "Actionable checkpoint before final deadline.",
                        dueDate: draftPlan.deadline.slice(0, 10),
                        tMinusLabel: `T-${prev.length + 1}`,
                        completed: false,
                        priority: "medium",
                        dailyTasks: ["Complete focused 60m session"],
                      },
                    ])
                  }
                  className="text-xs font-medium text-accent-sky hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Milestone Row
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
