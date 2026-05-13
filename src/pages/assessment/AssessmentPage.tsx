import { useParams, useNavigate } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'
import { getSite } from '../../data/sites'
import { getAssessment } from '../../data/assessments'
import PageShell from '../../components/layout/PageShell'

const MODULES = [
  { name: 'Memory Recall', duration: '~2 min', icon: '🧠' },
  { name: 'Processing Speed', duration: '~2 min', icon: '⚡' },
  { name: 'Executive Function', duration: '~2 min', icon: '🎯' },
  { name: 'Language & Naming', duration: '~2 min', icon: '💬' },
  { name: 'Attention & Concentration', duration: '~2 min', icon: '👁️' },
]

export default function AssessmentPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { getPatient } = useRole()
  const navigate = useNavigate()

  const patient = getPatient(patientId ?? '')
  if (!patient) return <div className="p-8 text-gray-500">Patient not found.</div>

  const site = getSite(patient.siteId)
  const assessment = getAssessment(patient.id)
  const isComplete = patient.assessmentStatus === 'complete' || !!assessment

  const completedCount = isComplete ? 5 : patient.assessmentStatus === 'in_progress' ? 4 : 0

  return (
    <PageShell
      title="Cognitive Assessment"
      subtitle={`${patient.firstName} ${patient.lastName} · ${site.name}`}
      actions={
        <button
          onClick={() => navigate('/coordinator/worklist')}
          className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:text-gray-900"
        >
          ← Worklist
        </button>
      }
    >
      <div className="max-w-2xl mx-auto">
        {/* Status banner */}
        {isComplete ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-start gap-4">
            <div className="text-green-600 text-2xl">✓</div>
            <div>
              <p className="font-semibold text-green-900">Assessment complete</p>
              <p className="text-sm text-green-800 mt-1">
                All modules have been submitted. Results are ready for clinician review.
              </p>
              <button
                onClick={() => navigate(`/clinician/report/${patient.id}`)}
                className="mt-3 text-sm font-semibold text-green-700 border border-green-300 px-4 py-1.5 rounded-lg hover:bg-green-100"
              >
                View clinician report →
              </button>
            </div>
          </div>
        ) : patient.assessmentStatus === 'in_progress' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="font-semibold text-blue-900">Assessment in progress</p>
            <p className="text-sm text-blue-800 mt-1">4 of 5 modules completed. Awaiting final module.</p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
            <p className="font-semibold text-gray-900">Assessment not started</p>
            <p className="text-sm text-gray-600 mt-1">
              The patient has provided care consent. The assessment can be started in-clinic on a tablet or sent for at-home completion.
            </p>
          </div>
        )}

        {/* Module cards */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Assessment Modules</h3>
              <span className="text-sm text-gray-500">{completedCount}/5 complete</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${(completedCount / 5) * 100}%` }}
              />
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {MODULES.map((module, i) => {
              const done = i < completedCount
              const inProgress = i === completedCount && patient.assessmentStatus === 'in_progress'
              return (
                <div
                  key={module.name}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    inProgress ? 'bg-blue-50' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      done
                        ? 'bg-green-100 text-green-700'
                        : inProgress
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {done ? '✓' : module.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${done ? 'text-gray-900' : inProgress ? 'text-blue-900' : 'text-gray-500'}`}>
                      {module.name}
                    </div>
                    <div className="text-xs text-gray-400">{module.duration}</div>
                  </div>
                  <div className="text-xs font-medium">
                    {done ? (
                      <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded">Complete</span>
                    ) : inProgress ? (
                      <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded">In progress</span>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Assessment results are reviewed by your clinician and will be discussed with you. This assessment is not a diagnosis.
        </p>
      </div>
    </PageShell>
  )
}
