# DEADLINE OS
**Your Goals. Your Time. Your Moment.**

DEADLINE OS is a dark-first, AI-powered deadline execution platform and **Countdown Lock Screen Studio** built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, and the official `@google/genai` SDK.

---

## 1. Core Features
- **Landing Experience (`/`)**: Product overview with live animated lock screen countdown preview, workflow breakdown, and feature showcase.
- **Personal Command Dashboard (`/dashboard`)**: Live T-minus countdown ticker (days, hours, minutes, seconds), completion percentage bars, upcoming & completed milestone trackers, daily productivity summary, and multi-project switcher.
- **Gemini AI Milestone Planner (`/planner`)**: Conversational backward planner powered by `gemini-2.5-flash` with structured JSON output, Zod schema validation, inline milestone editing/deletion, plan regeneration, and an automatic clearly labeled Demo Mode fallback when `GEMINI_API_KEY` is omitted.
- **Countdown Lock Screen Studio (`/wallpaper`)**: 8 curated themes (*Minimal Dark, Midnight Purple, Cyberpunk Neon, Clean Apple-Inspired, Productivity Grid, Aurora Gradient, Minimal White, Futuristic Glass*), 9:16 mobile / 16:9 desktop / 4:3 tablet / custom pixel resolutions, clock-safe top margin slider, typography & checkbox controls, preview mode, and high-resolution PNG export via `html-to-image`.
- **Project Details (`/projects/[id]`)**: Dedicated timeline view, milestone creation/completion, project editing/deletion, and quick wallpaper export.
- **Reminders & Accountability (`/reminders`)**: Project-linked daily and one-time reminders with in-app toast notifications and an extensible `/api/cron/reminders` endpoint.
- **Settings (`/settings`)**: Appearance preferences, default wallpaper format, Gemini API setup guide, and LocalStorage demo data management.

---

## 2. Technology Stack
- **Framework**: Next.js 15 (App Router) + React 19 + Strict TypeScript
- **Styling**: Tailwind CSS
- **Motion**: Framer Motion (respects `prefers-reduced-motion`)
- **AI**: Google Gemini API (`@google/genai` SDK, `gemini-2.5-flash`)
- **Validation & Forms**: Zod + React Hook Form
- **Wallpaper Export**: `html-to-image`
- **Utilities & UI**: `date-fns`, `lucide-react`, `sonner`

---

## 3. Prerequisites
- **Node.js**: v18.18+ or v20+ recommended
- **npm**: v9+ (or pnpm / yarn)
- **Google Gemini API Key** (optional for Demo Mode; required for live AI planning)

---

## 4. Local Setup & Installation

1. **Extract `deadline-os.zip`** and open a terminal inside the extracted `deadline-os` folder:
   ```bash
   cd deadline-os
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```
   **How to get a Gemini API key:**
   1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
   2. Sign in with your Google account and click **Create API key**.
   3. Copy the generated key into `.env.local`.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000).

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 5. Deploying to Vercel

1. **Push `deadline-os` to GitHub, GitLab, or Bitbucket.**
2. **Import into Vercel:**
   - Log in to [vercel.com](https://vercel.com) and click **Add New → Project**.
   - Select your repository.
3. **Add Environment Variables in Vercel:**
   - Expand **Environment Variables** on the import screen (or go to **Project Settings → Environment Variables**).
   - Add `GEMINI_API_KEY` with your Google AI Studio API key.
   - *(Optional)* Add `CRON_SECRET` if enabling Vercel Cron jobs.
4. **Deploy:**
   - Click **Deploy**. Vercel uses `vercel.json` to run `npm install` and `npm run build` and deploys your live application.

---

## 6. Troubleshooting & Optional Integrations
- **Planner runs in Demo Mode:** Ensure `GEMINI_API_KEY` is saved in `.env.local` (locally) or in Vercel Environment Variables, then restart the dev server or redeploy.
- **Persistence:** Uses browser `LocalStorage` so the app runs immediately without database setup. Replace `src/lib/storage.ts` to connect Supabase or Neon Postgres.
- **Scheduled Push Notifications:** Browser tabs cannot run background timers when closed. Connect a persistent database and Web Push / Resend provider to `src/app/api/cron/reminders/route.ts` and configure `crons` in `vercel.json`.
- **Google Calendar Sync:** Optional OAuth placeholders (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) are included in `.env.example`.
