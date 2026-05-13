interface Props {
  level: 'high' | 'medium' | 'low'
  note: string
}

const CONFIG = {
  high: { label: 'High', dots: 3, color: 'bg-green-500' },
  medium: { label: 'Medium', dots: 2, color: 'bg-amber-400' },
  low: { label: 'Low', dots: 1, color: 'bg-red-400' },
}

export default function ConfidenceIndicator({ level, note }: Props) {
  const config = CONFIG[level]
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="shrink-0">
        <p className="text-xs text-gray-500 font-medium mb-1">Assessment confidence</p>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${i <= config.dots ? config.color : 'bg-gray-200'}`}
            />
          ))}
          <span className="ml-1 text-sm font-semibold text-gray-700">{config.label}</span>
        </div>
      </div>
      <div className="border-l border-gray-200 pl-3">
        <p className="text-xs text-gray-500">{note}</p>
      </div>
    </div>
  )
}
