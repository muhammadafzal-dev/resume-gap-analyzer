import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AnalysisResult } from './types'

const buildPrompt = (resumeText: string, jobDescription: string) => `
You are an expert career coach and ATS specialist. Analyze this resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "overall_match_score": <number 0-100>,
  "summary": "<2-3 sentence honest assessment>",
  "missing_skills": [
    {"skill": "<skill name>", "importance": "high|medium|low", "how_to_add": "<specific advice>"}
  ],
  "weak_areas": [
    {"area": "<area name>", "current": "<what resume shows>", "suggested": "<what to change>"}
  ],
  "strengths": ["<strength 1>", "<strength 2>"],
  "priority_actions": [
    {"priority": 1, "action": "<specific action>", "impact": "high|medium|low"}
  ],
  "resume_improvements": [
    {"section": "<section name>", "current": "<current text or description>", "suggested": "<improved version>"}
  ]
}
`

export async function analyzeResume(
  apiKey: string,
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent(buildPrompt(resumeText, jobDescription))
  const text = result.response.text().trim()

  // Strip markdown code blocks if Gemini wraps the response
  const jsonText = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(jsonText) as AnalysisResult
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    await model.generateContent('Say "ok"')
    return true
  } catch {
    return false
  }
}
