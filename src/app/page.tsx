"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock,
  Layers,
  Smartphone,
  Sparkles,
  Target,
} from "lucide-react";
import { addDays } from "date-fns";
import { calculateCountdown, padZero } from "@/utils/countdown";

export default function LandingPage() {
  const [demoTarget] = useState(() => addDays(new Date(), 14).toISOString());
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const cd = calculateCountdown(demoTarget, now);

  const features = [
    {
      icon: Sparkles,
      title: "Gemini AI Backward Planner",
      desc: "Describe your deadline in plain language. Gemini asks clarifying questions and engineers a realistic T-minus milestone roadmap.",
      accent: "text-accent-purple",
    },
    {
      icon: Smartphone,
      title: "Countdown Lock Screen Studio",
      desc: "Design clock-safe 9:16 mobile and 16:9 desktop wallpapers featuring your live countdown, checklist milestones, and custom themes.",
      accent: "text-accent-sky",
    },
    {
      icon: Target,
      title: "Interactive T-Minus Timelines",
      desc: "Track daily tasks, edit dates, reorder priorities, and watch real-time completion percentages update across your workspace.",
      accent: "text-accent-emerald",
    },
    {
      icon: BellRing,
      title: "Accountability & Reminders",
      desc: "Schedule daily deep-work check-ins and milestone alerts with optional Vercel Cron architecture for background push delivery.",
      accent: "text-accent-amber",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Define Your Target Deadline",
      desc: "Enter an exam, product launch, or fitness race along with your available daily focus hours.",
    },
    {
      step: "02",
      title: "Generate Your AI Roadmap",
      desc: "DEADLINE OS works backward from T-0 to schedule concrete calendar milestones and daily actions.",
    },
    {
      step: "03",
      title: "Export Your Lock Screen",
      desc: "Render a crisp high-resolution PNG wallpaper so every glance at your phone reinforces your next milestone.",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      <div className="absolute inset-x-0 -top-40 h-[540px] bg-radial-glow pointer-events-none" />
      <div className="absolute right-0 top-32 w-[480px] h-[480px] bg-sky-glow pointer-events-none" />

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-sky flex items-center justify-center shadow-glow">
              <Clock className="w-4 h-4 text-bg-primary stroke-[2.5]" />
            </div>
            <span className="font-bold tracking-tight text-base">DEADLINE OS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-text-primary transition">
              How It Works
            </a>
            <Link href="/planner" className="hover:text-text-primary transition">
              AI Planner
            </Link>
            <Link href="/wallpaper" className="hover:text-text-primary transition">
              Lock Screen Studio
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-accent-purple hover:bg-accent-purple/90 text-bg-primary font-semibold text-sm transition shadow-glow"
            >
              Open Workspace
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-card border border-border-strong text-xs text-text-secondary">
              <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
              <span>Your Goals. Your Time. Your Moment.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.06]">
              Turn your deadlines into your{" "}
              <span className="bg-gradient-to-r from-accent-purple via-accent-sky to-accent-emerald bg-clip-text text-transparent">
                next achievement.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
              Plan smarter, visualize your progress, and stay accountable with an AI-powered
              countdown built around your goals. Generate backward milestone roadmaps and
              export high-resolution lock screen wallpapers in seconds.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-2xl bg-accent-purple hover:bg-accent-purple/90 text-bg-primary font-semibold text-sm flex items-center gap-2 shadow-glow transition"
              >
                Create Your Countdown
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="px-6 py-3.5 rounded-2xl bg-bg-card hover:bg-bg-elevated border border-border-strong text-text-primary font-medium text-sm transition"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="w-full max-w-[330px] rounded-[2.5rem] p-3 bg-gradient-to-b from-white/15 to-white/[0.03] border border-white/15 shadow-2xl">
              <div className="rounded-[2rem] bg-gradient-to-b from-[#09090B] via-[#120D24] to-[#1D1338] p-6 pt-12 border border-white/10 space-y-6">
                <div className="text-center text-white/40 font-mono text-xs tracking-widest">
                  09:41 • LOCK SCREEN PREVIEW
                </div>

                <div>
                  <div className="text-[10px] font-mono tracking-[0.25em] text-accent-purple uppercase">
                    T-MINUS COUNTDOWN
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight mt-1">
                    FINAL EXAMINATION
                  </h2>
                </div>

                <div className="font-mono space-y-0.5">
                  <div className="text-4xl font-black text-accent-purple">
                    {padZero(cd.days)} DAYS
                  </div>
                  <div className="text-xl font-bold text-white/90">
                    {padZero(cd.hours)} HOURS
                  </div>
                  <div className="text-base font-semibold text-white/65">
                    {padZero(cd.minutes)} MIN : {padZero(cd.seconds)} SEC
                  </div>
                </div>

                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-2.5">
                  <div className="text-[10px] font-mono tracking-widest text-accent-purple uppercase">
                    YOUR MILESTONES
                  </div>
                  {[
                    { text: "Complete remaining chapters", done: true },
                    { text: "Finish assignments", done: true },
                    { text: "Begin final revision", done: false },
                    { text: "Practice mock examinations", done: false },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2.5 text-xs">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          item.done ? "text-accent-emerald" : "text-white/30"
                        }`}
                      />
                      <span className={item.done ? "line-through text-white/45" : "text-white/90"}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] italic text-white/60 text-center">
                  &ldquo;One day at a time. One goal at a time.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-subtle">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-purple">
            Engineered For Execution
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
            Everything required to turn a date into a finished milestone.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-2xl bg-bg-card border border-border-subtle p-6 hover:border-border-strong transition"
              >
                <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
                  <Icon className={`w-5 h-5 ${feat.accent}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-subtle">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-sky">
            Workflow
          </span>
          <h2 className="text-3xl font-bold tracking-tight mt-2">
            From raw ambition to daily lock-screen focus.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="rounded-2xl bg-bg-secondary border border-border-subtle p-6">
              <div className="font-mono text-xs text-accent-purple font-bold mb-3">
                STEP {s.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border-subtle py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-purple" />
          <span>DEADLINE OS — Built for &ldquo;Your Deadline, Your Design&rdquo;</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-text-primary">
            Dashboard
          </Link>
          <Link href="/planner" className="hover:text-text-primary">
            AI Planner
          </Link>
          <Link href="/wallpaper" className="hover:text-text-primary">
            Wallpaper Studio
          </Link>
        </div>
      </footer>
    </div>
  );
}
