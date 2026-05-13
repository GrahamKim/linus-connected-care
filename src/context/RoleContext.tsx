import { createContext, useContext, useState, ReactNode } from 'react'
import { Patient } from '../types'
import { PATIENTS } from '../data/patients'

export type Role = 'coordinator' | 'clinician' | 'payer' | 'lifesciences' | 'patient'

interface RoleContextValue {
  activeRole: Role
  setActiveRole: (r: Role) => void
  demoPatientId: string
  setDemoPatientId: (id: string) => void
  patients: Patient[]
  updatePatient: (id: string, updates: Partial<Patient>) => void
  getPatient: (id: string) => Patient | undefined
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<Role>('coordinator')
  const [demoPatientId, setDemoPatientId] = useState('P001')
  const [patients, setPatients] = useState<Patient[]>(PATIENTS)

  function updatePatient(id: string, updates: Partial<Patient>) {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  function getPatient(id: string) {
    return patients.find((p) => p.id === id)
  }

  return (
    <RoleContext.Provider
      value={{ activeRole, setActiveRole, demoPatientId, setDemoPatientId, patients, updatePatient, getPatient }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
