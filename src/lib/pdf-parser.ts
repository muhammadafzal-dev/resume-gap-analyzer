export async function extractTextFromPDF(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/parse-pdf', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to parse PDF')
  }

  const { text } = await response.json()
  return text.trim()
}
