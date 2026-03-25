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

export interface AnalysisResult {
  overall_match_score: number
  summary: string
  missing_skills: MissingSkill[]
  weak_areas: WeakArea[]
  strengths: string[]
  priority_actions: PriorityAction[]
  resume_improvements: ResumeImprovement[]
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
