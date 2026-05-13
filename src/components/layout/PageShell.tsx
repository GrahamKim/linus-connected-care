import { ReactNode } from 'react'
import { useRole } from '../../context/RoleContext'

interface Props {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

// Top nav is 48px (role bar) + 44px (site branding) = 92px when branding shown, 48px otherwise
function useTopOffset() {
  const { activeRole } = useRole()
  const hasBranding = activeRole === 'coordinator' || activeRole === 'clinician' || activeRole === 'patient'
  return hasBranding ? 'pt-[92px]' : 'pt-[48px]'
}

export default function PageShell({ title, subtitle, actions, children }: Props) {
  const offset = useTopOffset()

  return (
    <div className={`min-h-screen bg-gray-50 ${offset}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}
