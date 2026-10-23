import type { StockStatus, TriageLevel } from '../types'

export type SemanticTone = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'gray'

export const TRIAGE_TONE: Record<TriageLevel, SemanticTone> = {
  Red: 'red',
  Orange: 'orange',
  Yellow: 'yellow',
  Green: 'green',
  Unknown: 'gray',
}

export const TRIAGE_LABEL: Record<TriageLevel, string> = {
  Red: 'Immediate',
  Orange: 'Needs Attention',
  Yellow: 'Minor',
  Green: 'No Injury',
  Unknown: 'Not assessed',
}

export const STOCK_TONE: Record<StockStatus, SemanticTone> = {
  NORMAL: 'green',
  'LOW STOCK': 'yellow',
  CRITICAL: 'red',
}

export const tonePalette: Record<
  SemanticTone,
  { bg: string; text: string; border: string; dot: string; solidBg: string; solidText: string }
> = {
  red: {
    bg: 'bg-critical-50',
    text: 'text-critical-700',
    border: 'border-critical-200',
    dot: 'bg-critical-600',
    solidBg: 'bg-critical-600',
    solidText: 'text-white',
  },
  orange: {
    bg: 'bg-warn-50',
    text: 'text-warn-700',
    border: 'border-warn-200',
    dot: 'bg-warn-500',
    solidBg: 'bg-warn-500',
    solidText: 'text-white',
  },
  yellow: {
    bg: 'bg-caution-50',
    text: 'text-caution-700',
    border: 'border-caution-200',
    dot: 'bg-caution-500',
    solidBg: 'bg-caution-500',
    solidText: 'text-white',
  },
  green: {
    bg: 'bg-stable-50',
    text: 'text-stable-700',
    border: 'border-stable-200',
    dot: 'bg-stable-600',
    solidBg: 'bg-stable-600',
    solidText: 'text-white',
  },
  blue: {
    bg: 'bg-brand-50',
    text: 'text-brand-700',
    border: 'border-brand-200',
    dot: 'bg-brand-600',
    solidBg: 'bg-brand-600',
    solidText: 'text-white',
  },
  gray: {
    bg: 'bg-navy-100',
    text: 'text-navy-600',
    border: 'border-navy-200',
    dot: 'bg-navy-400',
    solidBg: 'bg-navy-500',
    solidText: 'text-white',
  },
}

export function occupancyTone(ratio: number): SemanticTone {
  if (ratio >= 0.95) return 'red'
  if (ratio >= 0.8) return 'orange'
  return 'green'
}

export function ambulanceStatusTone(status: string): SemanticTone {
  if (status === 'Available') return 'green'
  if (status === 'On Trip') return 'blue'
  return 'gray'
}

export function patientStatusTone(status: string): SemanticTone {
  switch (status) {
    case 'Admitted':
      return 'blue'
    case 'Discharged':
      return 'green'
    case 'Transferred':
      return 'yellow'
    case 'Deceased':
      return 'gray'
    default:
      return 'gray'
  }
}

export function shelterStatusTone(status: string): SemanticTone {
  switch (status) {
    case 'AVAILABLE':
      return 'green'
    case 'NEAR CAPACITY':
      return 'yellow'
    case 'FULL':
      return 'red'
    default:
      return 'gray'
  }
}
