import type { TriageRecord } from '../types'

/** Most recent triage assessment time on file for a patient, or a fallback dash. */
export function latestAssessmentTime(patientId: string, allRecords: TriageRecord[]): string {
  const records = allRecords.filter((record) => record.patientId === patientId)
  if (records.length === 0) return '—'
  return records[records.length - 1].assessedAt
}
