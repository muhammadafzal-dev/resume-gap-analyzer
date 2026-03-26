'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { testApiKey } from '@/lib/gemini'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react'
import { Logo } from '@/components/logo'
import { toast } from 'sonner'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [apiKey, setApiKey] = useState('')
  const [newKey, setNewKey] = useState('')
  const [status, setStatus] = useState<'idle' | 'testing' | 'saving' | 'success' | 'error'>('idle')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('gemini_api_key').eq('id', user.id).single()
      if (data?.gemini_api_key) setApiKey(data.gemini_api_key)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!newKey.trim()) return
    setStatus('testing')
    const valid = await testApiKey(newKey.trim())
    if (!valid) {
      setStatus('error')
      return
    }
    setStatus('saving')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ gemini_api_key: newKey.trim() })
      .eq('id', user.id)
    if (error) {
      toast.error('Failed to save. Please try again.')
      setStatus('idle')
      return
    }
    setApiKey(newKey.trim())
    setNewKey('')
    setStatus('success')
    toast.success('API key updated!')
    setTimeout(() => setStatus('idle'), 2000)
  }

  const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${'•'.repeat(20)}` : 'Not set'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-bold">ResumeGap</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
        </Button>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Gemini API Key</CardTitle>
            <CardDescription className="text-slate-400">
              Current key: <span className="font-mono text-slate-300">{maskedKey}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">New API Key</Label>
              <Input
                type="password"
                placeholder="AIza..."
                value={newKey}
                onChange={(e) => { setNewKey(e.target.value); setStatus('idle') }}
                className="bg-slate-800 border-slate-600 text-white font-mono"
              />
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline flex items-center gap-1"
            >
              Get a free Gemini API key <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              onClick={handleSave}
              disabled={!newKey || status === 'testing' || status === 'saving'}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {(status === 'testing' || status === 'saving') && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {status === 'testing' ? 'Verifying...' : status === 'saving' ? 'Saving...' : 'Update Key'}
            </Button>
            {status === 'success' && (
              <p className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle className="w-4 h-4" /> API key updated successfully
              </p>
            )}
            {status === 'error' && (
              <p className="flex items-center gap-2 text-red-500 text-sm">
                <XCircle className="w-4 h-4" /> Invalid API key. Please check and try again.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
