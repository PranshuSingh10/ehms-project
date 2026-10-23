import type { LucideIcon } from 'lucide-react'
import { Card } from '../shared/Card'
import { tonePalette, type SemanticTone } from '../../utils/status'

interface KpiCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  context?: string
  tone?: SemanticTone
}

export function KpiCard({ icon: Icon, value, label, context, tone = 'blue' }: KpiCardProps) {
  const palette = tonePalette[tone]
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${palette.bg}`}>
          <Icon className={`h-[18px] w-[18px] ${palette.text}`} aria-hidden="true" />
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-navy-900">{value}</p>
        <p className="text-sm text-navy-500">{label}</p>
      </div>
      {context && <p className="text-xs font-medium text-navy-400">{context}</p>}
    </Card>
  )
}
