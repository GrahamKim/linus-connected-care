import { useParams, useNavigate } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'
import { getSite } from '../../data/sites'
import ConsentGate from '../../components/shared/ConsentGate'

export default function CareConsentPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { getPatient, updatePatient } = useRole()
  const navigate = useNavigate()

  const patient = getPatient(patientId ?? '')
  if (!patient) return <div className="p-8 text-gray-500">Patient not found.</div>

  const site = getSite(patient.siteId)

  function handleConsent() {
    updatePatient(patient!.id, { careConsentStatus: 'obtained' })
    navigate(`/assessment/${patient!.id}`)
  }

  function handleDecline() {
    updatePatient(patient!.id, { careConsentStatus: 'declined' })
    navigate('/coordinator/worklist')
  }

  const warningBanner = (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-sm font-semibold text-blue-900 mb-1">About this screening</p>
      <p className="text-sm text-blue-800">
        Agreeing to this cognitive health screening does <strong>not</strong> mean you agree to participate in any research study. Research participation is a completely separate and optional decision.
      </p>
    </div>
  )

  const steps = [
    {
      title: 'About this screening',
      content: (
        <div className="space-y-3">
          <p>
            <strong>{site.name}</strong> is offering a brief cognitive wellness assessment to some of our patients. Your care team would like to offer you this screening as part of monitoring your overall health.
          </p>
          <p>
            The assessment takes approximately <strong>10 minutes</strong> and can be completed here in the office, or at home on a computer or tablet.
          </p>
          <p>It covers areas including:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Memory and recall</li>
            <li>Processing speed and attention</li>
            <li>Language and word-finding</li>
            <li>Problem-solving and reasoning</li>
          </ul>
          <p>Your clinician will review the results with you personally. The results will become part of your medical record at {site.name}.</p>
        </div>
      ),
    },
    {
      title: 'What we will and won\'t do',
      content: (
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-green-600 font-bold shrink-0">✓</span>
            <p>Your clinician will review your results and discuss them with you.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 font-bold shrink-0">✓</span>
            <p>Results will be documented in your care record at {site.name}.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 font-bold shrink-0">✓</span>
            <p>If your results suggest follow-up, your clinician will discuss options with you.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-red-500 font-bold shrink-0">✗</span>
            <p>We will not share your individual results with your health plan or any third party without your separate consent.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-red-500 font-bold shrink-0">✗</span>
            <p>We will not contact you about research studies based on this consent alone — that requires a separate, explicit decision on your part.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-red-500 font-bold shrink-0">✗</span>
            <p>Declining will have no effect on any other care you receive here.</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Confirm your consent',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">You are consenting to:</p>
            <ul className="text-sm space-y-1.5 text-gray-700">
              <li>• Completing a 10-minute digital cognitive health assessment at {site.name}</li>
              <li>• Having your results reviewed by your clinician and added to your care record</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            You may withdraw this consent at any time before the assessment is completed. Withdrawing does not affect your other care.
          </p>
          <p className="text-sm text-gray-500 italic">
            By clicking "I consent," you confirm that you have read and understood the information above and agree to proceed with the cognitive health screening.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Transparency note:</strong> Your health plan helped identify you for this screening based on your health history. This assessment is clinically validated and administered by {site.name}. Your provider will review all results with you directly.
            </p>
          </div>
        </div>
      ),
    },
  ]

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
              <div className="text-white/80 text-sm">Cognitive Wellness Screening — Care Consent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/coordinator/worklist')}
          className="mb-6 text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
        >
          ← Back to worklist
        </button>
        <div className="mb-6">
          <p className="text-sm text-gray-500">For: <strong className="text-gray-900">{patient.firstName} {patient.lastName}</strong></p>
        </div>
        <ConsentGate
          steps={steps}
          onConsent={handleConsent}
          onDecline={handleDecline}
          consentLabel="I consent to the screening"
          declineLabel="I decline"
          warningBanner={warningBanner}
        />
      </div>
    </div>
  )
}
