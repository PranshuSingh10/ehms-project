import { useMemo, useState, type FormEvent } from 'react'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader, EmptyState } from '../components/shared/Card'
import { SearchInput, FilterSelect, TableWrap, Button } from '../components/shared/Controls'
import { StatusBadge } from '../components/shared/StatusBadge'
import { Drawer } from '../components/shared/Drawer'
import { Modal } from '../components/shared/Modal'
import { PatientDetailPanel } from '../components/patients/PatientDetailPanel'
import { TRIAGE_TONE } from '../utils/status'
import type { TriageLevel, TriageRecordStatus } from '../types'
import { AlertOctagon } from 'lucide-react'
import { ApiError } from '../api'

const TRIAGE_ORDER: TriageLevel[] = ['Red', 'Orange', 'Yellow', 'Green']

export default function Triage() {
  const [search, setSearch] = useState('')
  const [triageFilter, setTriageFilter] = useState('all')
  const [hospitalFilter, setHospitalFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewingPatientId, setViewingPatientId] = useState<string | null>(null)
  const [newAssessmentOpen, setNewAssessmentOpen] = useState(false)
  const [assessmentForm, setAssessmentForm] = useState({ patientId: '', triageLevelId: '', staffId: '', triageTime: new Date().toISOString().slice(0, 16), vitalSigns: '' })
  const [assessmentError, setAssessmentError] = useState('')
  const [savingAssessment, setSavingAssessment] = useState(false)
  const { triageRecords, triageLevels, hospitals, patients, staff, getPatient, getHospital, getStaff, createTriageRecord } = useAppData()
  const admittedPatients = patients.filter((patient) => patient.status === 'Admitted')
  const triageDistribution = Object.fromEntries(TRIAGE_ORDER.map((level) => [level, patients.filter((p) => p.triage === level).length])) as Record<TriageLevel, number>

  const rows = useMemo(() => {
    return triageRecords.filter((r) => {
      const patient = getPatient(r.patientId)
      if (!patient) return false
      if (search && !`${patient.id} ${patient.name}`.toLowerCase().includes(search.toLowerCase())) return false
      if (triageFilter !== 'all' && r.triage !== (triageFilter as TriageLevel)) return false
      if (hospitalFilter !== 'all' && r.hospitalId !== hospitalFilter) return false
      if (statusFilter !== 'all' && r.status !== (statusFilter as TriageRecordStatus)) return false
      return true
    })
      .map((r) => ({ record: r, patient: getPatient(r.patientId)! }))
      .sort((a, b) => TRIAGE_ORDER.indexOf(a.record.triage) - TRIAGE_ORDER.indexOf(b.record.triage))
  }, [triageRecords, patients, search, triageFilter, hospitalFilter, statusFilter])

  const viewingPatient = viewingPatientId ? getPatient(viewingPatientId) : undefined

  const openAssessmentForm = () => {
    setAssessmentError('')
    setAssessmentForm({ patientId: admittedPatients[0]?.id ?? '', triageLevelId: '', staffId: staff[0]?.id ?? '', triageTime: new Date().toISOString().slice(0, 16), vitalSigns: '' })
    setNewAssessmentOpen(true)
  }

  const submitAssessment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!assessmentForm.patientId || !assessmentForm.triageLevelId || !assessmentForm.staffId || !assessmentForm.triageTime) {
      setAssessmentError('Complete all required fields.')
      return
    }
    const triageTime = new Date(assessmentForm.triageTime)
    if (Number.isNaN(triageTime.getTime())) {
      setAssessmentError('Enter a valid assessment time.')
      return
    }
    setSavingAssessment(true)
    setAssessmentError('')
    try {
      await createTriageRecord({
        patientId: Number(assessmentForm.patientId.slice(assessmentForm.patientId.lastIndexOf('-') + 1)),
        triageTime: triageTime.toISOString(),
        vitalSigns: assessmentForm.vitalSigns.trim(),
        staffId: Number(assessmentForm.staffId.slice(assessmentForm.staffId.lastIndexOf('-') + 1)),
        triageLevelId: Number(assessmentForm.triageLevelId),
      })
      setNewAssessmentOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      setAssessmentError(error instanceof ApiError && /duplicate|unique|constraint|violat/i.test(message)
        ? 'The assessment was not saved because it conflicts with an existing record or a required database rule.'
        : message || 'The assessment could not be saved.')
    } finally {
      setSavingAssessment(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertOctagon className="h-6 w-6 text-critical-600" aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">Mass Casualty Triage</h1>
            <p className="mt-1 text-sm text-navy-500">System-wide triage status across the active disaster response.</p>
          </div>
        </div>
        <Button onClick={openAssessmentForm} disabled={!admittedPatients.length || !staff.length || !triageLevels.length}>New Assessment</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TRIAGE_ORDER.map((level) => (
          <Card key={level} className={`border-l-4 ${level === 'Red' ? 'border-l-critical-600' : level === 'Orange' ? 'border-l-warn-500' : level === 'Yellow' ? 'border-l-caution-500' : 'border-l-stable-600'}`}>
            <p className="text-2xl font-bold text-navy-900">{triageDistribution[level]}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-500">
              <StatusBadge label={level.toUpperCase()} tone={TRIAGE_TONE[level]} />
              patients
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or patient ID…" className="sm:max-w-xs" />
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Triage Level"
              value={triageFilter}
              onChange={setTriageFilter}
              options={[{ value: 'all', label: 'All Levels' }, ...TRIAGE_ORDER.map((t) => ({ value: t, label: t }))]}
            />
            <FilterSelect
              label="Hospital"
              value={hospitalFilter}
              onChange={setHospitalFilter}
              options={[{ value: 'all', label: 'All Hospitals' }, ...hospitals.map((h) => ({ value: h.id, label: h.name }))]}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Unknown', label: 'Status not recorded' },
              ]}
            />
          </div>
        </div>

        <SectionHeader title={`${rows.length} Assessments`} />

        {rows.length === 0 ? (
          <EmptyState message="No triage records match your filters." />
        ) : (
          <TableWrap>
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                  <th className="py-2 pr-3 font-medium">Patient ID</th>
                  <th className="py-2 pr-3 font-medium">Patient Name</th>
                  <th className="py-2 pr-3 font-medium">Age</th>
                  <th className="py-2 pr-3 font-medium">Triage Level</th>
                  <th className="py-2 pr-3 font-medium">Vital Signs</th>
                  <th className="py-2 pr-3 font-medium">Hospital</th>
                  <th className="py-2 pr-3 font-medium">Assessed By</th>
                  <th className="py-2 pr-3 font-medium">Assessment Time</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {rows.map(({ record, patient }) => (
                  <tr
                    key={record.id}
                    className="cursor-pointer hover:bg-navy-50"
                    onClick={() => setViewingPatientId(patient.id)}
                  >
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-500">{patient.id}</td>
                    <td className="py-2.5 pr-3 font-medium text-navy-900">{patient.name}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{patient.age}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge label={record.triage.toUpperCase()} tone={TRIAGE_TONE[record.triage]} />
                    </td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-xs text-navy-600">
                      {record.vitals.bp || 'Vitals unavailable'}{record.vitals.pulse ? ` · HR ${record.vitals.pulse}` : ''}{record.vitals.spo2 ? ` · SpO2 ${record.vitals.spo2}%` : ''}
                    </td>
                    <td className="py-2.5 pr-3 text-navy-600">{getHospital(record.hospitalId)?.name}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{getStaff(record.assessedByStaffId)?.name}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-navy-600">{record.assessedAt}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{record.status}</td>
                    <td className="py-2.5 pr-3 text-right">
                      <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setViewingPatientId(patient.id) }}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      <Drawer
        open={!!viewingPatient}
        onClose={() => setViewingPatientId(null)}
        title={viewingPatient?.name ?? ''}
        subtitle={viewingPatient ? `${viewingPatient.id} · Age ${viewingPatient.age}` : undefined}
      >
        {viewingPatient && <PatientDetailPanel patientId={viewingPatient.id} initialTab="Triage" />}
      </Drawer>
      <Modal open={newAssessmentOpen} onClose={() => setNewAssessmentOpen(false)} title="New Triage Assessment" footer={<><Button variant="secondary" onClick={() => setNewAssessmentOpen(false)}>Cancel</Button><Button type="submit" form="triage-assessment-form" disabled={savingAssessment}>{savingAssessment ? 'Saving…' : 'Save Assessment'}</Button></>}>
        <form id="triage-assessment-form" onSubmit={(event) => void submitAssessment(event)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Patient<select required value={assessmentForm.patientId} onChange={(event) => setAssessmentForm({ ...assessmentForm, patientId: event.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800"><option value="">Select admitted patient</option>{admittedPatients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} · {patient.id}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Triage level<select required value={assessmentForm.triageLevelId} onChange={(event) => setAssessmentForm({ ...assessmentForm, triageLevelId: event.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800"><option value="">Select triage level</option>{triageLevels.map((level) => <option key={level.id} value={level.id}>{level.colorCode} — {level.description}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Assessed by<select required value={assessmentForm.staffId} onChange={(event) => setAssessmentForm({ ...assessmentForm, staffId: event.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800"><option value="">Select staff member</option>{staff.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Assessment time<input required type="datetime-local" value={assessmentForm.triageTime} onChange={(event) => setAssessmentForm({ ...assessmentForm, triageTime: event.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800" /></label>
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Vital signs <span className="font-normal">(optional)</span><textarea value={assessmentForm.vitalSigns} onChange={(event) => setAssessmentForm({ ...assessmentForm, vitalSigns: event.target.value })} rows={3} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800" /></label>
          {assessmentError && <p role="alert" className="text-sm text-critical-700">{assessmentError}</p>}
        </form>
      </Modal>
    </div>
  )
}
