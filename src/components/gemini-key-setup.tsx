'use client'
import { useState } from 'react'
import { testApiKey } from '@/lib/gemini'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react'

interface Props {
  onSuccess: (key: string) => void
}

export function GeminiKeySetup({ onSuccess }: Props) {
  const [key, setKey] = useState('')
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const handleTest = async () => {
    if (!key.trim()) return
    setStatus('testing')
    const valid = await testApiKey(key.trim())
    if (valid) {
      setStatus('success')
      setTimeout(() => onSuccess(key.trim()), 800)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="api-key" className="text-slate-300">
          Your Gemini API Key
        </Label>
        <Input
          id="api-key"
          type="password"
          placeholder="AIza..."
          value={key}
          onChange={(e) => {
            setKey(e.target.value)
            setStatus('idle')
          }}
          className="font-mono bg-slate-800 border-slate-600 text-white"
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
        onClick={handleTest}
        disabled={!key || status === 'testing'}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        {status === 'testing' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {status === 'testing' ? 'Testing...' : 'Verify & Continue'}
      </Button>
      {status === 'success' && (
        <p className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" /> API key verified! Redirecting...
        </p>
      )}
      {status === 'error' && (
        <p className="flex items-center gap-2 text-red-400 text-sm">
          <XCircle className="w-4 h-4" /> Invalid API key. Please check and try again.
        </p>
      )}
    </div>
  )
}
