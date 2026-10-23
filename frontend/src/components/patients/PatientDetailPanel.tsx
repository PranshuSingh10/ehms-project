import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { StatusBadge } from '../shared/StatusBadge'
import { Tabs, TableWrap } from '../shared/Controls'
import { TRIAGE_TONE, TRIAGE_LABEL, patientStatusTone } from '../../utils/status'

const TABS = ['Overview', 'Triage', 'Treatment', 'Transport History']

export function PatientDetailPanel({
  patientId,
  initialTab = TABS[0],
}: {
  patientId: string
  initialTab?: string
}) {
  const [tab, setTab] = useState(initialTab)
  const { getPatient, getHospital, getStaff, getAmbulance, triageRecords: allTriageRecords, treatments: allTreatments, transportLogs: allTransportLogs } = useAppData()
  const patient = getPatient(patientId)
  if (!patient) return <p className="text-sm text-navy-500">Patient record not found.</p>

  const hospital = getHospital(patient.hospitalId)
  const triageRecords = allTriageRecords.filter((r) => r.patientId === patientId)
  const treatments = allTreatments.filter((r) => r.patientId === patientId)
  const transportLogs = allTransportLogs.filter((r) => r.patientId === patientId)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label={TRIAGE_LABEL[patient.triage]} tone={TRIAGE_TONE[patient.triage]} />
        <StatusBadge label={patient.status} tone={patientStatusTone(patient.status)} />
        <span className="text-xs text-navy-400">{patient.id}</span>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Name" value={patient.name} />
          <Field label="Age / Gender" value={`${patient.age} / ${patient.gender}`} />
          <Field label="Current Hospital" value={hospital?.name ?? '—'} />
          <Field label="Assigned Bed" value={patient.bedId ?? 'Unassigned'} />
          <Field label="Status" value={patient.status} />
          <Field label="Admitted / Arrived" value={patient.admittedAt || 'Not recorded'} />
        </dl>
      )}

      {tab === 'Triage' && (
        <div className="flex flex-col gap-3">
          {triageRecords.length === 0 && <p className="text-sm text-navy-500">No triage records on file.</p>}
          {triageRecords.map((record) => {
            const assessor = getStaff(record.assessedByStaffId)
            return (
              <div key={record.id} className="rounded-lg border border-navy-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <StatusBadge label={TRIAGE_LABEL[record.triage]} tone={TRIAGE_TONE[record.triage]} />
                  <span className="text-xs text-navy-400">{record.assessedAt}</span>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <Field label="Blood Pressure" value={record.vitals.bp || 'Not recorded'} />
                  <Field label="Pulse" value={record.vitals.pulse ? `${record.vitals.pulse} bpm` : 'Not recorded'} />
                  <Field label="SpO2" value={record.vitals.spo2 ? `${record.vitals.spo2}%` : 'Not recorded'} />
                  <Field label="Temp" value={record.vitals.temp ? `${record.vitals.temp}°C` : 'Not recorded'} />
                  <Field label="Assessed By" value={assessor?.name ?? '—'} />
                  <Field label="Status" value={record.status} />
                </dl>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'Treatment' && (
        <TableWrap>
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Description</th>
                <th className="py-2 pr-3 font-medium">Medication</th>
                <th className="py-2 pr-3 font-medium">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {treatments.map((t) => (
                <tr key={t.id}>
                  <td className="py-2 pr-3 whitespace-nowrap text-navy-600">{t.date}</td>
                  <td className="py-2 pr-3 text-navy-800">{t.description}</td>
                  <td className="py-2 pr-3 text-navy-600">{t.medication}</td>
                  <td className="py-2 pr-3 text-navy-600">{getStaff(t.staffId)?.name ?? '—'}</td>
                </tr>
              ))}
              {treatments.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-navy-400">
                    No treatment records on file.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrap>
      )}

      {tab === 'Transport History' && (
        <TableWrap>
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                <th className="py-2 pr-3 font-medium">Pickup</th>
                <th className="py-2 pr-3 font-medium">Destination</th>
                <th className="py-2 pr-3 font-medium">Ambulance</th>
                <th className="py-2 pr-3 font-medium">Time</th>
                <th className="py-2 pr-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {transportLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-2 pr-3 text-navy-800">{log.pickup}</td>
                  <td className="py-2 pr-3 text-navy-800">{log.destination}</td>
                  <td className="py-2 pr-3 text-navy-600">{getAmbulance(log.ambulanceId)?.id ?? '—'}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-navy-600">{log.time}</td>
                  <td className="py-2 pr-3 text-navy-600">{log.status}</td>
                </tr>
              ))}
              {transportLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-navy-400">
                    No transport records on file.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-navy-400">{label}</dt>
      <dd className="text-navy-800">{value}</dd>
    </div>
  )
}
