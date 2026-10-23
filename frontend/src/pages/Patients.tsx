import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader, EmptyState } from '../components/shared/Card'
import { SearchInput, FilterSelect, TableWrap, Button } from '../components/shared/Controls'
import { StatusBadge } from '../components/shared/StatusBadge'
import { Drawer } from '../components/shared/Drawer'
import { PatientDetailPanel } from '../components/patients/PatientDetailPanel'
import { Modal } from '../components/shared/Modal'
import { TRIAGE_TONE, patientStatusTone } from '../utils/status'
import type { PatientStatus, TriageLevel } from '../types'

export default function Patients() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [hospitalFilter, setHospitalFilter] = useState('all')
  const [triageFilter, setTriageFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [disasterFilter, setDisasterFilter] = useState('all')
  const [viewingPatientId, setViewingPatientId] = useState<string | null>(null)
  const [newPatientOpen, setNewPatientOpen] = useState(false)
  const [patientForm, setPatientForm] = useState({ name: '', age: '', gender: '', disasterId: '' })
  const [patientError, setPatientError] = useState('')
  const [savingPatient, setSavingPatient] = useState(false)
  const { patients, hospitals, disasters, getHospital, getDisaster, createPatient } = useAppData()

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (search && !`${p.id} ${p.name}`.toLowerCase().includes(search.toLowerCase())) return false
      if (hospitalFilter !== 'all' && p.hospitalId !== hospitalFilter) return false
      if (triageFilter !== 'all' && p.triage !== (triageFilter as TriageLevel)) return false
      if (statusFilter !== 'all' && p.status !== (statusFilter as PatientStatus)) return false
      if (disasterFilter !== 'all' && p.disasterId !== disasterFilter) return false
      return true
    })
  }, [patients, search, hospitalFilter, triageFilter, statusFilter, disasterFilter])

  const viewingPatient = patients.find((p) => p.id === viewingPatientId)

  const submitPatient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = patientForm.name.trim()
    const age = Number(patientForm.age)
    if (!name || !patientForm.gender || !patientForm.disasterId) { setPatientError('Complete all required fields.'); return }
    if (!Number.isInteger(age) || age < 0 || age > 120) { setPatientError('Enter an age from 0 to 120.'); return }
    setSavingPatient(true); setPatientError('')
    try {
      await createPatient({ name, age, gender: patientForm.gender, disasterId: Number(patientForm.disasterId.slice(patientForm.disasterId.lastIndexOf('-') + 1)) })
      setPatientForm({ name: '', age: '', gender: '', disasterId: '' }); setNewPatientOpen(false)
    } catch (error) { setPatientError(error instanceof Error ? error.message : 'Patient could not be created.') }
    finally { setSavingPatient(false) }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-start justify-between gap-3"><div><h1 className="text-2xl font-bold tracking-tight text-navy-900">Patients</h1>
        <p className="mt-1 text-sm text-navy-500">Search and manage every patient record across the active response.</p>
        </div><Button onClick={() => { setPatientError(''); setNewPatientOpen(true) }}>New Patient</Button></div>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or patient ID…" className="sm:max-w-xs" />
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Hospital"
              value={hospitalFilter}
              onChange={setHospitalFilter}
              options={[{ value: 'all', label: 'All Hospitals' }, ...hospitals.map((h) => ({ value: h.id, label: h.name }))]}
            />
            <FilterSelect
              label="Triage"
              value={triageFilter}
              onChange={setTriageFilter}
              options={[
                { value: 'all', label: 'All Levels' },
                { value: 'Red', label: 'Red' },
                { value: 'Orange', label: 'Orange' },
                { value: 'Yellow', label: 'Yellow' },
                { value: 'Green', label: 'Green' },
              ]}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Admitted', label: 'Admitted' },
                { value: 'Discharged', label: 'Discharged' },
                { value: 'Transferred', label: 'Transferred' },
                { value: 'Deceased', label: 'Deceased' },
              ]}
            />
            <FilterSelect
              label="Disaster"
              value={disasterFilter}
              onChange={setDisasterFilter}
              options={[{ value: 'all', label: 'All Events' }, ...disasters.map((d) => ({ value: d.id, label: d.name }))]}
            />
          </div>
        </div>

        <SectionHeader title={`${filtered.length} Patients`} />

        {filtered.length === 0 ? (
          <EmptyState message="No patients match your filters." />
        ) : (
          <TableWrap>
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                  <th className="py-2 pr-3 font-medium">Patient ID</th>
                  <th className="py-2 pr-3 font-medium">Name</th>
                  <th className="py-2 pr-3 font-medium">Age</th>
                  <th className="py-2 pr-3 font-medium">Gender</th>
                  <th className="py-2 pr-3 font-medium">Triage</th>
                  <th className="py-2 pr-3 font-medium">Hospital</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Disaster</th>
                  <th className="py-2 pr-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-50">
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-500">{p.id}</td>
                    <td className="py-2.5 pr-3 font-medium text-navy-900">{p.name}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{p.age}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{p.gender}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge label={p.triage} tone={TRIAGE_TONE[p.triage]} />
                    </td>
                    <td className="py-2.5 pr-3 text-navy-600">{getHospital(p.hospitalId)?.name}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge label={p.status} tone={patientStatusTone(p.status)} />
                    </td>
                    <td className="py-2.5 pr-3 text-navy-600">{getDisaster(p.disasterId)?.name}</td>
                    <td className="py-2.5 pr-3 text-right">
                      <Button variant="ghost" onClick={() => setViewingPatientId(p.id)}>
                        View Patient
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
        {viewingPatient && <PatientDetailPanel patientId={viewingPatient.id} />}
      </Drawer>
      <Modal open={newPatientOpen} onClose={() => setNewPatientOpen(false)} title="New Patient" footer={<><Button variant="secondary" onClick={() => setNewPatientOpen(false)}>Cancel</Button><Button type="submit" form="new-patient-form" disabled={savingPatient}>{savingPatient ? 'Saving…' : 'Create Patient'}</Button></>}>
        <form id="new-patient-form" onSubmit={(event) => void submitPatient(event)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Name<input required value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800" /></label>
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Age<input required type="number" min="0" max="120" step="1" value={patientForm.age} onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800" /></label>
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Gender<select required value={patientForm.gender} onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800"><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></label>
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Disaster association<select required value={patientForm.disasterId} onChange={(e) => setPatientForm({ ...patientForm, disasterId: e.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800"><option value="">Select disaster</option>{disasters.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
          {patientError && <p role="alert" className="text-sm text-critical-700">{patientError}</p>}
        </form>
      </Modal>
    </div>
  )
}
