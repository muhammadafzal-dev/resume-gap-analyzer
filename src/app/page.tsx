'use client'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { Zap, Target, TrendingUp, Key, PenLine, CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Subtle dot grid background ── */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800/60 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Logo size={30} />
          <span className="font-bold text-lg">ResumeGap</span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 text-sm border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white px-4 py-2 rounded-lg transition-all"
        >
          Sign in with Google
        </button>
      </nav>

      {/* ── Hero ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <Zap className="w-3 h-3" />
          Powered by your own Gemini API — Free forever
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight tracking-tight">
          Know exactly what&apos;s missing
          <br />
          <span className="text-blue-400">between you and the job</span>
        </h1>

        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your resume, paste any job description, and get a deep AI-powered gap analysis —
          ATS keywords, missing skills, weak verbs, priority actions. Free with your own Gemini key.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-slate-500 text-sm">No subscription · No credit card</p>
        </div>
      </div>

      {/* ── Live Demo Preview ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-6 font-medium">Sample analysis output</p>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Mock score header */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border-b border-slate-800 p-5 flex items-center gap-5">
            <div className="relative shrink-0 w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="36" fill="none" stroke="#1e293b" strokeWidth="7" />
                <circle cx="44" cy="44" r="36" fill="none" stroke="#eab308" strokeWidth="7"
                  strokeLinecap="round" strokeDasharray={`${(62 / 100) * 2 * Math.PI * 36} ${2 * Math.PI * 36}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">62%</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">Overall Match</span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Partial Match</span>
              </div>
              <p className="text-slate-400 text-sm">Strong React fundamentals, but the role requires 3–5 years of senior leadership and experience with design systems. Adding quantified achievements and leadership examples would significantly improve this score.</p>
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/5">
                {[['8', 'Missing Skills', 'text-red-400'], ['5', 'ATS Keywords', 'text-orange-400'], ['4', 'Priority Actions', 'text-yellow-400']].map(([v, l, c]) => (
                  <div key={l} className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${c}`}>{v}</span>
                    <span className="text-xs text-slate-500">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mock tabs + content */}
          <div className="p-4">
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1 mb-4 overflow-x-auto">
              {['✦ Actions', 'ATS', 'Skills', 'Writing', 'Edits', 'Strengths'].map((t, i) => (
                <span key={t} className={`shrink-0 text-xs px-3 py-1.5 rounded-md font-medium ${i === 0 ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>{t}</span>
              ))}
            </div>

            <div className="space-y-2">
              {[
                { n: 1, text: 'Rewrite your Professional Summary to explicitly target Senior React Engineer roles, adding keywords: "design systems", "performance optimization", "technical leadership".', impact: 'high', border: 'border-l-red-500' },
                { n: 2, text: 'Add a dedicated "Web Technologies" section listing: TypeScript, GraphQL, Webpack, Jest, Cypress — all required by this role and missing from your current skills list.', impact: 'high', border: 'border-l-red-500' },
                { n: 3, text: 'Quantify your impact in Work Experience — replace "improved performance" with specific metrics like "reduced load time by 40% using code splitting and lazy loading."', impact: 'medium', border: 'border-l-yellow-500' },
              ].map(({ n, text, impact, border }) => (
                <div key={n} className={`bg-slate-800 border border-slate-700 border-l-2 ${border} rounded-lg px-4 py-3 flex gap-3`}>
                  <span className="text-xs font-bold text-slate-500 bg-slate-700 rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-slate-300 text-xs leading-relaxed">{text}</p>
                    <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${impact === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{impact} impact</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blur CTA overlay */}
          <div className="relative">
            <div className="h-16 bg-gradient-to-t from-slate-900 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
              >
                Sign in to see your full analysis <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── What you get ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: Target, label: 'Missing Skills' },
            { icon: Key, label: 'ATS Keywords' },
            { icon: PenLine, label: 'Verb Rewrites' },
            { icon: TrendingUp, label: 'Weak Areas' },
            { icon: Zap, label: 'Priority Actions' },
            { icon: CheckCircle, label: 'Strengths' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center gap-2 text-center">
              <Icon className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: Target,
            title: 'Precise Gap Analysis',
            desc: 'See exactly which skills are missing from your resume and how critical each one is for passing ATS screening.',
            color: 'text-red-400',
            glow: 'group-hover:shadow-red-500/10',
          },
          {
            icon: Key,
            title: 'ATS Keyword Detection',
            desc: 'We extract every keyword from the job description and tell you exactly which ones are missing from your resume.',
            color: 'text-blue-400',
            glow: 'group-hover:shadow-blue-500/10',
          },
          {
            icon: Zap,
            title: 'Priority Actions',
            desc: 'A ranked list of exactly what to fix first — so you spend time on changes that actually increase interview callbacks.',
            color: 'text-yellow-400',
            glow: 'group-hover:shadow-yellow-500/10',
          },
        ].map(({ icon: Icon, title, desc, color, glow }) => (
          <div key={title} className={`group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all hover:shadow-xl ${glow}`}>
            <div className={`w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── How it works ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-28 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">How it works</h2>
        <p className="text-slate-500 text-sm mb-12">Ready in under 2 minutes</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          {[
            { step: '1', text: 'Sign in with Google', sub: 'One click, no setup' },
            { step: '2', text: 'Connect Gemini key', sub: 'Free from Google AI Studio' },
            { step: '3', text: 'Upload resume + JD', sub: 'PDF + paste description' },
            { step: '4', text: 'Get your analysis', sub: 'Instant, detailed results' },
          ].map(({ step, text, sub }) => (
            <div key={step} className="flex flex-col items-center gap-3 relative">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg z-10">
                {step}
              </div>
              <div>
                <p className="text-slate-200 text-sm font-medium">{text}</p>
                <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to close the gap?</h2>
          <p className="text-slate-400 text-sm mb-8">Free forever. No subscription. Bring your own Gemini API key.</p>
          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-blue-500/25"
          >
            Start Analyzing Free <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 border-t border-slate-800 py-6 text-center text-slate-600 text-xs">
        ResumeGap · Built with Next.js + Gemini AI · Your data stays yours
      </div>

    </div>
  )
}
