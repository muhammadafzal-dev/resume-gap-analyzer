import { NextResponse } from 'next/server'
import { extractText, getDocumentProxy } from 'unpdf'

// Simple in-memory IP rate limit: max 10 PDF parses per minute per IP
const parseRequests = new Map<string, { count: number; resetAt: number }>()

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now = Date.now()
  const entry = parseRequests.get(ip)

  if (!entry || now > entry.resetAt) {
    parseRequests.set(ip, { count: 1, resetAt: now + 60_000 })
  } else if (entry.count >= 10) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  } else {
    entry.count++
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer))
    const { text } = await extractText(pdf, { mergePages: true })

    return NextResponse.json({ text })
  } catch (err) {
    console.error('[parse-pdf]', err)
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
  }
}
