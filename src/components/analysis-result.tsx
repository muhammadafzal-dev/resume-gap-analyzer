'use client'
import { useState } from 'react'
import type { AnalysisResult } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Copy, Check, AlertTriangle } from 'lucide-react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

const importanceVariant: Record<string, 'destructive' | 'secondary' | 'outline'> = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
}

const impactColor: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
}

export function AnalysisResultView({ result }: { result: AnalysisResult }) {
  const scoreColor =
    result.overall_match_score >= 70
      ? 'text-green-400'
      : result.overall_match_score >= 50
      ? 'text-yellow-400'
      : 'text-red-400'

  return (
    <div className="space-y-6">
      {/* Score card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium">Overall Match Score</span>
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {result.overall_match_score}%
            </span>
          </div>
          <Progress value={result.overall_match_score} className="h-2" />
          <p className="text-slate-400 text-sm mt-3">{result.summary}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="actions">
        <TabsList className="bg-slate-800 border border-slate-700 w-full">
          <TabsTrigger value="actions" className="flex-1">Priority Actions</TabsTrigger>
          <TabsTrigger value="missing" className="flex-1">Missing Skills</TabsTrigger>
          <TabsTrigger value="weak" className="flex-1">Weak Areas</TabsTrigger>
          <TabsTrigger value="improvements" className="flex-1">Resume Edits</TabsTrigger>
          <TabsTrigger value="strengths" className="flex-1">Strengths</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-3 mt-4">
          {result.priority_actions.map((a) => (
            <Card key={a.priority} className="bg-slate-800 border-slate-700">
              <CardContent className="flex items-start gap-4 pt-4 pb-4">
                <span className="text-2xl font-bold text-slate-500 min-w-[2rem]">
                  #{a.priority}
                </span>
                <div>
                  <p className="text-slate-200">{a.action}</p>
                  <span className={`text-xs font-medium ${impactColor[a.impact]}`}>
                    {a.impact} impact
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="missing" className="space-y-3 mt-4">
          {result.missing_skills.map((s) => (
            <Card key={s.skill} className="bg-slate-800 border-slate-700">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-200">{s.skill}</span>
                  <Badge variant={importanceVariant[s.importance]}>{s.importance}</Badge>
                </div>
                <p className="text-slate-400 text-sm">{s.how_to_add}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="weak" className="space-y-3 mt-4">
          {result.weak_areas.map((w, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="font-medium text-slate-200">{w.area}</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-sm text-slate-300">
                    <span className="text-red-400 font-medium">Current: </span>{w.current}
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-medium">Suggested: </span>{w.suggested}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="improvements" className="space-y-3 mt-4">
          {result.resume_improvements.map((imp, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm text-slate-400">{imp.section}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-sm text-slate-300">
                  <span className="text-red-400 font-medium">Current: </span>
                  {imp.current}
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3 text-sm text-slate-300">
                  <div className="flex items-start justify-between gap-2">
                    <span><span className="text-green-400 font-medium">Suggested: </span>{imp.suggested}</span>
                    <CopyButton text={imp.suggested} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="strengths" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {result.strengths.map((s) => (
              <Badge
                key={s}
                className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1"
              >
                <CheckCircle className="w-3 h-3 mr-1" /> {s}
              </Badge>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
