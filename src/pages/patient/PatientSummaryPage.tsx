import { useParams, useNavigate } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'
import { getSite } from '../../data/sites'
import { ScoreBand } from '../../types'

const PLAIN_BAND: Record<ScoreBand, { label: string; description: string; color: string; bg: string }> = {
  within_expected_range: {
    label: 'In line with expectations',
    description: 'Your scores in this area were in line with what we expect for someone your age.',
    color: 'text-green-800',
    bg: 'bg-green-50 border-green-200',
  },
  mildly_below_expected: {
    label: 'Slightly below expectations',
    description: 'Your scores in this area were slightly below what we typically see for your age group. Your doctor will discuss what this means.',
    color: 'text-amber-800',
    bg: 'bg-amber-50 border-amber-200',
  },
  below_expected: {
    label: 'Below expectations',
    description: 'Your scores in this area were below what we typically see for your age group. Your doctor will talk with you about next steps.',
    color: 'text-red-800',
    bg: 'bg-red-50 border-red-200',
  },
}

const DOMAIN_PLAIN: Record<string, string> = {
  'Memory Recall': 'Memory',
  'Processing Speed': 'How quickly you process information',
  'Executive Function': 'Planning and problem-solving',
  'Language & Naming': 'Language and word-finding',
  'Attention & Concentration': 'Focus and attention',
}

export default function PatientSummaryPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { getPatient } = useRole()
  const navigate = useNavigate()

  const patient = getPatient(patientId ?? '')
  if (!patient) return <div className="p-8 text-gray-500">Patient not found.</div>

  const site = getSite(patient.siteId)
  const result = patient.assessmentResult

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[92px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-600">Your assessment results are not yet available.</p>
          <p className="text-gray-500 text-sm mt-2">Your care team at {site.name} will be in touch when they're ready.</p>
        </div>
      </div>
    )
  }

  const overallConfig = PLAIN_BAND[result.overallBand]

  return (
    <div className="min-h-screen bg-gray-50 pt-[92px]">
      {/* Site-branded header */}
      <div className={`${site.logoColor} text-white py-6`}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">
              {site.shortName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-lg">{site.name}</div>
              <div className="text-white/80 text-sm">Your Cognitive Wellness Results</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hi {patient.firstName},</h1>
          <p className="text-gray-600 mt-2">
            Here is a summary of your cognitive wellness assessment from {result.completedAt}. Your care team at {site.name} has reviewed these results and will walk you through them.
          </p>
        </div>

        {/* Overall result */}
        <div className={`rounded-xl border-2 p-6 ${overallConfig.bg}`}>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Overall result</p>
          <p className={`text-xl font-bold ${overallConfig.color}`}>{overallConfig.label}</p>
          <p className="text-sm text-gray-700 mt-2">
            {result.overallBand === 'within_expected_range'
              ? `Your thinking and memory scores were in line with what we expect for someone your age. This is a good sign.`
              : result.overallBand === 'mildly_below_expected'
              ? `Your thinking and memory scores were slightly below what we typically see for your age group. Your doctor will talk with you about what this means and whether any follow-up is helpful.`
              : `Your thinking and memory scores were below what we typically see for your age group. This doesn't mean something is definitely wrong — but your doctor will talk with you about it and suggest some next steps.`}
          </p>
        </div>

        {/* What we assessed */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">What we assessed</h2>
          <div className="space-y-3">
            {result.domains.map((domain) => {
              const config = PLAIN_BAND[domain.band]
              const plainName = DOMAIN_PLAIN[domain.name] ?? domain.name
              return (
                <div key={domain.name} className={`rounded-lg border p-3 ${config.bg}`}>
                  <div className={`text-sm font-semibold ${config.color}`}>{plainName}</div>
                  <p className="text-xs text-gray-600 mt-0.5">{config.description}</p>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            These results reflect how you did on this assessment today, compared to others your age. They are one piece of information — not a diagnosis.
          </p>
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">What happens next</h2>
          {patient.routingDecision === 'follow_up_suggested' ? (
            <div className="space-y-3 text-sm text-gray-700">
              <p>Your care team recommends a follow-up appointment to discuss your results in more detail.</p>
              <p>They may suggest:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>A visit with a specialist</li>
                <li>Additional health checks</li>
                <li>A monitoring plan to track changes over time</li>
              </ul>
              <p>There's no need to worry — your team will explain everything and answer your questions.</p>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-gray-700">
              <p>Your results look good. Your doctor may recommend:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Continuing your regular check-ups</li>
                <li>Staying active and keeping up healthy habits</li>
                <li>A follow-up assessment in the future to track any changes</li>
              </ul>
            </div>
          )}
        </div>

        {/* Research (only if consented) */}
        {patient.researchStatus === 'consented' && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <h2 className="font-semibold text-purple-900 mb-2">Research study</h2>
            <p className="text-sm text-purple-800">
              You agreed to be contacted about a research study. A member of the research team will reach out to you separately. You can change your mind at any time — just let your care team at {site.name} know.
            </p>
          </div>
        )}

        {/* Questions */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Questions?</h2>
          <p className="text-sm text-gray-600">
            Your care team at <strong>{site.name}</strong> is here to help. Please call us at{' '}
            <strong>{site.contactPhone}</strong> if you have any questions about your results or what they mean.
          </p>
        </div>

        <div className="text-center pb-6">
          <button
            onClick={() => navigate('/coordinator/worklist')}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ← Back to coordinator view
          </button>
        </div>
      </div>
    </div>
  )
}
