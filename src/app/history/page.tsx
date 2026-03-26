export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowRight, Plus, Building2, Calendar } from 'lucide-react'
import { Logo } from '@/components/logo'
import { DeleteAnalysisButton } from '@/components/delete-analysis-button'

export default async function HistoryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: analyses } = await supabase
    .from('analyses')
    .select('id, job_title, company, created_at, analysis_result')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-bold">ResumeGap</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> New Analysis
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Analysis History</h1>
          <p className="text-slate-400 text-sm mt-1">
            {analyses?.length
              ? `${analyses.length} analysis${analyses.length !== 1 ? 'es' : ''} saved`
              : 'No analyses yet'}
          </p>
        </div>

        {!analyses?.length ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
            <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium mb-1">No analyses yet</p>
            <p className="text-slate-600 text-sm mb-6">Run your first gap analysis to see results here</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" /> Start Analyzing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const score = (a.analysis_result as any)?.overall_match_score ?? 0
              const scoreColor = score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'
              const scoreBg = score >= 70
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : score >= 50
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
              const scoreLabel = score >= 70 ? 'Strong' : score >= 50 ? 'Partial' : 'Weak'

              const r = 14
              const circ = 2 * Math.PI * r
              const dash = (score / 100) * circ

              return (
                <Link key={a.id} href={`/analysis/${a.id}`}>
                  <div className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl px-5 py-4 flex items-center gap-4 transition-all hover:bg-slate-800/60 cursor-pointer">

                    {/* Mini circular score */}
                    <div className="relative shrink-0 w-10 h-10">
                      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r={r} fill="none" stroke="#1e293b" strokeWidth="3" />
                        <circle cx="18" cy="18" r={r} fill="none" stroke={scoreColor} strokeWidth="3"
                          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">{score}%</span>
                      </div>
                    </div>

                    {/* Job info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-100 truncate">{a.job_title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {a.company && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Building2 className="w-3 h-3" />{a.company}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Score badge + actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${scoreBg}`}>
                        {scoreLabel} match
                      </span>
                      <DeleteAnalysisButton id={a.id} />
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
