import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "./types";

const buildPrompt = (resumeText: string, jobDescription: string) => `
You are a senior technical recruiter, ATS specialist, and career coach with 15+ years of experience.
Your task: perform a deep, honest analysis of this resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Follow these rules strictly:
1. MISSING SKILLS: Only flag a skill as missing if there is NO evidence of it anywhere in the resume, even indirectly. Do NOT flag skills that are implied by the candidate's experience or projects.
2. ATS KEYWORDS: Extract every specific technical skill, tool, framework, methodology, certification, and domain term from the job description. Check if each appears in the resume (exact or very close match). This is critical — ATS systems reject resumes that lack these exact terms.
3. EXPERIENCE GAP: Identify the required years of experience from the job description and compare to what the resume shows. Be precise.
4. VERB QUALITY: Find resume bullet points that use weak, passive, or vague verbs (e.g. "assisted", "helped", "worked on", "was responsible for", "involved in", "participated", "supported", "contributed to"). Rewrite them with strong action verbs and quantified impact where possible.
5. SCORING: Score honestly. A candidate missing key requirements should score below 50. A strong match should score 75+. Do not inflate scores.
6. IMPROVEMENTS: Give specific, copy-paste-ready suggestions — not generic advice.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no trailing commas):
{
  "overall_match_score": <number 0-100>,
  "summary": "<3-4 sentence honest assessment covering fit, key gaps, and biggest strengths>",
  "experience_gap": {
    "required": "<what the job requires, e.g. '5+ years React'>",
    "actual": "<what the resume shows, e.g. '2 years React'>",
    "verdict": "<one sentence on whether this is a blocker or manageable>"
  },
  "ats_keywords": [
    {"keyword": "<exact term from JD>", "found": true|false, "importance": "high|medium|low"}
  ],
  "missing_skills": [
    {"skill": "<skill name>", "importance": "high|medium|low", "how_to_add": "<specific, actionable advice on how to add or demonstrate this skill>"}
  ],
  "weak_areas": [
    {"area": "<area name>", "current": "<what the resume currently shows>", "suggested": "<specific improvement>"}
  ],
  "strengths": ["<specific strength from the resume, not generic>"],
  "priority_actions": [
    {"priority": 1, "action": "<specific, actionable step the candidate should take>", "impact": "high|medium|low"}
  ],
  "resume_improvements": [
    {"section": "<exact section name>", "current": "<current text, verbatim if short>", "suggested": "<rewritten version ready to copy-paste>"}
  ],
  "verb_improvements": [
    {"original": "<original bullet point>", "improved": "<rewritten with strong verb + quantified impact>", "reason": "<why this is stronger>"}
  ]
}

If experience_gap cannot be determined from the resume or job description, set it to null.
`;

export async function analyzeResume(
  apiKey: string,
  resumeText: string,
  jobDescription: string,
): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(
    buildPrompt(resumeText, jobDescription),
  );
  const text = result.response.text().trim();

  // Strip markdown code blocks if Gemini wraps the response
  const jsonText = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(jsonText) as AnalysisResult;
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    await model.generateContent('Say "ok"');
    return true;
  } catch {
    return false;
  }
}
