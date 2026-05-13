import { useParams, useNavigate } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'
import { getSite } from '../../data/sites'
import ConsentGate from '../../components/shared/ConsentGate'

export default function ResearchConsentPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { getPatient, updatePatient } = useRole()
  const navigate = useNavigate()

  const patient = getPatient(patientId ?? '')
  if (!patient) return <div className="p-8 text-gray-500">Patient not found.</div>

  const site = getSite(patient.siteId)

  function handleConsent() {
    updatePatient(patient!.id, { researchStatus: 'consented' })
    navigate('/coordinator/worklist')
  }

  function handleDecline() {
    updatePatient(patient!.id, { researchStatus: 'declined' })
    navigate('/coordinator/worklist')
  }

  const warningBanner = (
    <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
      <p className="text-sm font-semibold text-gray-900 mb-1">This is separate from your care</p>
      <p className="text-sm text-gray-700">
        Agreeing or declining to research participation has <strong>no effect whatsoever on the care you receive</strong> at {site.name}. Your care team will continue to support you regardless of your decision here.
      </p>
    </div>
  )

  const steps = [
    {
      title: 'About this research study',
      content: (
        <div className="space-y-3">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs font-bold text-purple-800 uppercase tracking-wide">Research Participation — Separate from Your Care</p>
          </div>
          <p>
            Based on your recent cognitive assessment results, your clinician would like to tell you about an optional research study you may be eligible for. <strong>This is completely separate from your medical care.</strong>
          </p>
          <p>
            The study is: <strong>Longitudinal Biomarker Study in Mild Cognitive Impairment</strong> (Study ID: STU-2026-COGMCI-04).
          </p>
          <p>If you agree to be contacted, a research team member will reach out to:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Explain the study in full detail</li>
            <li>Answer all your questions</li>
            <li>Walk you through additional, study-specific consent</li>
          </ul>
          <p className="text-gray-500">Agreeing here only means you're willing to be contacted. You can decline at any point, including after the research team contacts you.</p>
        </div>
      ),
    },
    {
      title: 'What information is shared',
      content: (
        <div className="space-y-3">
          <p>If you consent to research contact, the following information will be shared with the research team:</p>
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="text-purple-500 shrink-0 font-bold">•</span>
              <p>Your name and contact information (phone, email)</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-500 shrink-0 font-bold">•</span>
              <p>A summary of your cognitive assessment results</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-500 shrink-0 font-bold">•</span>
              <p>Basic demographic information (age group)</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">What is not shared without additional study consent:</p>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Your full medical record</li>
              <li>• Your health plan information</li>
              <li>• Raw assessment data or detailed test responses</li>
            </ul>
          </div>
          <p>
            The research team is bound by their own privacy and ethics requirements. They may only use your information for purposes covered by their research protocol.
          </p>
        </div>
      ),
    },
    {
      title: 'Confirm your decision',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <p className="text-sm font-semibold text-purple-800 mb-2">If you consent, you are agreeing to:</p>
            <ul className="text-sm space-y-1.5 text-purple-700">
              <li>• Allow {site.name} to share your name, contact info, and assessment summary with the research team</li>
              <li>• Be contacted by the research team to learn more about the study</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">You retain the right to:</p>
            <ul className="text-sm space-y-1.5 text-gray-600">
              <li>• Decline at any point after being contacted</li>
              <li>• Withdraw this consent by contacting {site.name}</li>
              <li>• Receive the same quality of care regardless of your decision</li>
            </ul>
          </div>
          <p className="text-xs text-gray-500 italic">
            By clicking "I consent to research contact," you confirm that you understand this is a voluntary, separate decision from your clinical care.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-[92px]">
      {/* Research-specific header — visually distinct from care consent header */}
      <div className="bg-purple-800 text-white py-6">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-xl">🔬</div>
            <div>
              <div className="font-bold text-lg">Research Participation Consent</div>
              <div className="text-purple-200 text-sm">{site.name} · Separate from care consent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">For: <strong className="text-gray-900">{patient.firstName} {patient.lastName}</strong></p>
          <button
            onClick={() => navigate('/coordinator/worklist')}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            ← Back to worklist
          </button>
        </div>
        <ConsentGate
          steps={steps}
          onConsent={handleConsent}
          onDecline={handleDecline}
          consentLabel="I consent to research contact"
          declineLabel="No thank you"
          warningBanner={warningBanner}
        />
      </div>
    </div>
  )
}
