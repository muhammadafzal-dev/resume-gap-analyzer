# ResumeGap — Full Project Documentation

## What Is This?

ResumeGap is a web app that compares a user's resume against any job description and returns a detailed AI-powered gap analysis. The unique angle is **BYOK (Bring Your Own Key)** — users connect their own free Google Gemini API key, so we pay $0 for AI, forever.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Supabase (Google OAuth) |
| Database | Supabase PostgreSQL |
| AI | Google Gemini 2.5 Flash (user's own key) |
| PDF Parsing | `unpdf` (server-side API route) |
| Notifications | Sonner |
| Hosting | Vercel (free tier) |

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel hosting | $0 (free tier) |
| Supabase (Auth + DB) | $0 (free tier) |
| Google OAuth | $0 |
| Gemini API | $0 (user's own key) |
| **Total** | **$0** |

---

## Project Structure

```
resume-gap-analyzer/
├── middleware.ts                        # Route protection + onboarding redirect
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout with Toaster
│   │   ├── page.tsx                     # Landing page (public)
│   │   ├── auth/callback/route.ts       # Google OAuth callback handler
│   │   ├── onboarding/page.tsx          # Gemini API key setup (first login)
│   │   ├── dashboard/page.tsx           # Main app — upload + analyze
│   │   ├── history/page.tsx             # List of past analyses
│   │   ├── analysis/[id]/page.tsx       # Individual saved analysis view
│   │   ├── settings/page.tsx            # Update Gemini API key
│   │   └── api/parse-pdf/route.ts       # Server-side PDF text extraction
│   ├── components/
│   │   ├── analysis-result.tsx          # Tabbed result display
│   │   ├── resume-upload.tsx            # Drag-and-drop PDF upload
│   │   ├── gemini-key-setup.tsx         # API key input + verify component
│   │   ├── job-title-input.tsx          # Autocomplete job title input
│   │   └── ui/                          # shadcn/ui base components
│   └── lib/
│       ├── gemini.ts                    # Gemini API calls (analyzeResume, testApiKey)
│       ├── pdf-parser.ts               # Client utility — posts PDF to API route
│       ├── types.ts                     # TypeScript interfaces
│       ├── utils.ts                     # cn() helper
│       └── supabase/
│           ├── client.ts               # Browser Supabase client
│           └── server.ts               # Server Supabase client (with cookies)
```

---

## User Flow

```
Landing Page
    ↓ (Sign in with Google)
Google OAuth → /auth/callback
    ↓
Middleware checks onboarding_completed
    ├── false → /onboarding (enter Gemini API key)
    └── true  → /dashboard
                    ↓
              Upload PDF + paste job description
                    ↓
              PDF sent to /api/parse-pdf → text extracted
                    ↓
              Text + job description sent to Gemini API
              (using user's own API key, direct from browser)
                    ↓
              Analysis result displayed in tabbed view
              + saved to Supabase analyses table
                    ↓
              /history → list of all past analyses
              /analysis/[id] → view any saved analysis
```

---

## Pages

### `/` — Landing Page
- Marketing page with hero, 3 feature cards, 4-step how-it-works
- "Sign in with Google" button triggers Supabase OAuth
- Honest privacy copy: "We never store your resume — analysis goes directly to Gemini via your key"

### `/onboarding` — API Key Setup
- Shown automatically after first sign-in
- User pastes their Gemini API key
- Key is tested live before saving (`testApiKey()`)
- On success: saves key + sets `onboarding_completed = true` in Supabase profiles table
- Redirects to `/dashboard`

### `/dashboard` — Main App
- Two-panel layout (left: inputs, right: results) — both scroll independently
- Left panel: PDF upload, job title (autocomplete), company, job description textarea, Analyze button
- Right panel: shows results or empty state placeholder
- On analyze: extracts PDF text → calls Gemini → displays result → saves to history
- Nav: History, Settings, Sign out

### `/history` — Analysis History
- Lists all past analyses sorted by newest first
- Shows job title, company, date, match score badge (color-coded: green ≥70, yellow ≥50, red <50)
- Click any row → `/analysis/[id]`

### `/analysis/[id]` — Saved Analysis View
- Shows full analysis result for a saved record
- Same `AnalysisResultView` component as dashboard

### `/settings` — Update API Key
- Shows masked current key
- Enter new key → verified live → saved to Supabase
- Accessible from dashboard nav

---

## Components

### `AnalysisResultView`
Renders the full analysis in 5 tabs:

| Tab | Content |
|-----|---------|
| Priority Actions | Numbered list of ranked actions with impact level (high/medium/low) |
| Missing Skills | Skills not in resume with importance badge + how-to-add advice |
| Weak Areas | Areas needing improvement — current vs suggested (blue) |
| Resume Edits | Section-by-section rewrites — current (red) vs suggested (green) with copy button |
| Strengths | Green badge list of resume strengths |

Also shows: overall match score (0–100%) with color-coded progress bar + 2–3 sentence summary.

### `ResumeUpload`
- Drag-and-drop or click-to-browse PDF upload
- Three states: idle → parsing (spinner) → done (green with filename)
- Sends file to `/api/parse-pdf` and returns extracted text

### `JobTitleInput`
- Text input with dropdown autocomplete
- 30 predefined common job titles (filterable by typing)
- Dropdown closes on outside click

### `GeminiKeySetup`
- Password input for API key
- "Verify & Continue" button — tests the key live before saving
- Shows success/error state with icons
- Link to Google AI Studio to get a free key

---

## Libraries

### `src/lib/gemini.ts`

```typescript
analyzeResume(apiKey, resumeText, jobDescription) → AnalysisResult
```
- Uses `gemini-2.5-flash` model
- Sends structured prompt asking for JSON with: match score, summary, missing skills, weak areas, strengths, priority actions, resume improvements
- Strips markdown code fences from response before JSON.parse

```typescript
testApiKey(apiKey) → boolean
```
- Sends a simple prompt to verify the key works
- Returns `true`/`false` — used in onboarding and settings

### `src/lib/pdf-parser.ts`
- Client-side utility
- POSTs the PDF file to `/api/parse-pdf`
- Returns trimmed extracted text string

### `/api/parse-pdf` route
- Server-side using `unpdf` library
- Receives multipart form data with PDF file
- Returns `{ text: string }`

---

## Database Schema (Supabase)

### `profiles` table
```sql
id uuid (FK → auth.users)
gemini_api_key text
onboarding_completed boolean default false
created_at timestamptz
```
- Auto-created on user signup via trigger
- Row Level Security: users can only access their own row

### `analyses` table
```sql
id uuid (PK, auto-generated)
user_id uuid (FK → auth.users)
job_title text
company text (nullable)
job_description text
resume_text text
analysis_result jsonb
created_at timestamptz
```
- Row Level Security: users can only access their own analyses

---

## AI Analysis Output Structure

```typescript
interface AnalysisResult {
  overall_match_score: number          // 0–100
  summary: string                      // 2–3 sentence assessment
  missing_skills: {
    skill: string
    importance: 'high' | 'medium' | 'low'
    how_to_add: string
  }[]
  weak_areas: {
    area: string
    current: string
    suggested: string
  }[]
  strengths: string[]
  priority_actions: {
    priority: number
    action: string
    impact: 'high' | 'medium' | 'low'
  }[]
  resume_improvements: {
    section: string
    current: string
    suggested: string
  }[]
}
```

---

## Auth & Security

- Google OAuth via Supabase — no passwords stored
- Gemini API key stored in Supabase (encrypted at rest by Supabase)
- Row Level Security on all tables — users can never access other users' data
- Middleware protects all routes: `/dashboard`, `/history`, `/analysis`, `/onboarding`, `/settings`
- Unauthenticated users are redirected to `/`
- Users who haven't completed onboarding are redirected to `/onboarding`

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Decisions Made During Build

| Problem | Solution |
|---------|----------|
| `pdfjs-dist` crashed with webpack | Replaced with server-side `unpdf` API route |
| `pdf-parse` had CJS/ESM mismatch | Replaced with `unpdf` |
| Gemini `gemini-1.5-flash` returned 404 | Updated to `gemini-2.5-flash` |
| Gemini 403 "unregistered caller" | User hadn't set API key — added guard + redirect to onboarding |
| Build-time prerender error on server pages | Added `export const dynamic = 'force-dynamic'` |
| Supabase new key format | `sb_publishable_` prefix requires `@supabase/supabase-js` v2.100+ |

---

## What's NOT Done Yet (Future Work)

- Deploy to Vercel
- Push to GitHub
- Delete individual history items
- Export analysis as PDF
- Compare multiple resumes against same job
- Email notifications
- Rate limiting / abuse protection

---

## Git History

```
1a31888  refactor: enhance layout and styling of dashboard and analysis result
64669a1  feat: add weak areas tab, settings page, job title autocomplete, copy button, privacy fix
7b934dd  fix: validate API key before analysis and update Gemini model version
2cfec46  refactor: remove pdf-parse, switch to unpdf
55dda17  fix: externalize pdf-parse from Next.js bundler
8fc6a9a  fix: replace client-side pdfjs with server-side pdf-parse API route
3281480  fix: resolve pdfjs-dist webpack bundling error
d8255da  fix: force-dynamic on server pages, valid placeholder env for builds
4f19ae3  fix: add missing lib/utils for shadcn components
46f1ec1  feat: add all pages and components
9762700  feat: add PDF parser, Gemini client, and type definitions
af4a6bc  feat: add Supabase auth infrastructure and middleware
e2129c2  chore: scaffold Next.js project with dependencies
```
