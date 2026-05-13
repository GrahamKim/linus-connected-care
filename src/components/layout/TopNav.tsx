import { useNavigate } from 'react-router-dom'
import { useRole, Role } from '../../context/RoleContext'
import { getSite } from '../../data/sites'

const ROLES: { id: Role; label: string; home: string }[] = [
  { id: 'coordinator', label: 'Care Coordinator', home: '/coordinator/worklist' },
  { id: 'clinician', label: 'Clinician', home: '/clinician' },
  { id: 'payer', label: 'Payer', home: '/payer/dashboard' },
  { id: 'lifesciences', label: 'Life Sciences', home: '/lifesciences/referrals' },
  { id: 'patient', label: 'Patient View', home: '/patient/summary/P001' },
]

export default function TopNav() {
  const { activeRole, setActiveRole, demoPatientId } = useRole()
  const navigate = useNavigate()

  function switchRole(role: Role, home: string) {
    setActiveRole(role)
    // Deep-link patient-specific roles to the demo patient
    if (role === 'clinician') {
      navigate('/clinician')
    } else if (role === 'patient') {
      navigate('/patient/summary/P001')
    } else {
      navigate(home)
    }
  }

  // Show site branding for coordinator/clinician based on the demo patient's site
  const showSiteBranding = activeRole === 'coordinator' || activeRole === 'clinician' || activeRole === 'patient'

  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
      {/* Role switcher bar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 h-12">
          <span className="text-gray-400 text-xs font-medium mr-3 shrink-0">DEMO VIEW:</span>
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => switchRole(r.id, r.home)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeRole === r.id
                  ? 'bg-white text-gray-900'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {r.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-gray-500 text-xs">Connected Care</span>
            <span className="text-gray-600 text-xs">v1 Prototype</span>
          </div>
        </div>
      </div>

      {/* Site branding bar */}
      {showSiteBranding && <SiteBrandingBar />}
    </div>
  )
}

function SiteBrandingBar() {
  const { getPatient, demoPatientId, activeRole } = useRole()
  const patient = getPatient(demoPatientId)
  const site = patient ? getSite(patient.siteId) : null

  if (!site) return null

  const colorClass = site.logoColor

  const userLabel =
    activeRole === 'clinician'
      ? 'Clinician Portal'
      : activeRole === 'patient'
      ? 'Patient Portal'
      : 'Care Coordinator'

  return (
    <div className={`${colorClass} text-white`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center h-11">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center text-xs font-bold">
            {site.shortName.charAt(0)}
          </div>
          <span className="font-semibold text-sm">{site.name}</span>
          <span className="text-white/60 text-xs">|</span>
          <span className="text-white/80 text-xs">{userLabel}</span>
        </div>
        <div className="ml-auto text-white/70 text-xs">{site.contactPhone}</div>
      </div>
    </div>
  )
}
