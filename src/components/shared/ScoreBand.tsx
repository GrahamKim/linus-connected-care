import { ScoreBand } from '../../types'

const BAND_CONFIG: Record<ScoreBand, { label: string; color: string; bar: string; bg: string }> = {
  within_expected_range: {
    label: 'Within expected range',
    color: 'text-green-800',
    bar: 'bg-green-500',
    bg: 'bg-green-50 border-green-200',
  },
  mildly_below_expected: {
    label: 'Mildly below expected',
    color: 'text-amber-800',
    bar: 'bg-amber-400',
    bg: 'bg-amber-50 border-amber-200',
  },
  below_expected: {
    label: 'Below expected range',
    color: 'text-red-800',
    bar: 'bg-red-500',
    bg: 'bg-red-50 border-red-200',
  },
}

const BAR_WIDTH: Record<ScoreBand, string> = {
  within_expected_range: 'w-full',
  mildly_below_expected: 'w-2/3',
  below_expected: 'w-1/3',
}

interface ScoreBandProps {
  band: ScoreBand
  context?: string
  size?: 'sm' | 'lg'
}

export default function ScoreBandDisplay({ band, context, size = 'sm' }: ScoreBandProps) {
  const config = BAND_CONFIG[band]

  if (size === 'lg') {
    return (
      <div className={`rounded-xl border-2 p-5 ${config.bg}`}>
        <div className={`text-xl font-bold ${config.color}`}>{config.label}</div>
        {context && <p className="text-sm text-gray-600 mt-1">{context}</p>}
        <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${config.bar} ${BAR_WIDTH[band]}`} />
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border p-3 ${config.bg}`}>
      <div className={`text-sm font-semibold ${config.color}`}>{config.label}</div>
      {context && <p className="text-xs text-gray-500 mt-0.5">{context}</p>}
      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${config.bar} ${BAR_WIDTH[band]}`} />
      </div>
    </div>
  )
}
