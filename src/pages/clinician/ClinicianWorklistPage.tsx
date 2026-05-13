import { useNavigate } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell'
import { useRole } from '../../context/RoleContext'
import { getSite } from '../../data/sites'
import ScoreBandDisplay from '../../components/shared/ScoreBand'
import { RiskBadge } from '../../components/shared/Badge'
import { Patient } from '../../types'

function RoutingChip({ decision }: { decision: Patient['routingDecision'] }) {
  if (decision === 'follow_up_suggested') {
    return (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
        Follow-up recommended
      </span>
    )
  }
  if (decision === 'within_expected') {
    return (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        Reviewed
      </span>
    )
  }
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
      Awaiting review
    </span>
  )
}

export default function ClinicianWorklistPage() {
  const { patients, demoPatientId, getPatient, setDemoPatientId } = useRole()
  const navigate = useNavigate()

  const activeSiteId = getPatient(demoPatientId)?.siteId ?? 'S1'
  const site = getSite(activeSiteId)

  const completedPatients = patients.filter(
    (p) => p.siteId === activeSiteId && p.assessmentStatus === 'complete'
  )

  const pendingReview = completedPatients.filter((p) => p.routingDecision === 'pending')
  const reviewed = completedPatients.filter((p) => p.routingDecision !== 'pending')

  function openReport(patient: Patient) {
    setDemoPatientId(patient.id)
    navigate(`/clinician/report/${patient.id}`)
  }

  return (
    <PageShell
      title="Completed Assessments"
      subtitle={`${site.name} · Select a patient to review their report`}
    >
      {completedPatients.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-4">📋</div>
          <p>No completed assessments yet for {site.name}.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending review */}
          {pendingReview.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Awaiting review
                <span className="ml-1 text-xs font-normal text-gray-400">({pendingReview.length})</span>
              </h2>
              <div className="space-y-3">
                {pendingReview.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} onOpen={openReport} />
                ))}
              </div>
            </section>
          )}

          {/* Already reviewed */}
          {reviewed.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                Previously reviewed
                <span className="ml-1 text-xs font-normal text-gray-400">({reviewed.length})</span>
              </h2>
              <div className="space-y-3">
                {reviewed.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} onOpen={openReport} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageShell>
  )
}

function PatientCard({ patient, onOpen }: { patient: Patient; onOpen: (p: Patient) => void }) {
  const result = patient.assessmentResult
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-5"
      onClick={() => onOpen(patient)}
    >
      {/* Patient info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-gray-900">
            {patient.lastName}, {patient.firstName}
          </span>
          <RiskBadge tier={patient.riskTier} />
          <RoutingChip decision={patient.routingDecision} />
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Age group: {patient.ageGroup}</span>
          {result && <span>Assessed: {result.completedAt}</span>}
          <span>Member ID: {patient.memberId}</span>
        </div>
      </div>

      {/* Score band preview */}
      {result && (
        <div className="w-52 shrink-0">
          <ScoreBandDisplay band={result.overallBand} context={result.overallBandLabel} />
        </div>
      )}

      <div className="shrink-0 text-sm font-semibold text-blue-600 whitespace-nowrap">
        View report →
      </div>
    </div>
  )
}
