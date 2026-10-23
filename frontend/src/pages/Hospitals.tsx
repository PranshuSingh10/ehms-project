import { useMemo, useState, type FormEvent } from 'react'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader, EmptyState } from '../components/shared/Card'
import { FilterSelect, TableWrap } from '../components/shared/Controls'
import { StatusBadge } from '../components/shared/StatusBadge'
import { ProgressBar } from '../components/shared/ProgressBar'
import { Drawer } from '../components/shared/Drawer'
import { occupancyTone } from '../utils/status'
import { Modal } from '../components/shared/Modal'
import { Button } from '../components/shared/Controls'
import { ApiError } from '../api'
import type { Hospital, Ward, BedStatus } from '../types'
import { Building2, MapPin } from 'lucide-react'

export default function Hospitals() {
  const [viewingHospitalId, setViewingHospitalId] = useState<string | null>(null)
  const [hospitalFilter, setHospitalFilter] = useState('all')
  const [wardFilter, setWardFilter] = useState('all')
  const [bedStatusFilter, setBedStatusFilter] = useState('all')
  const [assigningBedId, setAssigningBedId] = useState<string | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [bedError, setBedError] = useState('')
  const [savingBed, setSavingBed] = useState(false)
  const [newBedOpen, setNewBedOpen] = useState(false)
  const [newBedForm, setNewBedForm] = useState({ hospitalId: '', wardType: '' })
  const [newBedError, setNewBedError] = useState('')
  const [savingNewBed, setSavingNewBed] = useState(false)
  const { hospitals, hospitalCapacity, patients, beds: allBeds, getHospital, getPatient, hospitalStaff, hospitalSupplies, createBed, assignBed, releaseBed } = useAppData()

  const unassignedPatients = patients.filter((p) => !allBeds.some((b) => b.patientId === p.id) && p.status === 'Admitted')

  const beds = useMemo(() => {
    return allBeds.filter((b) => {
      if (hospitalFilter !== 'all' && b.hospitalId !== hospitalFilter) return false
      if (wardFilter !== 'all' && b.ward !== (wardFilter as Ward)) return false
      if (bedStatusFilter !== 'all' && b.status !== (bedStatusFilter as BedStatus)) return false
      return true
    })
  }, [allBeds, hospitalFilter, wardFilter, bedStatusFilter])

  const viewingHospital = hospitals.find((h) => h.id === viewingHospitalId)

  const openBedAssignment = (bedId: string) => {
    setAssigningBedId(bedId); setSelectedPatientId(unassignedPatients[0]?.id ?? ''); setBedError('')
  }
  const confirmBedAssignment = async () => {
    if (!assigningBedId || !selectedPatientId) { setBedError('Select a patient to assign.'); return }
    setSavingBed(true); setBedError('')
    try { await assignBed(assigningBedId, selectedPatientId); setAssigningBedId(null) }
    catch (error) { setBedError(error instanceof ApiError && error.status === 409 ? 'This bed was just assigned to someone else — please pick another.' : error instanceof Error ? error.message : 'Bed assignment failed.') }
    finally { setSavingBed(false) }
  }
  const handleReleaseBed = async (bedId: string) => {
    try { await releaseBed(bedId) }
    catch (error) { setBedError(error instanceof Error ? error.message : 'Could not release this bed.') }
  }
  const openNewBedForm = () => {
    setNewBedError('')
    setNewBedForm({ hospitalId: hospitals[0]?.id ?? '', wardType: '' })
    setNewBedOpen(true)
  }
  const submitNewBed = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newBedForm.hospitalId || !newBedForm.wardType) { setNewBedError('Select a hospital and ward type.'); return }
    setSavingNewBed(true); setNewBedError('')
    try {
      await createBed({
        hospitalId: Number(newBedForm.hospitalId.slice(newBedForm.hospitalId.lastIndexOf('-') + 1)),
        wardType: newBedForm.wardType as Ward,
      })
      setNewBedOpen(false)
    } catch (error) { setNewBedError(error instanceof Error ? error.message : 'The bed could not be added.') }
    finally { setSavingNewBed(false) }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Hospitals &amp; Beds</h1>
          <p className="mt-1 text-sm text-navy-500">Facility capacity, ward breakdowns, and live bed status.</p>
        </div>
        <Button onClick={openNewBedForm} disabled={!hospitals.length}>Add Bed</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {hospitals.map((h) => (
          <HospitalCard key={h.id} hospital={h} capacity={hospitalCapacity.find((capacity) => capacity.hospitalId === h.id)} onOpen={() => setViewingHospitalId(h.id)} />
        ))}
      </div>

      <Card>
        <SectionHeader title="Bed Management" subtitle="Individual bed status across tracked wards" icon={<Building2 className="h-4 w-4" aria-hidden="true" />} />
        <div className="mb-4 flex flex-wrap gap-3">
          <FilterSelect
            label="Hospital"
            value={hospitalFilter}
            onChange={setHospitalFilter}
            options={[{ value: 'all', label: 'All Hospitals' }, ...hospitals.map((h) => ({ value: h.id, label: h.name }))]}
          />
          <FilterSelect
            label="Ward"
            value={wardFilter}
            onChange={setWardFilter}
            options={[
              { value: 'all', label: 'All Wards' },
              { value: 'ICU', label: 'ICU' },
              { value: 'Emergency', label: 'Emergency' },
              { value: 'General', label: 'General' },
            ]}
          />
          <FilterSelect
            label="Status"
            value={bedStatusFilter}
            onChange={setBedStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Occupied', label: 'Occupied' },
              { value: 'Vacant', label: 'Vacant' },
            ]}
          />
        </div>

        {bedError && !assigningBedId && <p role="alert" className="mb-3 text-sm text-critical-700">{bedError}</p>}

        {beds.length === 0 ? (
          <EmptyState message="No beds match your filters." />
        ) : (
          <TableWrap>
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                  <th className="py-2 pr-3 font-medium">Bed ID</th>
                  <th className="py-2 pr-3 font-medium">Hospital</th>
                  <th className="py-2 pr-3 font-medium">Ward</th>
                  <th className="py-2 pr-3 font-medium">Type</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Patient</th>
                  <th className="py-2 pr-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {beds.map((b) => (
                  <tr key={b.id} className="hover:bg-navy-50">
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-700">{b.id}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{getHospital(b.hospitalId)?.name}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{b.ward}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{b.type}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge label={b.status} tone={b.status === 'Occupied' ? 'blue' : 'green'} />
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-600">
                      {b.patientId ? `${b.patientId} — ${getPatient(b.patientId)?.name}` : '—'}
                    </td>
                    <td className="py-2.5 pr-3 text-right"><div className="flex justify-end">{b.status === 'Vacant' && !b.patientId ? <Button variant="secondary" onClick={() => openBedAssignment(b.id)}>Assign Patient</Button> : <Button variant="ghost" onClick={() => void handleReleaseBed(b.id)}>Release Bed</Button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      <Drawer open={!!viewingHospital} onClose={() => setViewingHospitalId(null)} title={viewingHospital?.name ?? ''} subtitle={viewingHospital?.location}>
        {viewingHospital && <HospitalDetail hospital={viewingHospital} beds={allBeds} staff={hospitalStaff(viewingHospital.id)} supplies={hospitalSupplies(viewingHospital.id)} />}
      </Drawer>
      <Modal open={!!assigningBedId} onClose={() => setAssigningBedId(null)} title={`Assign Patient to ${assigningBedId ?? 'Bed'}`} footer={<><Button variant="secondary" onClick={() => setAssigningBedId(null)}>Cancel</Button><Button onClick={() => void confirmBedAssignment()} disabled={savingBed || !selectedPatientId}>{savingBed ? 'Saving…' : 'Confirm Assignment'}</Button></>}>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Patient<select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} disabled={unassignedPatients.length === 0} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800"><option value="">{unassignedPatients.length ? 'Select patient' : 'No unassigned admitted patients'}</option>{unassignedPatients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.id}</option>)}</select></label>
          {bedError && <p role="alert" className="text-sm text-critical-700">{bedError}</p>}
        </div>
      </Modal>
      <Modal open={newBedOpen} onClose={() => setNewBedOpen(false)} title="Add Vacant Bed" footer={<><Button variant="secondary" onClick={() => setNewBedOpen(false)}>Cancel</Button><Button type="submit" form="new-bed-form" disabled={savingNewBed}>{savingNewBed ? 'Saving…' : 'Add Bed'}</Button></>}>
        <form id="new-bed-form" onSubmit={(event) => void submitNewBed(event)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Hospital<select required value={newBedForm.hospitalId} onChange={(event) => setNewBedForm({ ...newBedForm, hospitalId: event.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800"><option value="">Select hospital</option>{hospitals.map((hospital) => <option key={hospital.id} value={hospital.id}>{hospital.name}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-xs font-medium text-navy-500">Ward type<select required value={newBedForm.wardType} onChange={(event) => setNewBedForm({ ...newBedForm, wardType: event.target.value })} className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800"><option value="">Select ward type</option><option value="ICU">ICU</option><option value="General">General</option><option value="Emergency">Emergency</option></select></label>
          <p className="text-xs text-navy-500">New beds start vacant. Patient assignment is managed from the bed table.</p>
          {newBedError && <p role="alert" className="text-sm text-critical-700">{newBedError}</p>}
        </form>
      </Modal>
    </div>
  )
}

function HospitalCard({ hospital, capacity, onOpen }: { hospital: Hospital; capacity: import('../types').HospitalCapacity | undefined; onOpen: () => void }) {
  const totalBeds = capacity?.totalBeds ?? hospital.icu.total + hospital.emergency.total + hospital.general.total
  const vacantBeds = capacity?.vacantBeds ?? Math.max(0, totalBeds - hospital.occupied)
  const ratio = totalBeds ? (totalBeds - vacantBeds) / totalBeds : 0
  const tone = occupancyTone(ratio)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="rounded-xl border border-navy-200 bg-white p-4 text-left shadow-card transition-colors hover:border-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <p className="font-semibold text-navy-900">{hospital.name}</p>
        <StatusBadge label={tone === 'red' ? 'At Capacity' : tone === 'orange' ? 'High Load' : 'Stable'} tone={tone} />
      </div>
      <p className="mb-3 flex items-center gap-1 text-xs text-navy-500">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        {hospital.location}
      </p>
      <ProgressBar ratio={ratio} tone={tone} label={`${hospital.name} occupancy`} />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-md bg-navy-50 py-1.5">
          <p className="font-semibold text-navy-900">{hospital.icu.occupied}/{hospital.icu.total}</p>
          <p className="text-navy-500">ICU</p>
        </div>
        <div className="rounded-md bg-navy-50 py-1.5">
          <p className="font-semibold text-navy-900">{hospital.emergency.occupied}/{hospital.emergency.total}</p>
          <p className="text-navy-500">Emergency</p>
        </div>
        <div className="rounded-md bg-navy-50 py-1.5">
          <p className="font-semibold text-navy-900">{hospital.general.occupied}/{hospital.general.total}</p>
          <p className="text-navy-500">General</p>
        </div>
      </div>
    </button>
  )
}

function HospitalDetail({ hospital, beds: allBeds, staff, supplies }: { hospital: Hospital; beds: import('../types').Bed[]; staff: import('../types').MedicalStaff[]; supplies: import('../types').Supply[] }) {
  const beds = allBeds.filter((b) => b.hospitalId === hospital.id)
  const ratio = hospital.occupied / hospital.totalCapacity

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar ratio={ratio} tone={occupancyTone(ratio)} label="Overall occupancy" />
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div><dt className="text-xs text-navy-400">Total Capacity</dt><dd className="font-semibold text-navy-900">{hospital.totalCapacity}</dd></div>
        <div><dt className="text-xs text-navy-400">Occupied</dt><dd className="font-semibold text-navy-900">{hospital.occupied}</dd></div>
        <div><dt className="text-xs text-navy-400">Available</dt><dd className="font-semibold text-stable-600">{hospital.available}</dd></div>
        <div><dt className="text-xs text-navy-400">ICU Beds</dt><dd className="font-semibold text-navy-900">{hospital.icu.occupied}/{hospital.icu.total}</dd></div>
        <div><dt className="text-xs text-navy-400">Emergency Beds</dt><dd className="font-semibold text-navy-900">{hospital.emergency.occupied}/{hospital.emergency.total}</dd></div>
        <div><dt className="text-xs text-navy-400">General Beds</dt><dd className="font-semibold text-navy-900">{hospital.general.occupied}/{hospital.general.total}</dd></div>
      </dl>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-navy-900">Tracked Beds ({beds.length})</h3>
        <ul className="flex flex-col gap-1.5">
          {beds.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded-md border border-navy-100 px-2.5 py-1.5 text-sm">
              <span className="font-mono text-xs text-navy-600">{b.id} · {b.ward}</span>
              <StatusBadge label={b.status} tone={b.status === 'Occupied' ? 'blue' : 'green'} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-navy-900">Medical Staff ({staff.length})</h3>
        <ul className="flex flex-col gap-1.5">
          {staff.map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-md border border-navy-100 px-2.5 py-1.5 text-sm">
              <span className="text-navy-800">{s.name} · {s.role}</span>
              <StatusBadge label={s.status} tone={s.status === 'On Duty' ? 'green' : 'gray'} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-navy-900">Supplies ({supplies.length})</h3>
        <ul className="flex flex-col gap-1.5">
          {supplies.map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-md border border-navy-100 px-2.5 py-1.5 text-sm">
              <span className="text-navy-800">{s.item}</span>
              <StatusBadge label={s.stockStatus} tone={s.stockStatus === 'NORMAL' ? 'green' : s.stockStatus === 'LOW STOCK' ? 'yellow' : 'red'} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
