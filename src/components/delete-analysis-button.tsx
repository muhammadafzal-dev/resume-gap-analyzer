'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteAnalysisButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }

    const { error } = await supabase.from('analyses').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete analysis')
      return
    }
    toast.success('Analysis deleted')
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      title={confirming ? 'Click again to confirm delete' : 'Delete'}
      className={`p-1.5 rounded-lg transition-all ${
        confirming
          ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40'
          : 'text-slate-600 hover:text-red-400 hover:bg-red-500/10'
      }`}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
