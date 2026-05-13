import { useState } from 'react'
import PageShell from '../../components/layout/PageShell'
import { FUNNEL_DATA, getAllSitesFunnel } from '../../data/funnel'
import { FunnelMetrics, DemographicCut } from '../../types'

function pct(num: number, denom: number): string {
  if (denom === 0) return '—'
  return `${Math.round((num / denom) * 100)}%`
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-4">
      <div className="w-36 text-right text-xs font-medium text-gray-600 shrink-0">{label}</div>
      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
        <div
          className={`h-full rounded-lg transition-all ${color}`}
          style={{ width: `${width}%` }}
        />
        <div className="absolute inset-0 flex items-center px-3">
          <span className="text-xs font-bold text-gray-800">{value.toLocaleString()}</span>
          <span className="text-xs text-gray-500 ml-2">({pct(value, max)})</span>
        </div>
      </div>
    </div>
  )
}

function DemographicTable({ cuts }: { cuts: DemographicCut[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 pr-4 font-semibold text-gray-500">Group</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-500">Identified</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-500">Contacted</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-500">Assessed</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-500">Referred</th>
            <th className="text-right py-2 pl-3 font-semibold text-gray-500">Completion rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {cuts.map((cut) => (
            <tr key={cut.label}>
              <td className="py-2 pr-4 font-medium text-gray-700">{cut.label}</td>
              <td className="text-right py-2 px-3 text-gray-600">{cut.identified}</td>
              <td className="text-right py-2 px-3 text-gray-600">{cut.contacted}</td>
              <td className="text-right py-2 px-3 text-gray-600">{cut.assessed}</td>
              <td className="text-right py-2 px-3 text-gray-600">{cut.referred}</td>
              <td className="text-right py-2 pl-3 font-semibold text-gray-800">{pct(cut.assessed, cut.identified)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PayerDashboardPage() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('ALL')

  const metrics: FunnelMetrics =
    selectedSiteId === 'ALL'
      ? getAllSitesFunnel()
      : FUNNEL_DATA.find((s) => s.siteId === selectedSiteId) ?? getAllSitesFunnel()

  const maxMembers = metrics.membersIdentified

  return (
    <PageShell
      title="Screening Program Dashboard"
      subtitle={`${metrics.period} · Aggregate, de-identified data`}
      actions={
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Site:</label>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
          >
            <option value="ALL">All Sites</option>
            {FUNNEL_DATA.map((s) => (
              <option key={s.siteId} value={s.siteId}>{s.siteName}</option>
            ))}
          </select>
        </div>
      }
    >
      {/* No individual data disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 flex gap-2">
        <span className="text-gray-400 text-sm shrink-0">🔒</span>
        <p className="text-xs text-gray-500">
          This dashboard displays aggregate, de-identified funnel metrics only. No individual member scores, names, or identifiers are accessible through the payer view.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Identified', value: metrics.membersIdentified, color: 'text-gray-800' },
          { label: 'Contacted', value: metrics.membersContacted, sub: pct(metrics.membersContacted, metrics.membersIdentified), color: 'text-blue-700' },
          { label: 'Assessed', value: metrics.membersAssessed, sub: pct(metrics.membersAssessed, metrics.membersIdentified), color: 'text-amber-700' },
          { label: 'Research referred', value: metrics.membersReferred, sub: pct(metrics.membersReferred, metrics.membersIdentified), color: 'text-purple-700' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
            {sub && <div className="text-xs text-gray-400 mt-0.5">{sub} of identified</div>}
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-5">Screening Funnel</h3>
        <div className="space-y-3">
          <FunnelBar label="Identified" value={metrics.membersIdentified} max={maxMembers} color="bg-gray-400" />
          <FunnelBar label="Contacted" value={metrics.membersContacted} max={maxMembers} color="bg-blue-400" />
          <FunnelBar label="Assessed" value={metrics.membersAssessed} max={maxMembers} color="bg-amber-400" />
          <FunnelBar label="Research referred" value={metrics.membersReferred} max={maxMembers} color="bg-purple-400" />
        </div>
      </div>

      {/* Site breakdown */}
      {selectedSiteId === 'ALL' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Site Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Site</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Identified</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Contacted</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Assessed</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Referred</th>
                  <th className="text-right py-2 pl-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {FUNNEL_DATA.map((site) => (
                  <tr key={site.siteId} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800 text-sm">{site.siteName}</td>
                    <td className="text-right py-3 px-3 text-gray-600">{site.membersIdentified}</td>
                    <td className="text-right py-3 px-3 text-gray-600">{site.membersContacted}</td>
                    <td className="text-right py-3 px-3 text-gray-600">{site.membersAssessed}</td>
                    <td className="text-right py-3 px-3 text-gray-600">{site.membersReferred}</td>
                    <td className="text-right py-3 pl-3 font-semibold text-gray-800">
                      {pct(site.membersAssessed, site.membersIdentified)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Demographic strata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">By Age Group</h3>
          <DemographicTable cuts={metrics.byAgeGroup} />
          <p className="text-xs text-gray-400 mt-3">Equity monitoring: compare completion rates across age groups to detect underdiagnosis bias.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">By Gender</h3>
          <DemographicTable cuts={metrics.byGender} />
          <p className="text-xs text-gray-400 mt-3">Equity monitoring: compare completion rates across gender groups to detect underdiagnosis bias.</p>
        </div>
      </div>
    </PageShell>
  )
}
