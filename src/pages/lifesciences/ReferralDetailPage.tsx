import { useParams, useNavigate } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell'
import ScoreBandDisplay from '../../components/shared/ScoreBand'
import { getReferralPacket } from '../../data/referrals'

export default function ReferralDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const packet = getReferralPacket(id ?? '')

  if (!packet) {
    return (
      <PageShell title="Referral Packet">
        <div className="text-center py-16 text-gray-400">Referral packet not found.</div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Referral Packet"
      subtitle={`${packet.id} · ${packet.studyName}`}
      actions={
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/lifesciences/referrals')}
            className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:text-gray-900"
          >
            ← All referrals
          </button>
          <button
            className="text-sm font-semibold bg-purple-700 text-white px-4 py-1.5 rounded-lg hover:bg-purple-800 opacity-60 cursor-not-allowed"
            title="PDF export — coming soon"
          >
            Download PDF
          </button>
        </div>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Consent verification banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
          <span className="text-green-600 text-lg shrink-0">✓</span>
          <div>
            <p className="text-sm font-semibold text-green-900">Research consent verified</p>
            <p className="text-sm text-green-800">
              Patient provided explicit, separate research contact consent on <strong>{packet.consentDate}</strong> following clinical review. This packet was generated only after that consent was obtained.
            </p>
          </div>
        </div>

        {/* Patient contact */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Patient Contact</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-gray-400">Name</dt>
              <dd className="text-sm font-semibold text-gray-900 mt-0.5">
                {packet.patientFirstName} {packet.patientLastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Referring site</dt>
              <dd className="text-sm text-gray-900 mt-0.5">{packet.siteName}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Phone</dt>
              <dd className="text-sm text-gray-900 mt-0.5">{packet.contactPhone}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Email</dt>
              <dd className="text-sm text-gray-900 mt-0.5">{packet.contactEmail}</dd>
            </div>
          </dl>
        </div>

        {/* Assessment summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Assessment Summary</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{packet.assessmentSummary}</p>
        </div>

        {/* Overall band */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Overall Band</h3>
          <ScoreBandDisplay band={packet.overallBand} size="lg" />
        </div>

        {/* Domain profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Cognitive Domain Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packet.domains.map((domain) => (
              <div key={domain.name}>
                <p className="text-xs font-semibold text-gray-700 mb-1">{domain.name}</p>
                <ScoreBandDisplay band={domain.band} context={domain.ageGroupContext} />
              </div>
            ))}
          </div>
        </div>

        {/* Study details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Study & Referral Details</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-gray-400">Study ID</dt>
              <dd className="text-sm font-mono text-gray-900 mt-0.5">{packet.studyId}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Study name</dt>
              <dd className="text-sm text-gray-900 mt-0.5">{packet.studyName}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Research consent date</dt>
              <dd className="text-sm text-gray-900 mt-0.5">{packet.consentDate}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Referral date</dt>
              <dd className="text-sm text-gray-900 mt-0.5">{packet.referredAt}</dd>
            </div>
          </dl>
        </div>

        <p className="text-xs text-gray-400 text-center pb-4">
          Final eligibility and enrollment decisions are made by the study team. This referral packet does not constitute enrollment.
        </p>
      </div>
    </PageShell>
  )
}
