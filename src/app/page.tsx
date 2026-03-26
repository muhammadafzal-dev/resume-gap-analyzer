'use client'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Target, TrendingUp } from 'lucide-react'
import { Logo } from '@/components/logo'

export default function LandingPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-bold text-lg">ResumeGap</span>
        </div>
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="border-slate-600 text-slate-200 hover:bg-slate-800 bg-transparent"
        >
          Sign in with Google
        </Button>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20">
          Powered by your own Gemini API — Free forever
        </Badge>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Know exactly what&apos;s missing
          <br />
          <span className="text-blue-400">between you and the job</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Paste any job description, upload your resume, and get a precise gap analysis
          with priority actions — using your own Gemini API key, no subscription needed.
        </p>
        <Button
          onClick={handleGoogleLogin}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg"
        >
          Get Started Free →
        </Button>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Target,
            title: 'Precise Gap Analysis',
            desc: 'See exactly which skills are missing and how important each one is',
          },
          {
            icon: TrendingUp,
            title: 'Priority Actions',
            desc: 'Ranked list of what to fix first for maximum interview call rate',
          },
          {
            icon: Zap,
            title: 'Your API, Your Privacy',
            desc: "Use your own Gemini key. We never store your resume — analysis goes directly to Gemini via your key.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <Icon className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-slate-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-2xl font-bold mb-10 text-slate-300">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '1', text: 'Sign in with Google' },
            { step: '2', text: 'Connect your free Gemini API key' },
            { step: '3', text: 'Upload resume + paste job description' },
            { step: '4', text: 'Get your gap analysis instantly' },
          ].map(({ step, text }) => (
            <div key={step} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                {step}
              </div>
              <p className="text-slate-400 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
