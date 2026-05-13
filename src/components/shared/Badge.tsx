import { RiskTier, OutreachStatus, ConsentStatus, AssessmentStatus, ResearchStatus } from '../../types'

const RISK_COLORS: Record<RiskTier, string> = {
  high: 'bg-red-100 text-red-800 border border-red-200',
  moderate: 'bg-amber-100 text-amber-800 border border-amber-200',
  low: 'bg-green-100 text-green-800 border border-green-200',
}

const RISK_LABELS: Record<RiskTier, string> = {
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
}

export function RiskBadge({ tier }: { tier: RiskTier }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${RISK_COLORS[tier]}`}>
      {tier === 'high' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />}
      {tier === 'moderate' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />}
      {tier === 'low' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />}
      {RISK_LABELS[tier]}
    </span>
  )
}

const OUTREACH_COLORS: Record<OutreachStatus, string> = {
  not_contacted: 'bg-gray-100 text-gray-600',
  attempted: 'bg-yellow-100 text-yellow-800',
  reached: 'bg-blue-100 text-blue-800',
  declined: 'bg-red-100 text-red-700',
  scheduled: 'bg-green-100 text-green-800',
}

const OUTREACH_LABELS: Record<OutreachStatus, string> = {
  not_contacted: 'Not contacted',
  attempted: 'Attempted',
  reached: 'Reached',
  declined: 'Declined',
  scheduled: 'Scheduled',
}

export function OutreachBadge({ status }: { status: OutreachStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${OUTREACH_COLORS[status]}`}>
      {OUTREACH_LABELS[status]}
    </span>
  )
}

const CONSENT_COLORS: Record<ConsentStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  obtained: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-700',
  withdrawn: 'bg-orange-100 text-orange-800',
}

const CONSENT_LABELS: Record<ConsentStatus, string> = {
  pending: 'Pending',
  obtained: 'Obtained',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
}

export function ConsentBadge({ status }: { status: ConsentStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${CONSENT_COLORS[status]}`}>
      {CONSENT_LABELS[status]}
    </span>
  )
}

const ASSESSMENT_COLORS: Record<AssessmentStatus, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-800',
  complete: 'bg-green-100 text-green-800',
}

const ASSESSMENT_LABELS: Record<AssessmentStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  complete: 'Complete',
}

export function AssessmentBadge({ status }: { status: AssessmentStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${ASSESSMENT_COLORS[status]}`}>
      {ASSESSMENT_LABELS[status]}
    </span>
  )
}

const RESEARCH_COLORS: Record<ResearchStatus, string> = {
  not_offered: 'bg-gray-100 text-gray-500',
  offered: 'bg-purple-100 text-purple-800',
  consented: 'bg-purple-200 text-purple-900',
  declined: 'bg-gray-100 text-gray-600',
}

const RESEARCH_LABELS: Record<ResearchStatus, string> = {
  not_offered: '—',
  offered: 'Offered',
  consented: 'Consented',
  declined: 'Declined',
}

export function ResearchBadge({ status }: { status: ResearchStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${RESEARCH_COLORS[status]}`}>
      {RESEARCH_LABELS[status]}
    </span>
  )
}
