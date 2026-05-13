import { ClinicalSite } from '../types'

export const SITES: ClinicalSite[] = [
  {
    id: 'S1',
    name: 'Riverside Neurology Associates',
    shortName: 'Riverside Neurology',
    logoColor: 'bg-blue-700',
    headerBg: 'bg-blue-700',
    address: '1240 Riverside Drive, Suite 300, Boston, MA 02134',
    contactPhone: '(617) 555-0142',
  },
  {
    id: 'S2',
    name: 'Oakwood Primary Care Group',
    shortName: 'Oakwood Primary Care',
    logoColor: 'bg-emerald-700',
    headerBg: 'bg-emerald-700',
    address: '88 Oak Street, Cambridge, MA 02139',
    contactPhone: '(617) 555-0287',
  },
  {
    id: 'S3',
    name: 'Valley Geriatrics Center',
    shortName: 'Valley Geriatrics',
    logoColor: 'bg-violet-700',
    headerBg: 'bg-violet-700',
    address: '415 Valley Road, Somerville, MA 02143',
    contactPhone: '(617) 555-0391',
  },
]

export function getSite(id: string): ClinicalSite {
  return SITES.find((s) => s.id === id) ?? SITES[0]
}
