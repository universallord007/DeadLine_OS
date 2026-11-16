import { NextRequest, NextResponse } from "next/server";
import { addDays, format } from "date-fns";
import { z } from "zod";
import { PlannerApiResponseSchema } from "@/validation/schemas";

const RequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(3000),
      })
    )
    .min(1),
  forceGenerate: z.boolean().optional(),
  regenerateContext: z.string().optional(),
});

function buildDemoFallbackResponse(userText: string, forceGenerate?: boolean) {
  const now = new Date();
  const lower = userText.toLowerCase();
  const hasDateHint =
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}|weeks?|days?|month|tomorrow|friday|monday)\b/i.test(
      lower
    );

  if (!forceGenerate && !hasDateHint && userText.trim().split(/\s+/).length < 12) {
    return {
      isDemo: true,
      data: {
        mode: "clarify" as const,
        reply:
          "Demo Mode (GROQ_API_KEY not configured): To build an accurate backward timeline, share a few quick details—or click Force Generate Plan to preview a sample schedule immediately.",
        followUpQuestions: [
          "What is your exact target deadline date?",
          "How many hours per day can you realistically dedicate?",
          "What progress have you already completed so far?",
        ],
      },
    };
  }

  const deadlineDate = addDays(now, 14);
  const titleMatch = userText.slice(0, 56).replace(/[.!?]+$/, "");

  return {
    isDemo: true,
    data: {
      mode: "plan" as const,
      reply:
        "Demo Mode (GROQ_API_KEY not configured): Generated a structured 14-day backward milestone roadmap based on your prompt. Add GROQ_API_KEY in .env.local for live Groq AI reasoning.",
      plan: {
        projectTitle: titleMatch.length > 4 ? titleMatch : "Final Examination & Revision Sprint",
        description: `Structured backward execution plan generated in Demo Mode for: "${userText.slice(
          0,
          140
        )}"`,
        deadline: new Date(
          deadlineDate.getFullYear(),
          deadlineDate.getMonth(),
          deadlineDate.getDate(),
          9,
          0
        ).toISOString(),
        category:
          lower.includes("launch") || lower.includes("app")
            ? ("Product Launch" as const)
            : lower.includes("run") || lower.includes("marathon")
              ? ("Fitness" as const)
              : ("Academic" as const),
        priority: "high" as const,
        motivationalQuote: "One day at a time. One goal at a time.",
        milestones: [
          {
            title: "Audit scope & complete foundational material",
            description: "Finish core chapters/modules and list remaining knowledge gaps.",
            dueDate: format(addDays(now, 2), "yyyy-MM-dd"),
            tMinusLabel: "T-12",
            priority: "high" as const,
            dailyTasks: [
              "Complete 2 focused 90-minute deep work sessions",
              "Summarize core concepts into one-page sheets",
            ],
          },
          {
            title: "Complete all assignments & practical exercises",
            description: "Finish hands-on problem sets and verify key deliverables.",
            dueDate: format(addDays(now, 5), "yyyy-MM-dd"),
            tMinusLabel: "T-9",
            priority: "high" as const,
            dailyTasks: [
              "Solve high-priority practice problems",
              "Flag difficult topics for targeted review",
            ],
          },
          {
            title: "Begin comprehensive active-recall revision",
            description: "Cycle through every topic without notes to test retention.",
            dueDate: format(addDays(now, 8), "yyyy-MM-dd"),
            tMinusLabel: "T-6",
            priority: "critical" as const,
            dailyTasks: [
              "Run morning flashcard & recall sprint",
              "Review error log before evening wrap-up",
            ],
          },
          {
            title: "Timed full-length mock simulation",
            description: "Complete practice assessment under strict deadline constraints.",
            dueDate: format(addDays(now, 11), "yyyy-MM-dd"),
            tMinusLabel: "T-3",
            priority: "critical" as const,
            dailyTasks: [
              "Take full timed mock assessment",
              "Drill weakest 20% of topics",
            ],
          },
          {
            title: "Final light review & readiness check",
            description: "Skim high-yield summaries, prepare materials, and rest early.",
            dueDate: format(addDays(now, 13), "yyyy-MM-dd"),
            tMinusLabel: "T-1",
            priority: "medium" as const,
            dailyTasks: [
              "60-minute light formula/checklist review",
              "Full rest night before deadline",
            ],
          },
        ],
      },
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedReq = RequestSchema.safeParse(body);
    if (!parsedReq.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsedReq.error.flatten() },
        { status: 400 }
      );
    }

    const { messages, forceGenerate, regenerateContext } = parsedReq.data;
    const latestUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      const demo = buildDemoFallbackResponse(latestUserMessage, forceGenerate);
      return NextResponse.json(demo);
    }

    const todayIso = format(new Date(), "yyyy-MM-dd");

    const systemInstruction = `You are DEADLINE OS AI Planner, an elite strategic execution architect.
Today's date is ${todayIso}.
Your job is to help the user turn a goal and deadline into a realistic, backward-planned milestone roadmap.

RULES:
1. If the user's request lacks critical information (such as target deadline date, current progress, or daily available hours) AND forceGenerate is false, respond with mode="clarify" and ask 2-3 concise, high-leverage follow-up questions in "followUpQuestions" plus a brief helpful "reply".
2. Once you have enough context OR if forceGenerate is true, respond with mode="plan" and provide a complete, realistic backward-scheduled "plan" working backward from the deadline (T-14, T-10, T-7, etc.).
3. Every milestone dueDate MUST be a valid YYYY-MM-DD calendar date between ${todayIso} and the deadline date, ordered chronologically.
4. Keep milestone titles crisp and descriptions concise and actionable (under 180 characters).
5. Include 2-3 concrete dailyTasks per milestone.
6. You MUST respond with ONLY a valid JSON object matching this exact structure:
{
  "mode": "clarify" | "plan",
  "reply": "string",
  "followUpQuestions": ["string"],
  "plan": {
    "projectTitle": "string",
    "description": "string",
    "deadline": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "category": "Academic" | "Career" | "Product Launch" | "Fitness" | "Creative" | "Personal",
    "priority": "low" | "medium" | "high" | "critical",
    "motivationalQuote": "string",
    "milestones": [
      {
        "title": "string",
        "description": "string",
        "dueDate": "YYYY-MM-DD",
        "tMinusLabel": "string",
        "priority": "low" | "medium" | "high" | "critical",
        "dailyTasks": ["string"]
      }
    ]
  }
}
Note: Only include "followUpQuestions" when mode="clarify", and only include "plan" when mode="plan".
${regenerateContext ? `Regeneration note from user: ${regenerateContext}` : ""}`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemInstruction },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          {
            role: "user",
            content: `forceGenerate=${Boolean(forceGenerate)}. Return JSON only.`,
          },
        ],
      }),
    });

    const groqJson = await groqResponse.json();
    if (!groqResponse.ok) {
      return NextResponse.json(
        {
          error: groqJson?.error?.message || "Failed to communicate with Groq API",
        },
        { status: groqResponse.status }
      );
    }

    const rawText = groqJson?.choices?.[0]?.message?.content ?? "{}";
    const jsonParsed = JSON.parse(rawText);
    const validated = PlannerApiResponseSchema.safeParse(jsonParsed);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Groq AI response failed schema validation. Please retry.",
          details: validated.error.flatten(),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      isDemo: false,
      data: validated.data,
    });
  } catch (error) {
    console.error("Groq Planner API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to communicate with Groq API",
      },
      { status: 500 }
    );
  }
}