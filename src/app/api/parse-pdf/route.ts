import { NextResponse } from 'next/server'
import { extractText, getDocumentProxy } from 'unpdf'

export async function POST(request: Request) {
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
