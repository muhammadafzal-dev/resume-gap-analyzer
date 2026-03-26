import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Dynamic import avoids Next.js bundling pdf-parse at build time
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)

    return NextResponse.json({ text: data.text })
  } catch (err) {
    console.error('[parse-pdf]', err)
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
  }
}
