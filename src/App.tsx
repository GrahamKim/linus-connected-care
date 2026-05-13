import { Routes, Route, Navigate } from 'react-router-dom'
import TopNav from './components/layout/TopNav'

import WorklistPage from './pages/coordinator/WorklistPage'
import PatientOutreachPage from './pages/coordinator/PatientOutreachPage'
import CareConsentPage from './pages/consent/CareConsentPage'
import ResearchConsentPage from './pages/consent/ResearchConsentPage'
import AssessmentPage from './pages/assessment/AssessmentPage'
import ClinicianWorklistPage from './pages/clinician/ClinicianWorklistPage'
import ClinicalReportPage from './pages/clinician/ClinicalReportPage'
import PayerDashboardPage from './pages/payer/PayerDashboardPage'
import ReferralListPage from './pages/lifesciences/ReferralListPage'
import ReferralDetailPage from './pages/lifesciences/ReferralDetailPage'
import PatientSummaryPage from './pages/patient/PatientSummaryPage'

export default function App() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/coordinator/worklist" replace />} />
        <Route path="/coordinator/worklist" element={<WorklistPage />} />
        <Route path="/coordinator/patient/:id/outreach" element={<PatientOutreachPage />} />
        <Route path="/consent/care/:patientId" element={<CareConsentPage />} />
        <Route path="/consent/research/:patientId" element={<ResearchConsentPage />} />
        <Route path="/assessment/:patientId" element={<AssessmentPage />} />
        <Route path="/clinician" element={<ClinicianWorklistPage />} />
        <Route path="/clinician/report/:patientId" element={<ClinicalReportPage />} />
        <Route path="/payer/dashboard" element={<PayerDashboardPage />} />
        <Route path="/lifesciences/referrals" element={<ReferralListPage />} />
        <Route path="/lifesciences/referrals/:id" element={<ReferralDetailPage />} />
        <Route path="/patient/summary/:patientId" element={<PatientSummaryPage />} />
      </Routes>
    </>
  )
}
