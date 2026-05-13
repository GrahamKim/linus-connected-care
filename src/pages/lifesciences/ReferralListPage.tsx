import { useNavigate } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell'
import { useRole } from '../../context/RoleContext'
import { REFERRAL_PACKETS } from '../../data/referrals'
import ScoreBandDisplay from '../../components/shared/ScoreBand'

export default function ReferralListPage() {
  const navigate = useNavigate()
  const { patients } = useRole()

  // Combine static referral packets with any newly consented patients from context
  const consentedPatients = patients.filter((p) => p.researchStatus === 'consented')
  const packetIds = new Set(REFERRAL_PACKETS.map((r) => r.patientId))
  const staticPackets = REFERRAL_PACKETS

  // Show newly consented patients that don't have a packet yet as "pending"
  const pendingReferrals = consentedPatients.filter((p) => !packetIds.has(p.id))

  return (
    <PageShell
      title="Research Referral Pipeline"
      subtitle="Patients who have provided explicit research consent"
    >
      {/* Trust banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex gap-3">
        <span className="text-purple-500 text-lg shrink-0">🔒</span>
        <div>
          <p className="text-sm font-semibold text-purple-900">Consent verified</p>
          <p className="text-sm text-purple-800">
            All patients listed have provided explicit, separate, post-results research consent. No patient appears here without an affirmative clinician-initiated opt-in and patient confirmation.
          </p>
        </div>
      </div>

      {/* Referral packets */}
      {staticPackets.length === 0 && pendingReferrals.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-4">📭</div>
          <p>No consented referrals yet. Referral packets appear here after patients complete research consent.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {staticPackets.map((packet) => (
            <div
              key={packet.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/lifesciences/referrals/${packet.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {packet.patientLastName}, {packet.patientFirstName}
                    </h3>
                    <span className="text-xs text-gray-400 font-mono">{packet.id}</span>
                    <span className="text-xs bg-green-100 text-green-800 font-medium px-2 py-0.5 rounded">Research consented</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Site: {packet.siteName}</span>
                    <span>·</span>
                    <span>Consent: {packet.consentDate}</span>
                    <span>·</span>
                    <span>Study: {packet.studyId}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 italic">{packet.studyName}</p>
                </div>
                <div className="shrink-0 w-48">
                  <ScoreBandDisplay band={packet.overallBand} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end">
                <span className="text-xs font-semibold text-purple-700 hover:text-purple-900">
                  View referral packet →
                </span>
              </div>
            </div>
          ))}

          {pendingReferrals.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl border border-dashed border-purple-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">⟳</div>
                <div>
                  <p className="font-semibold text-gray-900">{patient.lastName}, {patient.firstName}</p>
                  <p className="text-xs text-gray-500">Research consented · Referral packet being prepared</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-xs text-gray-400">
        Study: STU-2026-COGMCI-04 — Longitudinal Biomarker Study in Mild Cognitive Impairment. Final eligibility and enrollment decisions are made by the study team.
      </div>
    </PageShell>
  )
}
