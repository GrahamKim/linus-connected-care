import { useState, ReactNode } from 'react'

export interface ConsentStep {
  title: string
  content: ReactNode
}

interface Props {
  steps: ConsentStep[]
  onConsent: () => void
  onDecline: () => void
  consentLabel?: string
  declineLabel?: string
  warningBanner?: ReactNode
}

export default function ConsentGate({
  steps,
  onConsent,
  onDecline,
  consentLabel = 'I consent',
  declineLabel = 'I decline',
  warningBanner,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const isLast = currentStep === steps.length - 1

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                i < currentStep
                  ? 'bg-green-600 border-green-600 text-white'
                  : i === currentStep
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-gray-200 text-gray-400 bg-white'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${
                i === currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {step.title}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {warningBanner && <div className="mb-6">{warningBanner}</div>}

      {/* Step content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{steps[currentStep].title}</h2>
        <div className="text-sm text-gray-700 space-y-3">{steps[currentStep].content}</div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        {currentStep > 0 ? (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={onDecline}
            className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            {declineLabel}
          </button>
          {isLast ? (
            <button
              onClick={onConsent}
              className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {consentLabel}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
