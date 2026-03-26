# ResumeGap

> Know exactly what's missing between you and the job.

ResumeGap is an AI-powered resume gap analyzer. Upload your resume, paste any job description, and get a deep analysis — missing skills, ATS keywords, priority actions, verb rewrites, and more. Powered by **your own free Gemini API key**, so it costs nothing to run.

---

## Features

- **Overall match score** — 0–100% with honest assessment
- **ATS keyword detection** — every keyword extracted from the job description, color-coded by importance, click-to-copy
- **Missing skills** — flagged by importance (high / medium / low) with specific advice on how to add each
- **Priority actions** — ranked list of exactly what to fix first
- **Verb improvements** — weak verbs identified and rewritten with power verbs
- **Resume edits** — section-by-section rewrites (current vs. suggested), copy-to-clipboard
- **Experience gap analysis** — required vs. actual experience compared
- **Strengths** — what's already working in your resume
- **Analysis history** — all past analyses saved and accessible
- **BYOK** — Bring Your Own [Gemini API key](https://aistudio.google.com/app/apikey) — free forever

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
| Hosting | Vercel (free tier) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Google Cloud](https://console.cloud.google.com) project (for OAuth)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resume-gap-analyzer.git
cd resume-gap-analyzer
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set up Supabase

Run the following SQL in your Supabase SQL editor:

```sql
-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  gemini_api_key text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);
alter table public.profiles enable row level security;
create policy "Users can only access their own profile"
  on public.profiles for all using (auth.uid() = id);

-- Analyses table
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  job_title text not null default '',
  company text,
  job_description text not null,
  resume_text text not null,
  analysis_result jsonb not null,
  created_at timestamp with time zone default timezone('utc', now())
);
alter table public.analyses enable row level security;
create policy "Users can only access their own analyses"
  on public.analyses for all using (auth.uid() = user_id);
```

Enable Google OAuth in Supabase → Authentication → Providers → Google.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

Deploy to [Vercel](https://vercel.com) in one click:

1. Push to GitHub
2. Import the repo on Vercel
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

Update your Supabase OAuth redirect URLs to include your Vercel domain.

---

## Project Structure

```
resume-gap-analyzer/
├── middleware.ts                    # Route protection + onboarding redirect
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── auth/callback/route.ts   # Google OAuth callback
│   │   ├── onboarding/page.tsx      # Gemini API key setup
│   │   ├── dashboard/page.tsx       # Main analyze page
│   │   ├── history/page.tsx         # Past analyses list
│   │   ├── analysis/[id]/page.tsx   # Saved analysis view
│   │   ├── settings/page.tsx        # Update API key
│   │   └── api/parse-pdf/route.ts   # Server-side PDF extraction
│   ├── components/
│   │   ├── analysis-result.tsx      # Tabbed result display
│   │   ├── resume-upload.tsx        # Drag-and-drop PDF upload
│   │   ├── gemini-key-setup.tsx     # API key input + verify
│   │   ├── job-title-input.tsx      # Autocomplete job title
│   │   └── logo.tsx                 # App logo SVG
│   └── lib/
│       ├── gemini.ts                # Gemini API client
│       ├── types.ts                 # TypeScript interfaces
│       └── supabase/                # Supabase client helpers
```

---

## Privacy

- Your resume is sent to the Gemini API using **your own API key** — we never see its contents
- Resume text is saved to your Supabase database only to enable history (deletable at any time)
- No resume files are stored — only extracted text
- Row Level Security ensures your data is never accessible to other users

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT — see [LICENSE](LICENSE) for details.
