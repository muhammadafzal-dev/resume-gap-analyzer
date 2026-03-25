import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, ArrowRight } from 'lucide-react'

export default async function HistoryPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: analyses } = await supabase
    .from('analyses')
    .select('id, job_title, company, created_at, analysis_result')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold">Analysis History</h1>
          </div>
          <Link href="/dashboard" className="text-blue-400 hover:underline text-sm">
            ← New Analysis
          </Link>
        </div>

        {!analyses?.length ? (
          <div className="text-center py-16 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No analyses yet.</p>
            <Link href="/dashboard" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
              Run your first analysis →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const score = (a.analysis_result as any)?.overall_match_score ?? 0
              const scoreClass =
                score >= 70
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : score >= 50
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'

              return (
                <Link key={a.id} href={`/analysis/${a.id}`}>
                  <Card className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-200">{a.job_title}</p>
                          <p className="text-slate-500 text-sm">
                            {a.company && `${a.company} · `}
                            {new Date(a.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={scoreClass}>{score}% match</Badge>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
