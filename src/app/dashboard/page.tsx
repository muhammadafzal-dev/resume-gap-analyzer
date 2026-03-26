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
import { Loader2, FileText, History, LogOut, Settings } from 'lucide-react'
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span className="font-bold">ResumeGap</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/history')}>
            <History className="w-4 h-4 mr-2" /> History
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </nav>

      <div className="flex-1 overflow-hidden max-w-6xl w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Input Panel */}
          <div className="space-y-5 overflow-y-auto pr-1">
            <h1 className="text-2xl font-bold">Analyze Your Resume</h1>

            <div>
              <Label className="text-slate-300 mb-2 block">Resume (PDF)</Label>
              <ResumeUpload onExtracted={(text) => setResumeText(text)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-300 mb-2 block">Job Title</Label>
                <JobTitleInput value={jobTitle} onChange={setJobTitle} />
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block">Company (optional)</Label>
                <Input
                  placeholder="e.g. Stripe"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Job Description</Label>
              <Textarea
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white min-h-[200px]"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText || !jobDescription}
              className="w-full bg-blue-500 hover:bg-blue-600"
              size="lg"
            >
              {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Gap →'}
            </Button>
          </div>

          {/* Result Panel */}
          <div ref={resultRef} className="overflow-y-auto pr-1">
            {result ? (
              <AnalysisResultView result={result} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center min-h-[400px]">
                <div>
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Your analysis results will appear here</p>
                  <p className="text-xs mt-2 text-slate-600">
                    Upload a resume and paste a job description to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
