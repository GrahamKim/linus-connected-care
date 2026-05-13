import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'
import { getSite } from '../../data/sites'
import ConfidenceIndicator from '../../components/shared/ConfidenceIndicator'
import { RoutingDecision, DCRScores } from '../../types'

// ── Helpers ──────────────────────────────────────────────────────────────────

function recallColor(score: number, max: number) {
  const ratio = score / max
  if (ratio >= 1)   return { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300',  dot: 'bg-green-500'  }
  if (ratio >= 0.5) return { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-400'  }
  return               { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',    dot: 'bg-red-500'    }
}

function clockColor(score: number) {
  if (score >= 80) return { stroke: '#22c55e', dot: 'bg-green-500', label: 'Inside normal limits',   text: 'text-green-700' }
  if (score >= 65) return { stroke: '#f59e0b', dot: 'bg-amber-400', label: 'Borderline',              text: 'text-amber-700' }
  return               { stroke: '#ef4444', dot: 'bg-red-500',   label: 'Concerns: Clock Drawing', text: 'text-red-700'   }
}

function overallInterpretation(scores: DCRScores): { positive: boolean; detail: string[] } {
  const positive = scores.overall >= 4
  return {
    positive,
    detail: [
      `${scores.immediateRecall}/3 points from Immediate Recall`,
      `${scores.delayedRecall}/3 points from Delayed Recall`,
    ],
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreScale({ score }: { score: number }) {
  // score is 1–5; marker position as percent of bar
  const pct = ((score - 1) / 4) * 100

  return (
    <div className="mt-5">
      {/* Bar */}
      <div className="relative h-3 rounded-full overflow-visible" style={{ background: 'linear-gradient(to right, #fca5a5, #fcd34d, #86efac)' }}>
        {/* Dot markers at each integer */}
        {[1, 2, 3, 4, 5].map((n) => {
          const left = ((n - 1) / 4) * 100
          const isScore = n === score
          return (
            <div
              key={n}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white ${
                isScore
                  ? 'w-5 h-5 bg-gray-700 shadow-md z-10'
                  : n < score
                  ? 'w-3 h-3 bg-gray-500'
                  : 'w-3 h-3 bg-gray-300'
              }`}
              style={{ left: `${left}%` }}
            />
          )
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>Indication of cognitive impairment</span>
        <span>Not indicative of impairment</span>
      </div>
    </div>
  )
}

function RecallBadge({ label, score, max }: { label: string; score: number; max: number }) {
  const c = recallColor(score, max)
  const concern = score / max < 0.5
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <div className={`w-24 h-20 rounded-2xl border-2 flex items-center justify-center ${c.bg} ${c.border}`}>
        <span className={`text-2xl font-black ${c.text}`}>{score}/{max}</span>
      </div>
      <p className="text-xs text-gray-500">correct words</p>
      {concern && (
        <p className={`text-xs font-medium flex items-center gap-1 ${c.text}`}>
          <span className={`w-2 h-2 rounded-full inline-block ${c.dot}`} />
          Concerns: Verbal Memory
        </p>
      )}
    </div>
  )
}

function ClockDrawingCircle({ score }: { score: number }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const dashOffset = circ * (1 - score / 100)
  const c = clockColor(score)

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-sm font-semibold text-gray-700">Clock Drawing</p>
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="9" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke={c.stroke} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="48" textAnchor="middle" dominantBaseline="middle"
          fontSize="22" fontWeight="800" fill="#111827">{score}</text>
      </svg>
      <p className="text-xs text-gray-500">DCTclock Score</p>
      <p className={`text-xs font-medium flex items-center gap-1 ${c.text}`}>
        <span className={`w-2 h-2 rounded-full inline-block ${c.dot}`} />
        {c.label}
      </p>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ClinicalReportPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { getPatient, updatePatient } = useRole()
  const navigate = useNavigate()

  const patient = getPatient(patientId ?? '')
  const [localRouting, setLocalRouting] = useState<RoutingDecision>(
    patient?.routingDecision ?? 'pending'
  )

  if (!patient) return <div className="p-8 text-gray-500">Patient not found.</div>

  const site   = getSite(patient.siteId)
  const result = patient.assessmentResult

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-100 pt-[92px]">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-600">Assessment results are not yet available.</p>
          <button onClick={() => navigate('/clinician')} className="mt-4 text-sm text-blue-600 hover:underline">
            ← All assessments
          </button>
        </div>
      </div>
    )
  }

  const { dcrScores } = result
  const interp = overallInterpretation(dcrScores)

  function handleDocumentReviewed() {
    updatePatient(patient!.id, { routingDecision: 'within_expected' })
    setLocalRouting('within_expected')
  }
  function handleRecommendFollowUp() {
    updatePatient(patient!.id, { routingDecision: 'follow_up_suggested' })
    setLocalRouting('follow_up_suggested')
  }

  const isReviewed = localRouting !== 'pending'
  const isFollowUp = localRouting === 'follow_up_suggested'

  return (
    <div className="min-h-screen bg-gray-100 pt-[92px]">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* ── Prominent disclaimer ── */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-5 py-4 flex items-start gap-3">
          <span className="text-amber-500 text-xl shrink-0">⚠</span>
          <div>
            <p className="text-sm font-bold text-amber-900">Clinical decision support — not a diagnosis</p>
            <p className="text-sm text-amber-800 mt-0.5">
              This report is clinical decision support and does not constitute a medical diagnosis. Results must be reviewed by a qualified clinician before any clinical action is taken.
            </p>
          </div>
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{site.name}</p>
            <h1 className="text-xl font-bold text-gray-900">
              {patient.lastName}, {patient.firstName}
              <span className="ml-3 text-sm font-normal text-gray-400">{patient.ageGroup} · {patient.memberId}</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/clinician')}
            className="text-sm text-gray-500 border border-gray-300 bg-white px-3 py-1.5 rounded-lg hover:text-gray-900"
          >
            ← All assessments
          </button>
        </div>

        {/* ── DCR Report card ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="border-b border-gray-100 px-6 flex gap-6 bg-white">
            <div className="py-3 border-b-2 border-teal-600 text-sm font-semibold text-teal-700">
              DCR
            </div>
            <div className="py-3 text-sm text-gray-400">
              {result.completedAt}
            </div>
          </div>

          {/* Report body */}
          <div className="px-6 py-5">
            <p className="text-base font-semibold text-gray-800 mb-5">
              Digital Clock and Recall (DCR) Report
              <span className="ml-2 text-xs font-normal text-gray-400 align-middle">on a scale of 1–5</span>
              <span className="ml-1 text-gray-400 text-sm align-middle cursor-default" title="The DCR is a validated digital cognitive assessment measuring memory and clock-drawing ability.">ⓘ</span>
            </p>

            <div className="flex gap-8 items-start">
              {/* Left: score + scale */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-8xl font-black text-gray-900 leading-none">{dcrScores.overall}</span>
                  <div className="text-gray-500">
                    <span className="text-xl">out of</span>
                    <span className="text-5xl font-black text-gray-400 ml-2">5</span>
                  </div>
                </div>
                <ScoreScale score={dcrScores.overall} />
              </div>

              {/* Right: interpretation */}
              <div className="w-56 shrink-0 pt-1">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${interp.positive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <p className="text-sm font-semibold text-gray-800 leading-snug">
                    {interp.positive
                      ? 'DCR performance is not indicative of cognitive impairment.'
                      : 'DCR performance may be indicative of cognitive concerns.'}
                  </p>
                </div>
                {interp.detail.map((d) => (
                  <p key={d} className="text-xs text-gray-500 ml-4 mt-1">{d}</p>
                ))}
                <button className="mt-3 ml-4 text-xs text-teal-600 hover:underline">
                  View Scoring Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Subscores ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">Subscores</h2>
          <div className="grid grid-cols-3 gap-6 divide-x divide-gray-100">
            <div className="flex justify-center">
              <RecallBadge label="Immediate Recall" score={dcrScores.immediateRecall} max={3} />
            </div>
            <div className="flex justify-center">
              <ClockDrawingCircle score={dcrScores.clockDrawing} />
            </div>
            <div className="flex justify-center">
              <RecallBadge label="Delayed Recall" score={dcrScores.delayedRecall} max={3} />
            </div>
          </div>
        </div>

        {/* ── Confidence ── */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
          <ConfidenceIndicator level={result.confidenceLevel} note={result.confidenceNote} />
        </div>

        {/* ── Clinician action ── */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Clinician Action</h2>
          <p className="text-xs text-gray-400 mb-4">Review results and document your clinical decision.</p>

          {!isReviewed ? (
            <div className="flex gap-3">
              <button
                onClick={handleDocumentReviewed}
                className="flex-1 px-4 py-3 border-2 border-green-200 bg-green-50 text-green-800 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors text-left"
              >
                <div className="font-semibold mb-0.5">✓ Document as Reviewed</div>
                <div className="text-xs font-normal text-green-700">No further cognitive follow-up indicated at this time</div>
              </button>
              <button
                onClick={handleRecommendFollowUp}
                className="flex-1 px-4 py-3 border-2 border-amber-200 bg-amber-50 text-amber-800 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors text-left"
              >
                <div className="font-semibold mb-0.5">⚑ Recommend Follow-Up</div>
                <div className="text-xs font-normal text-amber-700">Additional clinical evaluation recommended</div>
              </button>
            </div>
          ) : (
            <div className={`rounded-xl border-2 p-4 ${isFollowUp ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}`}>
              <p className={`text-sm font-semibold ${isFollowUp ? 'text-amber-900' : 'text-green-900'}`}>
                {isFollowUp ? '⚑ Follow-up recommended' : '✓ Documented as reviewed'}
              </p>
              <p className={`text-xs mt-1 ${isFollowUp ? 'text-amber-700' : 'text-green-700'}`}>
                {isFollowUp
                  ? 'Recommend specialist referral, monitoring plan, or follow-up visit.'
                  : 'No further cognitive follow-up indicated. Results on file.'}
              </p>
              <button
                onClick={() => { setLocalRouting('pending'); updatePatient(patient!.id, { routingDecision: 'pending' }) }}
                className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Undo
              </button>
            </div>
          )}
        </div>

        {/* ── Research opt-in (clinician-gated) ── */}
        {isFollowUp && (
          <div className="bg-white border-2 border-purple-200 rounded-xl px-6 py-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-xl shrink-0">🔬</span>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-purple-900">Optional: Discuss Research Participation</h2>
                <p className="text-sm text-purple-800 mt-1">
                  Based on these results, this patient may be eligible for a research study. This is an additional, optional step — the patient must provide a completely separate, explicit consent.
                </p>
                <p className="mt-2 text-xs text-purple-600">Declining research has zero effect on this patient's care.</p>
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => navigate(`/consent/research/${patient.id}`)}
                    className="px-5 py-2 bg-purple-700 text-white text-sm font-semibold rounded-lg hover:bg-purple-800"
                  >
                    Offer research participation →
                  </button>
                  <button onClick={() => navigate('/clinician')} className="text-xs text-purple-500 hover:underline">
                    Skip — return to list
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {localRouting === 'within_expected' && (
          <div className="text-center pb-4">
            <button
              onClick={() => navigate('/clinician')}
              className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700"
            >
              Return to assessments
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
