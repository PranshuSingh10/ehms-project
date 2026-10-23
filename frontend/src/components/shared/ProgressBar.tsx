import { tonePalette, type SemanticTone } from '../../utils/status'

interface ProgressBarProps {
  ratio: number
  tone: SemanticTone
  label?: string
}

export function ProgressBar({ ratio, tone, label }: ProgressBarProps) {
  const palette = tonePalette[tone]
  const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)))
  return (
    <div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-navy-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'occupancy'}
      >
        <div className={`h-full rounded-full ${palette.solidBg}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs font-medium text-navy-500">{pct}% occupied</p>
    </div>
  )
}
