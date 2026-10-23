import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, ApiError, mapAmbulanceRows, mapAssignmentRows, mapBedRows, mapDisaster, mapHospitalCapacityRows, mapHospitalRows, mapPatientRows, mapShelterRows, mapStaffRows, mapSupplyRows, mapTransportRows, mapTreatmentRows, mapTriageLevelRows, mapTriageRows, mapVolunteerRows } from '../api'
import type { Ambulance, Bed, Disaster, Hospital, HospitalCapacity, MedicalStaff, Patient, Shelter, Supply, TransportLog, Treatment, TriageLevelOption, TriageRecord, Volunteer, VolunteerAssignment, Ward } from '../types'
import { useToast } from './ToastContext'

interface AppDataContextValue {
  disasters: Disaster[]; selectedDisasterId: string; setSelectedDisasterId: (id: string) => void; activeDisaster: Disaster | undefined; hospitals: Hospital[]; hospitalCapacity: HospitalCapacity[]; patients: Patient[]; beds: Bed[]; staff: MedicalStaff[]; ambulances: Ambulance[]; supplies: Supply[]; shelters: Shelter[]; treatments: Treatment[]; transportLogs: TransportLog[]; triageLevels: TriageLevelOption[]; triageRecords: TriageRecord[]; volunteers: Volunteer[]; assignments: VolunteerAssignment[]; loading: boolean; error: string | null; refresh: () => Promise<void>
  assignVolunteer: (volunteerId: string, locationType: 'Hospital' | 'Shelter', locationId: string) => Promise<void>; unassignVolunteer: (volunteerId: string) => Promise<void>; createPatient: (body: { name: string; age: number; gender: string; disasterId: number }) => Promise<void>; createTriageRecord: (body: { patientId: number; triageTime: string; vitalSigns: string; staffId: number; triageLevelId: number }) => Promise<void>; createBed: (body: { wardType: Ward; hospitalId: number }) => Promise<void>; assignBed: (bedId: string, patientId: string) => Promise<void>; releaseBed: (bedId: string) => Promise<void>; assignmentFor: (id: string) => VolunteerAssignment | undefined; locationName: (assignment: VolunteerAssignment) => string
  getHospital: (id: string) => Hospital | undefined; getPatient: (id: string) => Patient | undefined; getDisaster: (id: string) => Disaster | undefined; getStaff: (id: string) => MedicalStaff | undefined; getAmbulance: (id: string) => Ambulance | undefined; hospitalStaff: (id: string) => MedicalStaff[]; hospitalSupplies: (id: string) => Supply[]
}
const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [disasters, setDisasters] = useState<Disaster[]>([]); const [selectedDisasterId, setSelectedDisasterId] = useState(''); const [hospitals, setHospitals] = useState<Hospital[]>([]); const [hospitalCapacity, setHospitalCapacity] = useState<HospitalCapacity[]>([]); const [patients, setPatients] = useState<Patient[]>([]); const [beds, setBeds] = useState<Bed[]>([]); const [staff, setStaff] = useState<MedicalStaff[]>([]); const [ambulances, setAmbulances] = useState<Ambulance[]>([]); const [supplies, setSupplies] = useState<Supply[]>([]); const [shelters, setShelters] = useState<Shelter[]>([]); const [treatments, setTreatments] = useState<Treatment[]>([]); const [transportLogs, setTransportLogs] = useState<TransportLog[]>([]); const [triageLevels, setTriageLevels] = useState<TriageLevelOption[]>([]); const [triageRecords, setTriageRecords] = useState<TriageRecord[]>([]); const [volunteers, setVolunteers] = useState<Volunteer[]>([]); const [assignments, setAssignments] = useState<VolunteerAssignment[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null)
  const { addToast } = useToast()
  const refresh = async () => {
    setLoading(true); setError(null)
    try {
      const [dr, hr, pr, br, sr, ar, sup, shr, tr, tl, triageLevelRows, qr, allTriage, vr, varows, capacityRows] = await Promise.all([api.getDisasters(), api.getHospitals(), api.getPatients(), api.getBeds(), api.getStaff(), api.getAmbulances(), api.getSupplies(), api.getShelters(), api.getTreatments(), api.getTransportLogs(), api.getTriageLevels(), api.getTriageQueue(), api.getTriageRecords(), api.getVolunteers(), api.getVolunteerAssignments(), api.getDashboardHospitals()])
      const nextBeds = mapBedRows(br); const nextShelters = mapShelterRows(shr); const nextStaff = mapStaffRows(sr); const nextAmbulances = mapAmbulanceRows(ar); const nextSupplies = mapSupplyRows(sup); const nextAssignments = mapAssignmentRows(varows); const nextVolunteers = mapVolunteerRows(vr, varows); const nextHospitals = mapHospitalRows(hr, br).map((h) => ({ ...h, disasterIds: [...new Set(pr.filter((p: any) => br.some((b: any) => Number(b.HospitalID) === Number(h.id.substring(h.id.lastIndexOf('-') + 1)) && Number(b.PatientID) === Number(p.PatientID))).map((p: any) => `D-${String(p.DisasterID).padStart(2, '0')}`))] }))
      const nextPatients = mapPatientRows(pr, nextBeds, qr); const nextDisasters = dr.map((d) => mapDisaster(d, nextPatients, nextShelters))
      setBeds(nextBeds); setShelters(nextShelters); setStaff(nextStaff); setAmbulances(nextAmbulances); setSupplies(nextSupplies); setAssignments(nextAssignments); setVolunteers(nextVolunteers); setHospitals(nextHospitals); setHospitalCapacity(mapHospitalCapacityRows(capacityRows)); setPatients(nextPatients); setDisasters(nextDisasters); setTreatments(mapTreatmentRows(tr, nextPatients)); setTransportLogs(mapTransportRows(tl)); setTriageLevels(mapTriageLevelRows(triageLevelRows)); setTriageRecords(mapTriageRows(allTriage, nextPatients))
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load data from the EHMS API') }
    finally { setLoading(false) }
  }
  useEffect(() => { void refresh() }, [])
  useEffect(() => {
    const defaultDisaster = disasters.find((disaster) => disaster.status === 'ACTIVE') ?? disasters[0]
    setSelectedDisasterId((current) => disasters.some((disaster) => disaster.id === current) ? current : defaultDisaster?.id ?? '')
  }, [disasters])
  const assignVolunteer = async (volunteerId: string, locationType: 'Hospital' | 'Shelter', locationId: string) => {
    const numericId = (value: string) => Number(value.substring(value.lastIndexOf('-') + 1))
    const body = { volunteerId: numericId(volunteerId), shelterId: locationType === 'Shelter' ? numericId(locationId) : null, hospitalId: locationType === 'Hospital' ? numericId(locationId) : null, assignedDate: new Date().toISOString().slice(0, 10) }
    const previous = assignments.find((a) => a.volunteerId === volunteerId)
    if (previous) await api.updateVolunteerAssignment(previous.id, body)
    else await api.createVolunteerAssignment(body)
    await refresh(); addToast('Volunteer assignment saved.')
  }
  const unassignVolunteer = async (volunteerId: string) => { const assignment = assignments.find((a) => a.volunteerId === volunteerId); if (!assignment) return; await api.deleteVolunteerAssignment(assignment.id); await refresh(); addToast('Volunteer released from assignment.', 'info') }
  const createPatient = async (body: { name: string; age: number; gender: string; disasterId: number }) => { await api.createPatient(body); await refresh(); addToast('Patient record created.') }
  const createTriageRecord = async (body: { patientId: number; triageTime: string; vitalSigns: string; staffId: number; triageLevelId: number }) => { await api.createTriageRecord(body); await refresh(); addToast('Triage assessment saved.') }
  const createBed = async (body: { wardType: Ward; hospitalId: number }) => { await api.createBed(body); await refresh(); addToast('Vacant bed added.') }
  const assignBed = async (bedId: string, patientId: string) => {
    try { await api.assignBed(bedId, patientId); await refresh(); addToast('Patient assigned to bed.') }
    catch (e) { if (e instanceof ApiError && e.status === 409) await refresh(); throw e }
  }
  const releaseBed = async (bedId: string) => { await api.releaseBed(bedId); await refresh(); addToast('Bed released.', 'info') }
  const activeDisaster = disasters.find((disaster) => disaster.id === selectedDisasterId) ?? disasters.find((disaster) => disaster.status === 'ACTIVE') ?? disasters[0]
  const value = useMemo<AppDataContextValue>(() => ({ disasters, selectedDisasterId, setSelectedDisasterId, activeDisaster, hospitals, hospitalCapacity, patients, beds, staff, ambulances, supplies, shelters, treatments, transportLogs, triageLevels, triageRecords, volunteers, assignments, loading, error, refresh, assignVolunteer, unassignVolunteer, createPatient, createTriageRecord, createBed, assignBed, releaseBed, assignmentFor: (id) => assignments.find((a) => a.volunteerId === id), locationName: (a) => a.locationType === 'Hospital' ? hospitals.find((h) => h.id === a.locationId)?.name ?? a.locationId : shelters.find((s) => s.id === a.locationId)?.name ?? a.locationId, getHospital: (id) => hospitals.find((x) => x.id === id), getPatient: (id) => patients.find((x) => x.id === id), getDisaster: (id) => disasters.find((x) => x.id === id), getStaff: (id) => staff.find((x) => x.id === id), getAmbulance: (id) => ambulances.find((x) => x.id === id), hospitalStaff: (id) => staff.filter((x) => x.hospitalId === id), hospitalSupplies: (id) => supplies.filter((x) => x.hospitalId === id) }), [disasters, selectedDisasterId, activeDisaster, hospitals, hospitalCapacity, patients, beds, staff, ambulances, supplies, shelters, treatments, transportLogs, triageLevels, triageRecords, volunteers, assignments, loading, error])
  return <AppDataContext.Provider value={value}>{loading && <div role="status" className="fixed bottom-4 left-4 right-4 z-[100] rounded-lg border border-navy-200 bg-white px-4 py-3 text-sm text-navy-600 shadow-lg">Loading live EHMS data…</div>}{error && <div role="alert" className="fixed bottom-4 left-4 right-4 z-[100] rounded-lg border border-critical-200 bg-critical-50 px-4 py-3 text-sm text-critical-700 shadow-lg">Could not load live EHMS data: {error}</div>}{children}</AppDataContext.Provider>
}
export function useAppData() { const ctx = useContext(AppDataContext); if (!ctx) throw new Error('useAppData must be used within AppDataProvider'); return ctx }
