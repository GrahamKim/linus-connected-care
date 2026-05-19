export type RiskTier = 'high' | 'moderate' | 'low'

export type OutreachStatus =
  | 'not_contacted'
  | 'attempted'
  | 'reached'
  | 'declined'
  | 'scheduled'

export type ConsentStatus = 'pending' | 'obtained' | 'declined' | 'withdrawn'
export type AssessmentStatus = 'not_started' | 'in_progress' | 'complete'
export type RoutingDecision = 'within_expected' | 'follow_up_suggested' | 'pending'
export type ResearchStatus = 'not_offered' | 'offered' | 'consented' | 'declined'

export type ScoreBand = 'within_expected_range' | 'mildly_below_expected' | 'below_expected'

export interface CognitiveDomain {
  name: string
  band: ScoreBand
  ageGroupContext: string
}

export interface DCRScores {
  overall: number         // 1–5
  immediateRecall: number // 0–3
  clockDrawing: number    // 0–100
  delayedRecall: number   // 0–3
}

export interface AssessmentResult {
  patientId: string
  completedAt: string
  overallBand: ScoreBand
  overallBandLabel: string
  domains: CognitiveDomain[]
  confidenceLevel: 'high' | 'medium' | 'low'
  confidenceNote: string
  dcrScores: DCRScores
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  ageGroup: string
  memberId: string
  siteId: string
  riskTier: RiskTier
  riskSignalSource: string
  outreachStatus: OutreachStatus
  outreachAttempts: number
  lastContactDate: string | null
  careConsentStatus: ConsentStatus
  assessmentStatus: AssessmentStatus
  assessmentResult?: AssessmentResult
  routingDecision: RoutingDecision
  researchStatus: ResearchStatus
}

export interface OutreachAttempt {
  id: string
  patientId: string
  attemptedAt: string
  channel: 'phone' | 'mail' | 'portal'
  outcome: 'no_answer' | 'left_message' | 'reached' | 'wrong_number' | 'declined'
  note?: string
}

export interface OutreachTemplate {
  id: string
  name: string
  channel: 'phone' | 'letter' | 'portal'
  siteId: string
  subject?: string
  body: string
}

export interface ClinicalSite {
  id: string
  name: string
  shortName: string
  logoColor: string
  headerBg: string
  address: string
  contactPhone: string
}

export interface DemographicCut {
  label: string
  identified: number
  contacted: number
  assessed: number
  referred: number
}

export interface AssessmentOutcomes {
  belowExpected: number
  mildlyBelow: number
  withinExpected: number
}

export interface FunnelMetrics {
  siteId: string
  siteName: string
  period: string
  membersIdentified: number
  membersContacted: number
  membersAssessed: number
  membersReferred: number
  assessmentOutcomes: AssessmentOutcomes
  byAgeGroup: DemographicCut[]
  byGender: DemographicCut[]
}

export interface ResearchReferralPacket {
  id: string
  patientId: string
  patientFirstName: string
  patientLastName: string
  contactPhone: string
  contactEmail: string
  assessmentSummary: string
  overallBand: ScoreBand
  domains: CognitiveDomain[]
  consentDate: string
  referredAt: string
  siteId: string
  siteName: string
  studyId: string
  studyName: string
}
