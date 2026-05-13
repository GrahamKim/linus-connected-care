import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell'
import { RiskBadge, OutreachBadge, ConsentBadge, AssessmentBadge, ResearchBadge } from '../../components/shared/Badge'
import { useRole } from '../../context/RoleContext'
import { Patient, RiskTier, OutreachStatus, ConsentStatus, AssessmentStatus, ResearchStatus } from '../../types'
import { getSite } from '../../data/sites'

type TierFilter = 'all' | RiskTier
type SortCol = 'risk' | 'outreach' | 'careConsent' | 'researchConsent' | 'assessment'
type SortDir = 'asc' | 'desc'

const RISK_ORDER: Record<RiskTier, number>           = { high: 0, moderate: 1, low: 2 }
const OUTREACH_ORDER: Record<OutreachStatus, number> = { not_contacted: 0, attempted: 1, reached: 2, scheduled: 3, declined: 4 }
const CONSENT_ORDER: Record<ConsentStatus, number>   = { pending: 0, obtained: 1, declined: 2, withdrawn: 3 }
const ASSESSMENT_ORDER: Record<AssessmentStatus, number> = { not_started: 0, in_progress: 1, complete: 2 }
const RESEARCH_ORDER: Record<ResearchStatus, number> = { not_offered: 0, offered: 1, consented: 2, declined: 3 }

// Patients blocked by a declined state have no pending action
function hasPendingAction(p: Patient): boolean {
  return (
    p.outreachStatus !== 'declined' &&
    p.careConsentStatus !== 'declined' &&
    p.careConsentStatus !== 'withdrawn'
  )
}

function defaultSort(a: Patient, b: Patient): number {
  const risk = RISK_ORDER[a.riskTier] - RISK_ORDER[b.riskTier]
  if (risk !== 0) return risk
  const pending = (hasPendingAction(a) ? 0 : 1) - (hasPendingAction(b) ? 0 : 1)
  if (pending !== 0) return pending
  const outreach = OUTREACH_ORDER[a.outreachStatus] - OUTREACH_ORDER[b.outreachStatus]
  if (outreach !== 0) return outreach
  const consent = CONSENT_ORDER[a.careConsentStatus] - CONSENT_ORDER[b.careConsentStatus]
  if (consent !== 0) return consent
  return ASSESSMENT_ORDER[a.assessmentStatus] - ASSESSMENT_ORDER[b.assessmentStatus]
}

function sortPatients(patients: Patient[], col: SortCol | null, dir: SortDir): Patient[] {
  return [...patients].sort((a, b) => {
    if (col) {
      let diff = 0
      if (col === 'risk')            diff = RISK_ORDER[a.riskTier] - RISK_ORDER[b.riskTier]
      if (col === 'outreach')        diff = OUTREACH_ORDER[a.outreachStatus] - OUTREACH_ORDER[b.outreachStatus]
      if (col === 'careConsent')     diff = CONSENT_ORDER[a.careConsentStatus] - CONSENT_ORDER[b.careConsentStatus]
      if (col === 'researchConsent') diff = RESEARCH_ORDER[a.researchStatus] - RESEARCH_ORDER[b.researchStatus]
      if (col === 'assessment')      diff = ASSESSMENT_ORDER[a.assessmentStatus] - ASSESSMENT_ORDER[b.assessmentStatus]
      if (diff !== 0) return dir === 'asc' ? diff : -diff
    }
    return defaultSort(a, b)
  })
}

function getActionLabel(patient: Patient): string {
  if (patient.outreachStatus === 'not_contacted' || patient.outreachStatus === 'attempted') return 'View outreach'
  if (patient.careConsentStatus !== 'obtained') return 'Start consent'
  if (patient.assessmentStatus === 'not_started') return 'Begin assessment'
  if (patient.assessmentStatus === 'in_progress') return 'View assessment'
  if (patient.assessmentStatus === 'complete') return 'View report'
  return 'View outreach'
}

function getActionRoute(patient: Patient): string {
  if (patient.outreachStatus === 'not_contacted' || patient.outreachStatus === 'attempted') return `/coordinator/patient/${patient.id}/outreach`
  if (patient.careConsentStatus !== 'obtained') return `/consent/care/${patient.id}`
  if (patient.assessmentStatus === 'not_started') return `/assessment/${patient.id}`
  if (patient.assessmentStatus === 'in_progress') return `/assessment/${patient.id}`
  if (patient.assessmentStatus === 'complete') return `/clinician/report/${patient.id}`
  return `/coordinator/patient/${patient.id}/outreach`
}

function isActionDisabled(patient: Patient): boolean {
  return patient.careConsentStatus === 'declined' || patient.outreachStatus === 'declined'
}

function SortTh({
  col, label, activeCol, dir, onSort, className,
}: {
  col: SortCol
  label: string
  activeCol: SortCol | null
  dir: SortDir
  onSort: (c: SortCol) => void
  className?: string
}) {
  const active = activeCol === col
  return (
    <th className={`px-3 py-3 ${className ?? ''}`}>
      <button
        onClick={() => onSort(col)}
        className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide group transition-colors ${
          active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {label}
        <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-25 group-hover:opacity-50'}`}>
          {active && dir === 'desc' ? '↓' : '↑'}
        </span>
      </button>
    </th>
  )
}

export default function WorklistPage() {
  const { patients, setDemoPatientId, demoPatientId, getPatient } = useRole()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<TierFilter>('all')
  const [sortCol, setSortCol] = useState<SortCol | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const activeSiteId = getPatient(demoPatientId)?.siteId ?? 'S1'
  const sitePatients = patients.filter((p) => p.siteId === activeSiteId)

  const filtered = sortPatients(
    filter === 'all' ? sitePatients : sitePatients.filter((p) => p.riskTier === filter),
    sortCol,
    sortDir,
  )

  const counts = {
    high: sitePatients.filter((p) => p.riskTier === 'high').length,
    moderate: sitePatients.filter((p) => p.riskTier === 'moderate').length,
    low: sitePatients.filter((p) => p.riskTier === 'low').length,
  }

  function handleAction(patient: Patient) {
    setDemoPatientId(patient.id)
    navigate(getActionRoute(patient))
  }

  const site = getSite(activeSiteId)

  return (
    <PageShell
      title="Patient Worklist"
      subtitle={`${site.name} · Payer-identified members prioritized for cognitive screening`}
    >
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-700">{counts.high}</div>
          <div className="text-sm text-gray-500 mt-1">High risk</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-amber-700">{counts.moderate}</div>
          <div className="text-sm text-gray-500 mt-1">Moderate risk</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-700">{counts.low}</div>
          <div className="text-sm text-gray-500 mt-1">Low risk</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500 mr-1">Filter:</span>
        {(['all', 'high', 'moderate', 'low'] as const).map((tier) => (
          <button
            key={tier}
            onClick={() => setFilter(tier)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filter === tier
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {tier === 'all' ? 'All' : tier.charAt(0).toUpperCase() + tier.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">{filtered.length} patients</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortTh col="risk" label="Risk" activeCol={sortCol} dir={sortDir} onSort={handleSort} className="w-20" />
              <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-36">Patient</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Age</th>
              <SortTh col="outreach" label="Outreach" activeCol={sortCol} dir={sortDir} onSort={handleSort} className="w-28" />
              <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Last Contact</th>
              <SortTh col="careConsent" label="Care Consent" activeCol={sortCol} dir={sortDir} onSort={handleSort} className="w-24" />
              <SortTh col="researchConsent" label="Research Consent" activeCol={sortCol} dir={sortDir} onSort={handleSort} className="w-28" />
              <SortTh col="assessment" label="Assessment" activeCol={sortCol} dir={sortDir} onSort={handleSort} className="w-24" />
              <th className="px-3 py-3 w-36" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((patient) => {
              const disabled = isActionDisabled(patient)
              const pending = hasPendingAction(patient)
              return (
                <tr
                  key={patient.id}
                  className={`transition-colors ${pending ? 'hover:bg-blue-50' : 'hover:bg-gray-50 opacity-60'}`}
                >
                  <td className="px-3 py-3">
                    <RiskBadge tier={patient.riskTier} />
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleAction(patient)}
                      className="font-medium text-gray-900 hover:text-blue-700 text-left truncate block w-full"
                    >
                      {patient.lastName}, {patient.firstName}
                    </button>
                    <div className="text-xs text-gray-400">{patient.memberId}</div>
                  </td>
                  <td className="px-3 py-3 text-gray-600 text-xs">{patient.ageGroup}</td>
                  <td className="px-3 py-3">
                    <OutreachBadge status={patient.outreachStatus} />
                    {patient.outreachAttempts > 0 && (
                      <span className="ml-1 text-xs text-gray-400">×{patient.outreachAttempts}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-gray-600 text-xs">
                    {patient.lastContactDate ?? '—'}
                  </td>
                  <td className="px-3 py-3">
                    <ConsentBadge status={patient.careConsentStatus} />
                  </td>
                  <td className="px-3 py-3">
                    <ResearchBadge status={patient.researchStatus} />
                  </td>
                  <td className="px-3 py-3">
                    <AssessmentBadge status={patient.assessmentStatus} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => handleAction(patient)}
                      disabled={disabled}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        disabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {disabled ? 'Declined' : getActionLabel(patient)}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Risk signals derived from payer claims data. Members are contacted as patients of their clinical site, not as members of the health plan.
      </p>
    </PageShell>
  )
}
