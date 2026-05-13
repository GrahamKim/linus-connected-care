import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell'
import { RiskBadge, OutreachBadge, ConsentBadge } from '../../components/shared/Badge'
import { useRole } from '../../context/RoleContext'
import { getSite } from '../../data/sites'
import { getOutreachAttempts, getTemplatesForSite } from '../../data/outreach'
import { OutreachAttempt } from '../../types'

const CHANNEL_LABELS = { phone: 'Phone', mail: 'Mail', portal: 'Patient Portal' }
const OUTCOME_LABELS = {
  no_answer: 'No answer',
  left_message: 'Left message',
  reached: 'Reached patient',
  wrong_number: 'Wrong number',
  declined: 'Declined',
}

export default function PatientOutreachPage() {
  const { id } = useParams<{ id: string }>()
  const { getPatient } = useRole()
  const navigate = useNavigate()

  const patient = getPatient(id ?? '')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<OutreachAttempt[]>(
    patient ? getOutreachAttempts(patient.id) : []
  )
  const [logForm, setLogForm] = useState({ channel: 'phone', outcome: 'no_answer', note: '' })
  const [showLog, setShowLog] = useState(false)

  if (!patient) return <div className="p-8 text-gray-500">Patient not found.</div>

  const site = getSite(patient.siteId)
  const templates = getTemplatesForSite(patient.siteId)
  const activeTemplate = templates.find((t) => t.id === selectedTemplate)

  function renderTemplate(body: string) {
    return body
      .replace(/\{\{patient_first_name\}\}/g, patient!.firstName)
      .replace(/\{\{site_name\}\}/g, site.name)
      .replace(/\{\{site_phone\}\}/g, site.contactPhone)
  }

  function logAttempt() {
    const newAttempt: OutreachAttempt = {
      id: `OA-${Date.now()}`,
      patientId: patient!.id,
      attemptedAt: new Date().toISOString().split('T')[0],
      channel: logForm.channel as OutreachAttempt['channel'],
      outcome: logForm.outcome as OutreachAttempt['outcome'],
      note: logForm.note || undefined,
    }
    setAttempts((prev) => [...prev, newAttempt])
    setShowLog(false)
    setLogForm({ channel: 'phone', outcome: 'no_answer', note: '' })
  }

  return (
    <PageShell
      title={`${patient.lastName}, ${patient.firstName}`}
      subtitle={`Member ID: ${patient.memberId} · ${site.name}`}
      actions={
        <button
          onClick={() => navigate('/coordinator/worklist')}
          className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg"
        >
          ← Back to worklist
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Patient card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Patient Summary</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-400">Risk tier</dt>
                <dd className="mt-0.5"><RiskBadge tier={patient.riskTier} /></dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Age group</dt>
                <dd className="text-sm text-gray-900">{patient.ageGroup}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Risk signal</dt>
                <dd className="text-sm text-gray-900">{patient.riskSignalSource}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Outreach status</dt>
                <dd className="mt-0.5"><OutreachBadge status={patient.outreachStatus} /></dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Care consent</dt>
                <dd className="mt-0.5"><ConsentBadge status={patient.careConsentStatus} /></dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Site</dt>
                <dd className="text-sm text-gray-900">{site.name}</dd>
              </div>
            </dl>
          </div>

          {/* Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-800 mb-1">Outreach guidance</p>
            <p className="text-xs text-amber-700">
              This patient is contacted as a patient of <strong>{site.name}</strong>. Do not reference Linus Health or the health plan name in any outreach.
            </p>
          </div>
        </div>

        {/* Right: Outreach history + templates */}
        <div className="lg:col-span-2 space-y-5">
          {/* Outreach history */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Outreach History</h3>
              <button
                onClick={() => setShowLog(!showLog)}
                className="text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50"
              >
                + Log attempt
              </button>
            </div>

            {showLog && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-600 mb-3">Log outreach attempt</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Channel</label>
                    <select
                      value={logForm.channel}
                      onChange={(e) => setLogForm((f) => ({ ...f, channel: e.target.value }))}
                      className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5"
                    >
                      <option value="phone">Phone</option>
                      <option value="mail">Mail</option>
                      <option value="portal">Patient portal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Outcome</label>
                    <select
                      value={logForm.outcome}
                      onChange={(e) => setLogForm((f) => ({ ...f, outcome: e.target.value }))}
                      className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5"
                    >
                      <option value="no_answer">No answer</option>
                      <option value="left_message">Left message</option>
                      <option value="reached">Reached patient</option>
                      <option value="wrong_number">Wrong number</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs text-gray-500">Note (optional)</label>
                  <input
                    type="text"
                    value={logForm.note}
                    onChange={(e) => setLogForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Add a note..."
                    className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={logAttempt}
                    className="text-xs font-semibold bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowLog(false)}
                    className="text-xs text-gray-500 px-3 py-1.5 border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {attempts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No outreach attempts recorded.</p>
            ) : (
              <div className="space-y-3">
                {attempts.map((attempt) => (
                  <div key={attempt.id} className="flex gap-3">
                    <div className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{attempt.attemptedAt}</div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {CHANNEL_LABELS[attempt.channel]}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className={`text-xs font-medium ${
                          attempt.outcome === 'reached' ? 'text-green-700' :
                          attempt.outcome === 'declined' ? 'text-red-600' :
                          'text-gray-500'
                        }`}>
                          {OUTCOME_LABELS[attempt.outcome]}
                        </span>
                      </div>
                      {attempt.note && (
                        <p className="text-xs text-gray-500 mt-1">{attempt.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Templates */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Site-Branded Outreach Templates
              <span className="ml-2 text-xs font-normal text-gray-400">({site.shortName})</span>
            </h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id === selectedTemplate ? null : t.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    selectedTemplate === t.id
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {t.channel === 'phone' ? '📞' : t.channel === 'letter' ? '✉️' : '💬'} {t.name}
                </button>
              ))}
            </div>
            {activeTemplate ? (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                {activeTemplate.subject && (
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Subject: {renderTemplate(activeTemplate.subject)}
                  </p>
                )}
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {renderTemplate(activeTemplate.body)}
                </pre>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Select a template to preview.</p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
