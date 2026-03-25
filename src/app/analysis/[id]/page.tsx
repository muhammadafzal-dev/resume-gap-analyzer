export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnalysisResultView } from '@/components/analysis-result'
import Link from 'next/link'
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
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
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
          <Link href="/history" className="text-blue-400 hover:underline text-sm">
            ← History
          </Link>
        </div>
        <AnalysisResultView result={analysis.analysis_result as AnalysisResult} />
      </div>
    </div>
  )
}
