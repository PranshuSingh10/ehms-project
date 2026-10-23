import { tonePalette, type SemanticTone } from '../../utils/status'

interface StatusBadgeProps {
  label: string
  tone: SemanticTone
  size?: 'sm' | 'md'
  className?: string
}

export function StatusBadge({ label, tone, size = 'sm', className = '' }: StatusBadgeProps) {
  const palette = tonePalette[tone]
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${palette.bg} ${palette.text} ${palette.border} ${sizeClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${palette.dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}

export function SolidBadge({ label, tone, className = '' }: { label: string; tone: SemanticTone; className?: string }) {
  const palette = tonePalette[tone]
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${palette.solidBg} ${palette.solidText} ${className}`}
    >
      {label}
    </span>
  )
}
