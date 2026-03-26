export interface MissingSkill {
  skill: string
  importance: 'high' | 'medium' | 'low'
  how_to_add: string
}

export interface WeakArea {
  area: string
  current: string
  suggested: string
}

export interface PriorityAction {
  priority: number
  action: string
  impact: 'high' | 'medium' | 'low'
}

export interface ResumeImprovement {
  section: string
  current: string
  suggested: string
}

export interface AtsKeyword {
  keyword: string
  found: boolean
  importance: 'high' | 'medium' | 'low'
}

export interface VerbImprovement {
  original: string
  improved: string
  reason: string
}

export interface ExperienceGap {
  required: string
  actual: string
  verdict: string
}

export interface AnalysisResult {
  overall_match_score: number
  summary: string
  experience_gap: ExperienceGap | null
  ats_keywords: AtsKeyword[]
  missing_skills: MissingSkill[]
  weak_areas: WeakArea[]
  strengths: string[]
  priority_actions: PriorityAction[]
  resume_improvements: ResumeImprovement[]
  verb_improvements: VerbImprovement[]
}

export interface Analysis {
  id: string
  user_id: string
  job_title: string
  company: string | null
  job_description: string
  resume_text: string
  analysis_result: AnalysisResult
  created_at: string
}
