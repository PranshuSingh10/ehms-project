import { useState } from 'react'
import { Users, AlertTriangle, BedDouble, Truck, UserRound, Tent } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { KpiCard } from '../components/dashboard/KpiCard'
import { IncidentPanel } from '../components/dashboard/IncidentPanel'
import { CriticalQueue } from '../components/dashboard/CriticalQueue'
import { HospitalCapacityList } from '../components/dashboard/HospitalCapacityList'
import { TriageDonutChart, BedOccupancyChart, AdmissionsChart, SupplyStatusChart } from '../components/dashboard/Charts'
import { Drawer } from '../components/shared/Drawer'
import { PatientDetailPanel } from '../components/patients/PatientDetailPanel'

export default function Dashboard() {
  const [viewingPatientId, setViewingPatientId] = useState<string | null>(null)
  const { activeDisaster, hospitals, hospitalCapacity, ambulances, staff, shelters, patients, getPatient, loading } = useAppData()
  const selectedHospitalIds = new Set(hospitals.filter((hospital) => activeDisaster && hospital.disasterIds.includes(activeDisaster.id)).map((hospital) => hospital.id))

  const availableBeds = hospitalCapacity.filter((hospital) => selectedHospitalIds.has(hospital.hospitalId)).reduce((sum, hospital) => sum + hospital.vacantBeds, 0)
  const availableAmbulances = ambulances.filter((ambulance) => selectedHospitalIds.has(ambulance.hospitalId) && ambulance.status === 'Available').length
  const staffOnDuty = staff.filter((member) => selectedHospitalIds.has(member.hospitalId)).length
  const sheltersActive = shelters.filter((s) => activeDisaster && s.disasterId === activeDisaster.id).length

  const viewingPatient = viewingPatientId ? getPatient(viewingPatientId) : undefined

  if (!activeDisaster) return <div className="rounded-lg border border-navy-200 bg-white p-6 text-sm text-navy-600">{loading ? 'Loading live emergency data…' : 'No disaster events are available.'}</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Emergency Operations Center</h1>
          <p className="mt-1 text-sm text-navy-500">
            {activeDisaster.name} — {activeDisaster.location} · Status{' '}
            <span className="font-semibold text-critical-600">{activeDisaster.status}</span> · Severity{' '}
            <span className="font-semibold text-critical-600">{activeDisaster.severity}</span>
          </p>
        </div>
        <p className="text-xs font-medium text-navy-400">Live data from EHMS</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <KpiCard icon={Users} value={patients.filter((p) => p.disasterId === activeDisaster.id && p.status === 'Admitted').length} label="Active Patients" context="Currently admitted" tone="blue" />
        <KpiCard icon={AlertTriangle} value={activeDisaster.criticalPatientCount} label="Critical Patients" context="Currently admitted, red triage" tone="red" />
        <KpiCard icon={BedDouble} value={availableBeds} label="Available Beds" context={`Across ${selectedHospitalIds.size} hospitals`} tone="green" />
        <KpiCard icon={Truck} value={availableAmbulances} label="Available Ambulances" context={`${ambulances.filter((ambulance) => selectedHospitalIds.has(ambulance.hospitalId) && ambulance.status !== 'Available').length} unavailable`} tone="blue" />
        <KpiCard icon={UserRound} value={staffOnDuty} label="Medical Staff" context="At hospitals supporting this event" tone="blue" />
        <KpiCard icon={Tent} value={sheltersActive} label="Shelters Tracked" context="For the selected disaster" tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TriageDonutChart />
        <BedOccupancyChart />
        <AdmissionsChart />
        <SupplyStatusChart />
      </div>

      <IncidentPanel disaster={activeDisaster} />

      <CriticalQueue onViewPatient={setViewingPatientId} disasterId={activeDisaster.id} />

      <HospitalCapacityList />

      <Drawer
        open={!!viewingPatient}
        onClose={() => setViewingPatientId(null)}
        title={viewingPatient?.name ?? ''}
        subtitle={viewingPatient ? `${viewingPatient.id} · Age ${viewingPatient.age}` : undefined}
      >
        {viewingPatient && <PatientDetailPanel patientId={viewingPatient.id} />}
      </Drawer>
    </div>
  )
}
