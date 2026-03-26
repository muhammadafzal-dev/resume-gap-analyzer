'use client'
import { useState } from 'react'
import type { AnalysisResult } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle, Copy, Check, AlertTriangle,
  Zap, BookOpen, Target, TrendingUp, Key, PenLine, Clock, Download
} from 'lucide-react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function KeywordChip({ keyword, className, dot, tooltip }: {
  keyword: string
  className: string
  dot?: boolean
  tooltip?: string
}) {
  const [copied, setCopied] = useState(false)
  const [showTip, setShowTip] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(keyword)
    setCopied(true)
    setShowTip(false)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium transition-all active:scale-95 hover:brightness-125 cursor-pointer ${className}`}
      >
        {copied
          ? <><Check className="w-3 h-3 shrink-0" /> Copied!</>
          : <>{dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />}{keyword}</>
        }
      </button>
      {showTip && tooltip && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-max max-w-[220px] bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none leading-relaxed">
          {tooltip}
          <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-600" />
        </div>
      )}
    </div>
  )
}

const impactBorder: Record<string, string> = {
  high: 'border-l-red-500', medium: 'border-l-yellow-500', low: 'border-l-green-500',
}
const impactBadge: Record<string, string> = {
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
}
const importanceBadge: Record<string, string> = {
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-slate-700 text-slate-400 border-slate-600',
}

export function AnalysisResultView({ result }: { result: AnalysisResult }) {
  const score = result.overall_match_score
  const scoreColor = score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'
  const scoreBg = score >= 70
    ? 'from-green-500/10 to-transparent border-green-500/20'
    : score >= 50
    ? 'from-yellow-500/10 to-transparent border-yellow-500/20'
    : 'from-red-500/10 to-transparent border-red-500/20'
  const scoreLabel = score >= 70 ? 'Strong Match' : score >= 50 ? 'Partial Match' : 'Weak Match'

  const r = 36
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  const missingKeywords = result.ats_keywords?.filter((k) => !k.found) ?? []
  const foundKeywords = result.ats_keywords?.filter((k) => k.found) ?? []

  return (
    <div className="space-y-4 print:space-y-6">

      {/* ── Export button ── */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Save as PDF
        </button>
      </div>

      {/* ── Score Card ── */}
      <div className={`rounded-xl border bg-gradient-to-br ${scoreBg} p-5`}>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0 w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
              <circle cx="44" cy="44" r={r} fill="none" stroke={scoreColor} strokeWidth="7"
                strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
                style={{ transition: 'stroke-dasharray 0.8s ease' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white leading-none">{score}%</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white text-base">Overall Match</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${impactBadge[score >= 70 ? 'low' : score >= 50 ? 'medium' : 'high']}`}>
                {scoreLabel}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>

        {/* Experience gap callout */}
        {result.experience_gap && (
          <div className="mt-4 bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 flex items-start gap-3">
            <Clock className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-0.5">
              <div><span className="text-slate-500">Required: </span>{result.experience_gap.required}</div>
              <div><span className="text-slate-500">You have: </span>{result.experience_gap.actual}</div>
              <div className="text-yellow-400 mt-1">{result.experience_gap.verdict}</div>
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
          {[
            { icon: Target, label: 'Missing Skills', value: result.missing_skills.length, color: 'text-red-400' },
            { icon: Key, label: 'ATS Keywords', value: missingKeywords.length + ' missing', color: 'text-orange-400' },
            { icon: Zap, label: 'Actions', value: result.priority_actions.length, color: 'text-yellow-400' },
            { icon: CheckCircle, label: 'Strengths', value: result.strengths.length, color: 'text-green-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color} shrink-0`} />
              <div>
                <div className="text-white font-semibold text-sm">{value}</div>
                <div className="text-slate-500 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="actions">
        <div className="overflow-x-auto scrollbar-none rounded-lg border border-slate-800 bg-slate-900">
          <TabsList className="bg-transparent border-0 h-auto p-1 gap-0.5 flex w-max min-w-full">
            {[
              { value: 'actions', label: 'Actions', icon: Zap },
              { value: 'ats', label: 'ATS', icon: Key },
              { value: 'missing', label: 'Skills', icon: Target },
              { value: 'verbs', label: 'Writing', icon: PenLine },
              { value: 'weak', label: 'Weak Areas', icon: AlertTriangle },
              { value: 'improvements', label: 'Edits', icon: BookOpen },
              { value: 'strengths', label: 'Strengths', icon: TrendingUp },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value}
                className="shrink-0 text-xs px-3 py-1.5 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 flex items-center gap-1.5 whitespace-nowrap rounded-md">
                <Icon className="w-3 h-3" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Priority Actions */}
        <TabsContent value="actions" className="space-y-2 mt-3">
          {result.priority_actions.map((a) => (
            <div key={a.priority}
              className={`bg-slate-900 border border-slate-800 border-l-2 ${impactBorder[a.impact]} rounded-lg px-4 py-3 flex items-start gap-3`}>
              <span className="text-xs font-bold text-slate-500 bg-slate-800 rounded-md w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                {a.priority}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm leading-relaxed">{a.action}</p>
                <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${impactBadge[a.impact]}`}>
                  {a.impact} impact
                </span>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ATS Keywords */}
        <TabsContent value="ats" className="mt-3 space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-slate-500">Click a missing keyword to copy it.</p>
            <div className="flex items-center gap-3">
              {[
                { color: 'bg-red-400', label: 'Must have' },
                { color: 'bg-yellow-400', label: 'Important' },
                { color: 'bg-slate-400', label: 'Nice to have' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {missingKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Missing from your resume ({missingKeywords.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((k) => (
                  <KeywordChip
                    key={k.keyword}
                    keyword={k.keyword}
                    className={importanceBadge[k.importance]}
                    tooltip={k.importance === 'high' ? 'Must have — ATS will likely reject without this' : k.importance === 'medium' ? 'Important — add if you have this skill' : 'Nice to have — adds value if relevant'}
                    dot
                  />
                ))}
              </div>
            </div>
          )}
          {foundKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Already in your resume ({foundKeywords.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {foundKeywords.map((k) => (
                  <span key={k.keyword}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-green-500/8 text-green-400 border-green-500/20 font-medium">
                    <CheckCircle className="w-3 h-3 shrink-0" />
                    {k.keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Missing Skills */}
        <TabsContent value="missing" className="space-y-2 mt-3">
          {result.missing_skills.map((s) => (
            <div key={s.skill} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-slate-100 text-sm">{s.skill}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${importanceBadge[s.importance]}`}>
                  {s.importance}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{s.how_to_add}</p>
            </div>
          ))}
        </TabsContent>

        {/* Verb / Writing Improvements */}
        <TabsContent value="verbs" className="space-y-2 mt-3">
          {(result.verb_improvements ?? []).length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500/50" />
              No weak verbs found — your writing looks strong!
            </div>
          ) : (
            result.verb_improvements.map((v, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="p-3 space-y-2">
                  <div className="bg-red-500/8 border border-red-500/15 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                    <span className="text-red-400 font-semibold">Weak: </span>{v.original}
                  </div>
                  <div className="bg-green-500/8 border border-green-500/15 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="flex-1"><span className="text-green-400 font-semibold">Strong: </span>{v.improved}</span>
                      <CopyButton text={v.improved} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs px-1">{v.reason}</p>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Weak Areas */}
        <TabsContent value="weak" className="space-y-2 mt-3">
          {result.weak_areas.map((w, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span className="font-medium text-slate-200 text-sm">{w.area}</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="bg-red-500/8 border border-red-500/15 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                  <span className="text-red-400 font-semibold">Current: </span>{w.current}
                </div>
                <div className="bg-blue-500/8 border border-blue-500/15 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                  <span className="text-blue-400 font-semibold">Suggested: </span>{w.suggested}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Resume Edits */}
        <TabsContent value="improvements" className="space-y-2 mt-3">
          {result.resume_improvements.map((imp, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{imp.section}</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="bg-red-500/8 border border-red-500/15 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                  <span className="text-red-400 font-semibold">Current: </span>{imp.current}
                </div>
                <div className="bg-green-500/8 border border-green-500/15 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="flex-1"><span className="text-green-400 font-semibold">Suggested: </span>{imp.suggested}</span>
                    <CopyButton text={imp.suggested} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Strengths */}
        <TabsContent value="strengths" className="mt-3">
          <div className="grid grid-cols-1 gap-2">
            {result.strengths.map((s) => (
              <div key={s} className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-slate-200 text-sm">{s}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
