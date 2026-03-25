'use client'
import { useRef, useState } from 'react'
import { extractTextFromPDF } from '@/lib/pdf-parser'
import { Upload, FileCheck, Loader2 } from 'lucide-react'

interface Props {
  onExtracted: (text: string, fileName: string) => void
}

export function ResumeUpload({ onExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'parsing' | 'done'>('idle')
  const [fileName, setFileName] = useState('')

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') return
    setStatus('parsing')
    setFileName(file.name)
    const text = await extractTextFromPDF(file)
    setStatus('done')
    onExtracted(text, file.name)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
        ${status === 'done'
          ? 'border-green-500 bg-green-500/5'
          : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/30'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {status === 'idle' && (
        <>
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Drop your resume PDF here</p>
          <p className="text-slate-500 text-sm mt-1">or click to browse</p>
        </>
      )}
      {status === 'parsing' && (
        <div className="flex items-center justify-center gap-3 text-slate-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Extracting text...</span>
        </div>
      )}
      {status === 'done' && (
        <div className="flex items-center justify-center gap-3 text-green-400">
          <FileCheck className="w-6 h-6" />
          <span className="font-medium">{fileName}</span>
        </div>
      )}
    </div>
  )
}
