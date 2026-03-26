'use client'
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'

const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Software Engineer',
  'Principal Software Engineer',
  'Frontend Developer',
  'Senior Frontend Developer',
  'Backend Developer',
  'Senior Backend Developer',
  'Full Stack Developer',
  'Senior Full Stack Developer',
  'React Developer',
  'Node.js Developer',
  'iOS Developer',
  'Android Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Cloud Engineer',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'Product Manager',
  'Engineering Manager',
  'Tech Lead',
  'Solutions Architect',
  'QA Engineer',
  'Security Engineer',
  'UI/UX Designer',
]

interface Props {
  value: string
  onChange: (value: string) => void
}

export function JobTitleInput({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleInput = (v: string) => {
    onChange(v)
    if (v.trim().length > 0) {
      setFiltered(JOB_TITLES.filter((t) => t.toLowerCase().includes(v.toLowerCase())).slice(0, 6))
      setOpen(true)
    } else {
      setFiltered(JOB_TITLES.slice(0, 6))
      setOpen(true)
    }
  }

  const handleSelect = (title: string) => {
    onChange(title)
    setOpen(false)
  }

  const handleFocus = () => {
    setFiltered(value.trim() ? JOB_TITLES.filter((t) => t.toLowerCase().includes(value.toLowerCase())).slice(0, 6) : JOB_TITLES.slice(0, 6))
    setOpen(true)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Input
        placeholder="e.g. Senior Engineer"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={handleFocus}
        className="bg-slate-800 border-slate-600 text-white"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((title) => (
            <li
              key={title}
              onMouseDown={() => handleSelect(title)}
              className="px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
