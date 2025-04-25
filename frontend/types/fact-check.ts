export interface FactCheckResponse {
  claim: string
  assessment: string
  explanation: string
  paper_analyses: PaperAnalysis[]
  references: Reference[]
  papers: Paper[]
  human_friendly_response: string
}

export interface PaperAnalysis {
  paper_number: number
  relation_to_claim: string
}

export interface Reference {
  title: string
  url: string
}

export interface Paper {
  title: string
  snippet: string
  url: string
  authors?: string[]
  year?: string
  publication?: string
  citation_count?: number
  relevance?: string
  key_findings?: string
  position?: string
}
