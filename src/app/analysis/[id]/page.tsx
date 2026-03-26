export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnalysisResultView } from '@/components/analysis-result'
import { DeleteAnalysisButton } from '@/components/delete-analysis-button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/logo'
import type { AnalysisResult } from '@/lib/types'

export default async function AnalysisPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!analysis) redirect('/history')

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-bold">ResumeGap</span>
        </div>
        <div className="flex items-center gap-2">
          <DeleteAnalysisButton id={analysis.id} redirectTo="/history" />
          <Link
            href="/history"
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{analysis.job_title}</h1>
          {analysis.company && (
            <p className="text-slate-400 mt-1">{analysis.company}</p>
          )}
          <p className="text-slate-600 text-sm mt-1">
            {new Date(analysis.created_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <AnalysisResultView result={analysis.analysis_result as AnalysisResult} />
      </div>
    </div>
  )
}
