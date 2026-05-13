import { ResearchReferralPacket } from '../types'
import { ASSESSMENTS } from './assessments'

const assessmentMap = Object.fromEntries(ASSESSMENTS.map((a) => [a.patientId, a]))

export const REFERRAL_PACKETS: ResearchReferralPacket[] = [
  {
    id: 'REF-2026-001',
    patientId: 'P001',
    patientFirstName: 'Margaret',
    patientLastName: 'Chen',
    contactPhone: '(617) 555-7821',
    contactEmail: 'margaret.chen@email.com',
    assessmentSummary:
      'This individual completed a validated digital cognitive assessment on May 8, 2026. The assessment found scores below the expected range for their age group in memory recall and executive function, with mild reductions in processing speed and attention. Language and naming were within expected range. Clinical follow-up has been recommended by the treating clinician.',
    overallBand: assessmentMap['P001'].overallBand,
    domains: assessmentMap['P001'].domains,
    consentDate: '2026-05-08',
    referredAt: '2026-05-08',
    siteId: 'S1',
    siteName: 'Riverside Neurology Associates',
    studyId: 'STU-2026-COGMCI-04',
    studyName: 'Longitudinal Biomarker Study in Mild Cognitive Impairment',
  },
  {
    id: 'REF-2026-002',
    patientId: 'P015',
    patientFirstName: 'Irene',
    patientLastName: 'Kowalski',
    contactPhone: '(617) 555-3309',
    contactEmail: 'irene.kowalski@email.com',
    assessmentSummary:
      'This individual completed a validated digital cognitive assessment on May 11, 2026. The assessment found scores substantially below the expected range for their age group across memory recall, processing speed, executive function, and attention. Language and naming were mildly below expected range. Clinical follow-up has been recommended by the treating clinician.',
    overallBand: assessmentMap['P015'].overallBand,
    domains: assessmentMap['P015'].domains,
    consentDate: '2026-05-11',
    referredAt: '2026-05-12',
    siteId: 'S1',
    siteName: 'Riverside Neurology Associates',
    studyId: 'STU-2026-COGMCI-04',
    studyName: 'Longitudinal Biomarker Study in Mild Cognitive Impairment',
  },
  {
    id: 'REF-2026-003',
    patientId: 'P022',
    patientFirstName: 'Leonard',
    patientLastName: 'Shaw',
    contactPhone: '(760) 555-8814',
    contactEmail: 'leonard.shaw@email.com',
    assessmentSummary:
      'This individual completed a validated digital cognitive assessment on May 10, 2026. The assessment found scores below the expected range for their age group in memory recall, executive function, language and naming, and attention. Processing speed was mildly below expected range. Clinical follow-up has been recommended by the treating clinician.',
    overallBand: assessmentMap['P022'].overallBand,
    domains: assessmentMap['P022'].domains,
    consentDate: '2026-05-10',
    referredAt: '2026-05-11',
    siteId: 'S3',
    siteName: 'Valley Geriatrics Center',
    studyId: 'STU-2026-COGMCI-04',
    studyName: 'Longitudinal Biomarker Study in Mild Cognitive Impairment',
  },
]

export function getReferralPacket(id: string): ResearchReferralPacket | undefined {
  return REFERRAL_PACKETS.find((r) => r.id === id)
}
