'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { analyzeResume } from '@/lib/gemini'
import { ResumeUpload } from '@/components/resume-upload'
import { JobTitleInput } from '@/components/job-title-input'
import { AnalysisResultView } from '@/components/analysis-result'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, FileText, History } from 'lucide-react'
import { Logo } from '@/components/logo'
import { UserMenu } from '@/components/user-menu'
import { toast } from 'sonner'
import type { AnalysisResult } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [apiKey, setApiKey] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadApiKey = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('gemini_api_key')
        .eq('id', user.id)
        .single()
      if (data?.gemini_api_key) setApiKey(data.gemini_api_key)
    }
    loadApiKey()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnalyze = async () => {
    if (!apiKey) {
      toast.error('Gemini API key not found. Please update it in your profile settings.')
      return
    }
    if (!resumeText || !jobDescription) {
      toast.error('Please upload your resume and paste the job description')
      return
    }
    // Rate limit: max 20 analyses per hour
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    if (currentUser) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)
        .gte('created_at', oneHourAgo)
      if ((count ?? 0) >= 20) {
        toast.error('Rate limit reached: max 20 analyses per hour. Please wait before trying again.')
        return
      }
    }

    setIsAnalyzing(true)
    setResult(null)
    try {
      const analysisResult = await analyzeResume(apiKey, resumeText, jobDescription)
      setResult(analysisResult)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('analyses').insert({
          user_id: user.id,
          job_title: jobTitle || 'Untitled',
          company: company || null,
          job_description: jobDescription,
          resume_text: resumeText,
          analysis_result: analysisResult,
        })
      }
      toast.success('Analysis complete!')
    } catch {
      toast.error('Analysis failed. Check your API key and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }


  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-slate-950 text-white lg:overflow-hidden">
      {/* Nav */}
      <nav className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-bold">ResumeGap</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/history')} className="px-2 sm:px-3">
            <History className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">History</span>
          </Button>
          <UserMenu />
        </div>
      </nav>

      <div className="flex-1 lg:overflow-hidden max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-full">

          {/* ── Input Panel ── */}
          <div className="lg:overflow-y-auto lg:pr-1 space-y-4">
            {/* Heading */}
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-white">Analyze Your Resume</h1>
              <p className="text-slate-400 text-sm mt-1">
                Get an AI-powered gap analysis with priority actions in seconds.
              </p>
            </div>

            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-sm font-medium text-slate-300">Upload Resume</span>
                {resumeText && <span className="ml-auto text-xs text-green-400 font-medium">✓ Ready</span>}
              </div>
              <ResumeUpload onExtracted={(text) => setResumeText(text)} />
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-sm font-medium text-slate-300">Job Details</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">Job Title</Label>
                  <JobTitleInput value={jobTitle} onChange={setJobTitle} />
                </div>
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">Company <span className="text-slate-600">(optional)</span></Label>
                  <Input
                    placeholder="e.g. Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-400 mb-1.5 block">Job Description</Label>
                <Textarea
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white min-h-[160px] text-sm"
                />
              </div>
            </div>

            {/* Step 3 — Analyze */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-sm font-medium text-slate-300">Run Analysis</span>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resumeText || !jobDescription}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:shadow-none"
                size="lg"
              >
                {isAnalyzing
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing your resume…</>
                  : '✦ Analyze Gap →'
                }
              </Button>
              {(!resumeText || !jobDescription) && (
                <p className="text-xs text-slate-600 text-center mt-2">
                  {!resumeText ? 'Upload a resume to continue' : 'Paste a job description to continue'}
                </p>
              )}
            </div>
          </div>

          {/* ── Result Panel ── */}
          <div ref={resultRef} className="lg:overflow-y-auto lg:pr-1">
            {result ? (
              <AnalysisResultView result={result} />
            ) : (
              <div className="h-full min-h-[400px] rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center text-center p-10 gap-6">
                {/* Glow blob */}
                <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-2">
                  <FileText className="w-9 h-9 text-slate-600" />
                </div>
                <div>
                  <p className="text-slate-300 font-semibold text-lg">Your analysis will appear here</p>
                  <p className="text-slate-500 text-sm mt-1">Complete the steps on the left to get started</p>
                </div>
                {/* Preview chips */}
                <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                  {['Match Score', 'Missing Skills', 'Weak Areas', 'Priority Actions', 'Resume Edits', 'Strengths'].map((label) => (
                    <span
                      key={label}
                      className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-500"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}
