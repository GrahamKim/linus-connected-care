import { FunnelMetrics } from '../types'

export const FUNNEL_DATA: FunnelMetrics[] = [
  {
    siteId: 'S1',
    siteName: 'Riverside Neurology Associates',
    period: 'Q1–Q2 2026',
    membersIdentified: 148,
    membersContacted: 112,
    membersAssessed: 71,
    membersReferred: 18,
    byAgeGroup: [
      { label: '65–74', identified: 48, contacted: 38, assessed: 26, referred: 5 },
      { label: '75–84', identified: 72, contacted: 55, assessed: 35, referred: 10 },
      { label: '85+', identified: 28, contacted: 19, assessed: 10, referred: 3 },
    ],
    byGender: [
      { label: 'Female', identified: 84, contacted: 65, assessed: 42, referred: 11 },
      { label: 'Male', identified: 64, contacted: 47, assessed: 29, referred: 7 },
    ],
  },
  {
    siteId: 'S2',
    siteName: 'Oakwood Primary Care Group',
    period: 'Q1–Q2 2026',
    membersIdentified: 203,
    membersContacted: 141,
    membersAssessed: 88,
    membersReferred: 22,
    byAgeGroup: [
      { label: '65–74', identified: 89, contacted: 64, assessed: 41, referred: 9 },
      { label: '75–84', identified: 88, contacted: 61, assessed: 38, referred: 10 },
      { label: '85+', identified: 26, contacted: 16, assessed: 9, referred: 3 },
    ],
    byGender: [
      { label: 'Female', identified: 118, contacted: 83, assessed: 52, referred: 13 },
      { label: 'Male', identified: 85, contacted: 58, assessed: 36, referred: 9 },
    ],
  },
  {
    siteId: 'S3',
    siteName: 'Valley Geriatrics Center',
    period: 'Q1–Q2 2026',
    membersIdentified: 97,
    membersContacted: 78,
    membersAssessed: 54,
    membersReferred: 14,
    byAgeGroup: [
      { label: '65–74', identified: 22, contacted: 18, assessed: 13, referred: 3 },
      { label: '75–84', identified: 51, contacted: 42, assessed: 30, referred: 8 },
      { label: '85+', identified: 24, contacted: 18, assessed: 11, referred: 3 },
    ],
    byGender: [
      { label: 'Female', identified: 58, contacted: 47, assessed: 33, referred: 9 },
      { label: 'Male', identified: 39, contacted: 31, assessed: 21, referred: 5 },
    ],
  },
]

export function getAllSitesFunnel(): FunnelMetrics {
  const total = FUNNEL_DATA.reduce(
    (acc, site) => ({
      siteId: 'ALL',
      siteName: 'All Sites',
      period: site.period,
      membersIdentified: acc.membersIdentified + site.membersIdentified,
      membersContacted: acc.membersContacted + site.membersContacted,
      membersAssessed: acc.membersAssessed + site.membersAssessed,
      membersReferred: acc.membersReferred + site.membersReferred,
      byAgeGroup: [
        { label: '65–74', identified: 0, contacted: 0, assessed: 0, referred: 0 },
        { label: '75–84', identified: 0, contacted: 0, assessed: 0, referred: 0 },
        { label: '85+', identified: 0, contacted: 0, assessed: 0, referred: 0 },
      ],
      byGender: [
        { label: 'Female', identified: 0, contacted: 0, assessed: 0, referred: 0 },
        { label: 'Male', identified: 0, contacted: 0, assessed: 0, referred: 0 },
      ],
    }),
    {
      siteId: 'ALL',
      siteName: 'All Sites',
      period: '',
      membersIdentified: 0,
      membersContacted: 0,
      membersAssessed: 0,
      membersReferred: 0,
      byAgeGroup: [] as { label: string; identified: number; contacted: number; assessed: number; referred: number }[],
      byGender: [] as { label: string; identified: number; contacted: number; assessed: number; referred: number }[],
    }
  )

  const ageLabels = ['65–74', '75–84', '85+']
  const genderLabels = ['Female', 'Male']

  total.byAgeGroup = ageLabels.map((label) => ({
    label,
    identified: FUNNEL_DATA.reduce((sum, s) => sum + (s.byAgeGroup.find((g) => g.label === label)?.identified ?? 0), 0),
    contacted: FUNNEL_DATA.reduce((sum, s) => sum + (s.byAgeGroup.find((g) => g.label === label)?.contacted ?? 0), 0),
    assessed: FUNNEL_DATA.reduce((sum, s) => sum + (s.byAgeGroup.find((g) => g.label === label)?.assessed ?? 0), 0),
    referred: FUNNEL_DATA.reduce((sum, s) => sum + (s.byAgeGroup.find((g) => g.label === label)?.referred ?? 0), 0),
  }))

  total.byGender = genderLabels.map((label) => ({
    label,
    identified: FUNNEL_DATA.reduce((sum, s) => sum + (s.byGender.find((g) => g.label === label)?.identified ?? 0), 0),
    contacted: FUNNEL_DATA.reduce((sum, s) => sum + (s.byGender.find((g) => g.label === label)?.contacted ?? 0), 0),
    assessed: FUNNEL_DATA.reduce((sum, s) => sum + (s.byGender.find((g) => g.label === label)?.assessed ?? 0), 0),
    referred: FUNNEL_DATA.reduce((sum, s) => sum + (s.byGender.find((g) => g.label === label)?.referred ?? 0), 0),
  }))

  return total
}
