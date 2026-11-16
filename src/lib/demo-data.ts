import { addDays, format, setHours, setMinutes } from "date-fns";
import type { Project, Reminder } from "@/types";

export function createInitialDemoProjects(): Project[] {
  const now = new Date();

  const examDeadline = setMinutes(setHours(addDays(now, 14), 9), 0);
  const launchDeadline = setMinutes(setHours(addDays(now, 28), 18), 0);
  const marathonDeadline = setMinutes(setHours(addDays(now, 42), 6), 30);

  return [
    {
      id: "demo_proj_exam",
      title: "Final Computer Science Examinations",
      description:
        "Complete all five core subjects—Algorithms, Operating Systems, Distributed Systems, Databases, and ML—with full past-paper revision.",
      deadline: examDeadline.toISOString(),
      category: "Academic",
      priority: "critical",
      completed: false,
      createdAt: addDays(now, -4).toISOString(),
      isDemo: true,
      accentColor: "#A78BFA",
      milestones: [
        {
          id: "demo_m_1",
          title: "Complete Distributed Systems & OS lecture notes",
          description: "Summarize consensus protocols, Raft, and virtual memory paging.",
          dueDate: format(addDays(now, 2), "yyyy-MM-dd"),
          tMinusLabel: "T-12",
          completed: true,
          priority: "high",
          dailyTasks: [
            "Review Raft & Paxos state diagrams",
            "Solve 6 OS paging numerical problems",
          ],
        },
        {
          id: "demo_m_2",
          title: "Finish remaining Algorithms & Database chapters",
          description: "Cover dynamic programming, graph flows, and B+ tree indexing.",
          dueDate: format(addDays(now, 5), "yyyy-MM-dd"),
          tMinusLabel: "T-9",
          completed: true,
          priority: "high",
          dailyTasks: [
            "Implement 3 DP recurrence patterns",
            "Write SQL query optimization flashcards",
          ],
        },
        {
          id: "demo_m_3",
          title: "Submit all pending lab assignments & problem sets",
          description: "Finalize code submissions and verify automated test suites.",
          dueDate: format(addDays(now, 7), "yyyy-MM-dd"),
          tMinusLabel: "T-7",
          completed: false,
          priority: "critical",
          dailyTasks: [
            "Complete concurrency lock lab report",
            "Verify edge cases on graph assignment",
          ],
        },
        {
          id: "demo_m_4",
          title: "Begin timed full-syllabus revision cycle",
          description: "Active recall across all 5 subjects using condensed formula sheets.",
          dueDate: format(addDays(now, 10), "yyyy-MM-dd"),
          tMinusLabel: "T-4",
          completed: false,
          priority: "high",
          dailyTasks: [
            "2-hour morning active recall block",
            "Evening error log review",
          ],
        },
        {
          id: "demo_m_5",
          title: "Complete two full-length timed mock exams",
          description: "Simulate exam hall conditions and audit time-per-question pacing.",
          dueDate: format(addDays(now, 12), "yyyy-MM-dd"),
          tMinusLabel: "T-2",
          completed: false,
          priority: "critical",
          dailyTasks: [
            "Take 3-hour mock paper #1",
            "Re-solve missed proofs and edge cases",
          ],
        },
        {
          id: "demo_m_6",
          title: "Final light review & exam kit readiness",
          description: "Review high-yield cheat sheets, pack ID/calculators, sleep 8 hours.",
          dueDate: format(addDays(now, 13), "yyyy-MM-dd"),
          tMinusLabel: "T-1",
          completed: false,
          priority: "medium",
          dailyTasks: [
            "Skim key theorems for 60 minutes",
            "Stop studying by 7:00 PM for recovery",
          ],
        },
      ],
    },
    {
      id: "demo_proj_launch",
      title: "V2.0 SaaS Product Public Launch",
      description:
        "Ship AI workflow automation v2.0, complete security audit, publish Product Hunt assets, and onboard first 250 beta users.",
      deadline: launchDeadline.toISOString(),
      category: "Product Launch",
      priority: "high",
      completed: false,
      createdAt: addDays(now, -7).toISOString(),
      isDemo: true,
      accentColor: "#38BDF8",
      milestones: [
        {
          id: "demo_l_1",
          title: "Feature freeze & core API stabilization",
          description: "Lock v2 schema migrations and eliminate P0/P1 staging bugs.",
          dueDate: format(addDays(now, 7), "yyyy-MM-dd"),
          tMinusLabel: "T-21",
          completed: true,
          priority: "critical",
          dailyTasks: ["Run load test on webhook queue", "Close remaining UI polish tickets"],
        },
        {
          id: "demo_l_2",
          title: "Record interactive product demo & landing page",
          description: "Produce 90-second launch trailer and update pricing tiers.",
          dueDate: format(addDays(now, 16), "yyyy-MM-dd"),
          tMinusLabel: "T-12",
          completed: false,
          priority: "high",
          dailyTasks: ["Capture crisp 4K screen flows", "Deploy changelog & docs portal"],
        },
        {
          id: "demo_l_3",
          title: "Private beta stress test & telemetry audit",
          description: "Invite 50 power users and monitor latency, error rates, and onboarding.",
          dueDate: format(addDays(now, 23), "yyyy-MM-dd"),
          tMinusLabel: "T-5",
          completed: false,
          priority: "high",
          dailyTasks: ["Audit PostHog funnel drop-offs", "Verify Stripe live billing webhooks"],
        },
        {
          id: "demo_l_4",
          title: "Launch day war-room & community announcements",
          description: "Publish Product Hunt, X thread, and founder newsletter at 12:01 AM PT.",
          dueDate: format(addDays(now, 27), "yyyy-MM-dd"),
          tMinusLabel: "T-1",
          completed: false,
          priority: "critical",
          dailyTasks: ["Schedule social queue", "Confirm on-call support rotation"],
        },
      ],
    },
    {
      id: "demo_proj_marathon",
      title: "Sub-3:45 City Half-Marathon",
      description:
        "Progressive aerobic base, tempo intervals, and disciplined taper leading up to race morning.",
      deadline: marathonDeadline.toISOString(),
      category: "Fitness",
      priority: "medium",
      completed: false,
      createdAt: addDays(now, -10).toISOString(),
      isDemo: true,
      accentColor: "#34D399",
      milestones: [
        {
          id: "demo_f_1",
          title: "Complete 16km peak aerobic long run",
          description: "Maintain steady Zone 2 heart rate with electrolyte fueling practice.",
          dueDate: format(addDays(now, 14), "yyyy-MM-dd"),
          tMinusLabel: "T-28",
          completed: true,
          priority: "high",
          dailyTasks: ["45m easy recovery jog", "Mobility & calf eccentric routine"],
        },
        {
          id: "demo_f_2",
          title: "Hit 5x1km threshold intervals at race pace",
          description: "Dial in target split consistency and negative-split pacing.",
          dueDate: format(addDays(now, 28), "yyyy-MM-dd"),
          tMinusLabel: "T-14",
          completed: false,
          priority: "medium",
          dailyTasks: ["Track interval session", "Log sleep & hydration metrics"],
        },
        {
          id: "demo_f_3",
          title: "Begin 10-day volume taper & carb load",
          description: "Reduce weekly mileage by 40% while keeping short neuromuscular strides.",
          dueDate: format(addDays(now, 38), "yyyy-MM-dd"),
          tMinusLabel: "T-4",
          completed: false,
          priority: "high",
          dailyTasks: ["30m shakeout run", "Prep race bib, gels, and GPS watch"],
        },
      ],
    },
  ];
}

export function createInitialDemoReminders(): Reminder[] {
  const now = new Date();
  return [
    {
      id: "demo_rem_1",
      projectId: "demo_proj_exam",
      title: "Daily 2-hour Deep Work Study Block",
      notes: "Phone on Do Not Disturb. Focus on Distributed Systems & Algorithms.",
      dateTime: setMinutes(setHours(addDays(now, 0), 20), 0).toISOString(),
      recurringDaily: true,
      completed: false,
      createdAt: now.toISOString(),
    },
    {
      id: "demo_rem_2",
      projectId: "demo_proj_exam",
      title: "Submit Concurrency Lab Assignment",
      notes: "Upload final tar.gz archive before midnight portal cutoff.",
      dateTime: setMinutes(setHours(addDays(now, 2), 18), 30).toISOString(),
      recurringDaily: false,
      completed: false,
      createdAt: now.toISOString(),
    },
    {
      id: "demo_rem_3",
      projectId: "demo_proj_launch",
      title: "Review Landing Page Hero & Demo Video",
      notes: "Verify mobile viewport responsiveness and CTA conversion flow.",
      dateTime: setMinutes(setHours(addDays(now, 4), 11), 0).toISOString(),
      recurringDaily: false,
      completed: false,
      createdAt: now.toISOString(),
    },
  ];
}
