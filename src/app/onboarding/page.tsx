'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GeminiKeySetup } from '@/components/gemini-key-setup'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleApiKeySuccess = async (apiKey: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ gemini_api_key: apiKey, onboarding_completed: true })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to save API key. Please try again.')
      return
    }

    toast.success("Setup complete! Let's analyze your resume.")
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <FileText className="w-6 h-6 text-blue-400" />
        <span className="font-bold text-white text-lg">ResumeGap</span>
      </div>

      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Connect your Gemini API</CardTitle>
          <CardDescription className="text-slate-400">
            Your API key is stored securely and only used to analyze your resume.
            We never see your resume content — it&apos;s analyzed directly in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeminiKeySetup onSuccess={handleApiKeySuccess} />
        </CardContent>
      </Card>

      <p className="text-slate-600 text-xs mt-6 max-w-sm text-center">
        Your Gemini API key is free. Google provides generous usage limits for personal use.
      </p>
    </div>
  )
}
