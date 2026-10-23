import type { Ambulance, Bed, Disaster, Hospital, HospitalCapacity, MedicalStaff, Patient, Shelter, Supply, TransportLog, Treatment, TriageLevelOption, TriageRecord, Volunteer, VolunteerAssignment } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = 'ApiError' }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(body?.error ?? `Request failed (${response.status})`, response.status)
  return body as T
}

const id = (prefix: string, value: unknown, width = 2) => `${prefix}-${String(value ?? '').padStart(width, '0')}`
const rawId = (value: string) => Number(value.substring(value.lastIndexOf('-') + 1))
const dateOnly = (value: unknown) => value ? String(value).slice(0, 10) : ''
const dateTime = (value: unknown) => value ? new Date(String(value)).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
const severity = (value: string): Disaster['severity'] => ({ Critical: 'CRITICAL', High: 'HIGH', Moderate: 'MODERATE', Low: 'LOW' }[value] ?? 'LOW') as Disaster['severity']

export const mapDisaster = (r: any, patients: Patient[] = [], shelters: Shelter[] = []): Disaster => {
  const disasterId = id('D', r.DisasterID)
  const matching = patients.filter((p) => p.disasterId === disasterId)
  const active = matching.some((p) => p.status === 'Admitted')
  return { id: disasterId, name: r.Type, type: r.Type, location: r.Location, startDate: dateOnly(r.StartDate), severity: severity(r.SeverityLevel), status: active ? 'ACTIVE' : 'UNKNOWN', description: r.Description ?? '', affectedHospitals: new Set(matching.map((p) => p.hospitalId).filter(Boolean)).size, patientCount: matching.length, criticalPatientCount: matching.filter((p) => p.triage === 'Red' && p.status === 'Admitted').length, activeShelters: shelters.filter((s) => s.disasterId === disasterId).length }
}

export function mapHospitalRows(rows: any[], bedRows: any[] = []): Hospital[] {
  return rows.map((r) => {
    const hospitalId = id('H', r.HospitalID)
    const beds = bedRows.filter((b) => id('H', b.HospitalID) === hospitalId)
    const group = (ward: string) => { const items = beds.filter((b) => b.WardType === ward); return { total: items.length, occupied: items.filter((b) => b.Status === 'Occupied' || b.PatientID != null).length } }
    const occupied = beds.filter((b) => b.Status === 'Occupied' || b.PatientID != null).length
    const capacity = Number(r.Capacity ?? 0)
    return { id: hospitalId, name: r.Name, location: r.Location, disasterIds: [], totalCapacity: capacity, occupied, available: Math.max(0, capacity - occupied), icu: group('ICU'), emergency: group('Emergency'), general: group('General') }
  })
}

export const mapHospitalCapacityRows = (rows: any[]): HospitalCapacity[] => rows.map((r) => ({
  hospitalId: id('H', r.HospitalID),
  hospitalName: r.HospitalName,
  location: r.Location,
  capacity: Number(r.Capacity ?? 0),
  totalBeds: Number(r.TotalBeds ?? 0),
  vacantBeds: Number(r.VacantBeds ?? 0),
  staffOnDuty: Number(r.StaffOnDuty ?? 0),
  ambulancesAvailable: Number(r.AmbulancesAvailable ?? 0),
  lowStockItems: r.LowStockItems ?? 'None',
}))

export function mapBedRows(rows: any[]): Bed[] { return rows.map((r) => ({ id: id('BED', r.BedID), hospitalId: id('H', r.HospitalID), ward: r.WardType, type: r.WardType, status: r.Status, ...(r.PatientID != null ? { patientId: id('P', r.PatientID) } : {}) })) }
export const mapTriageLevelRows = (rows: any[]): TriageLevelOption[] => rows.map((r) => ({ id: Number(r.TriageLevelID), colorCode: r.ColorCode, description: r.Description, priorityOrder: Number(r.PriorityOrder) }))
export function mapPatientRows(rows: any[], beds: Bed[], queue: any[]): Patient[] {
  return rows.map((r) => {
    const patientId = id('P', r.PatientID)
    const bed = beds.find((b) => b.patientId === patientId)
    const triage = r.triage_level ?? queue.find((q) => id('P', q.PatientID) === patientId)?.ColorCode
    return { id: patientId, name: r.Name, age: Number(r.Age), gender: r.Gender, triage: triage ?? 'Unknown', hospitalId: r.hospital_id != null ? id('H', r.hospital_id) : bed?.hospitalId ?? '', ...(bed ? { bedId: bed.id } : {}), status: r.Status, disasterId: id('D', r.DisasterID), admittedAt: '' }
  })
}
export const mapStaffRows = (rows: any[]): MedicalStaff[] => rows.map((r) => ({ id: id('S', r.StaffID), name: r.Name, role: r.Role, specialization: r.Specialization ?? '', hospitalId: id('H', r.HospitalID), status: 'Unknown', contact: r.ContactNumber }))
export const mapAmbulanceRows = (rows: any[]): Ambulance[] => rows.map((r) => ({ id: id('AMB', r.AmbulanceID, 3), vehicleNo: r.VehicleNo, driver: r.DriverName, hospitalId: id('H', r.HospitalID), status: r.Status, lastUpdated: '' }))
export const mapSupplyRows = (rows: any[]): Supply[] => rows.map((r) => ({ id: id('SUP', r.SupplyID, 2), item: r.ItemName, category: r.Category, quantity: Number(r.Quantity), unit: '', hospitalId: id('H', r.HospitalID), expiry: dateOnly(r.ExpiryDate) || '—', stockStatus: Number(r.Quantity) < 20 ? 'LOW STOCK' : 'NORMAL' }))
export const mapShelterRows = (rows: any[]): Shelter[] => rows.map((r) => ({ id: id('SH', r.ShelterID), name: r.Location, location: r.Location, disasterId: id('D', r.DisasterID), capacity: Number(r.Capacity), occupancy: Number(r.OccupancyCount ?? 0), status: Number(r.OccupancyCount ?? 0) >= Number(r.Capacity) ? 'FULL' : 'AVAILABLE' }))
export const mapVolunteerRows = (rows: any[], assignmentRows: any[] = []): Volunteer[] => rows.map((r) => { const rawRole = String(r.Role ?? '').toLowerCase(); const role = rawRole.includes('medical') || rawRole.includes('patient') ? 'Medical Aid' : rawRole.includes('shelter') ? 'Shelter Support' : rawRole.includes('logistic') || rawRole.includes('food') ? 'Logistics' : 'Coordination'; return { id: id('V', r.VolunteerID), name: r.Name, role, contact: r.ContactNumber, status: assignmentRows.some((a) => Number(a.VolunteerID) === Number(r.VolunteerID)) ? 'Assigned' : 'Available' } })
export const mapAssignmentRows = (rows: any[]): VolunteerAssignment[] => rows.map((r) => ({ id: id('VA', r.AssignmentID), volunteerId: id('V', r.VolunteerID), locationType: r.HospitalID != null ? 'Hospital' : 'Shelter', locationId: r.HospitalID != null ? id('H', r.HospitalID) : id('SH', r.ShelterID), assignedDate: dateOnly(r.AssignedDate) }))
export const mapTreatmentRows = (rows: any[], patients: Patient[] = []): Treatment[] => rows.map((r) => ({ id: id('TR', r.TreatmentID), patientId: id('P', r.PatientID), date: dateTime(r.TreatmentDate), description: r.Description ?? '', medication: r.Medication ?? '', staffId: id('S', r.StaffID), hospitalId: patients.find((p) => p.id === id('P', r.PatientID))?.hospitalId ?? '' }))
export const mapTransportRows = (rows: any[]): TransportLog[] => rows.map((r) => ({ id: id('TL', r.TransportID), patientId: id('P', r.PatientID), ambulanceId: id('AMB', r.AmbulanceID, 3), pickup: r.PickupLocation, destination: r.DropLocation, time: dateTime(r.Time), status: 'Unknown' }))
export const mapTriageRows = (rows: any[], patients: Patient[]): TriageRecord[] => rows.map((r) => { const patientId = id('P', r.PatientID); const patient = patients.find((p) => p.id === patientId); const vitals = String(r.VitalSigns ?? ''); const bp = vitals.match(/BP\s*([^,]+)/i)?.[1]?.trim() ?? ''; const pulse = Number(vitals.match(/Pulse\s*(\d+)/i)?.[1] ?? 0); const spo2 = Number(vitals.match(/SpO2\s*(\d+)/i)?.[1] ?? 0); const temp = Number(vitals.match(/Temp\s*([\d.]+)/i)?.[1] ?? 0); return { id: `TRG-${r.TriageID}-${r.PatientID}`, patientId, triage: r.ColorCode ?? 'Unknown', vitals: { bp, pulse, spo2, temp }, hospitalId: r.HospitalID != null ? id('H', r.HospitalID) : patient?.hospitalId ?? '', assessedByStaffId: r.StaffID != null ? id('S', r.StaffID) : '', assessedAt: dateTime(r.TriageTime), status: 'Unknown' } })

export const api = {
  getDisasters: () => request<any[]>('/disasters'), createDisaster: (body: unknown) => request<any>('/disasters', { method: 'POST', body: JSON.stringify(body) }), updateDisaster: (id: string, body: unknown) => request<any>(`/disasters/${rawId(id)}`, { method: 'PUT', body: JSON.stringify(body) }), deleteDisaster: (id: string) => request<any>(`/disasters/${rawId(id)}`, { method: 'DELETE' }),
  getHospitals: () => request<any[]>('/hospitals'), createHospital: (body: unknown) => request<any>('/hospitals', { method: 'POST', body: JSON.stringify(body) }), updateHospital: (id: string, body: unknown) => request<any>(`/hospitals/${rawId(id)}`, { method: 'PUT', body: JSON.stringify(body) }), deleteHospital: (id: string) => request<any>(`/hospitals/${rawId(id)}`, { method: 'DELETE' }),
  getPatients: () => request<any[]>('/patients'), createPatient: (body: unknown) => request<any>('/patients', { method: 'POST', body: JSON.stringify(body) }), updatePatient: (id: string, body: unknown) => request<any>(`/patients/${rawId(id)}`, { method: 'PUT', body: JSON.stringify(body) }),
  getTriageLevels: () => request<any[]>('/triage-levels'), getTriageQueue: () => request<any[]>('/triage-queue'), getTriageRecords: () => request<any[]>('/triage-records'), createTriageRecord: (body: unknown) => request<any>('/triage-records', { method: 'POST', body: JSON.stringify(body) }),
  getBeds: () => request<any[]>('/beds'), createBed: (body: unknown) => request<any>('/beds', { method: 'POST', body: JSON.stringify(body) }), assignBed: (bedId: string, patientId: string) => request<any>(`/beds/${rawId(bedId)}/assign`, { method: 'POST', body: JSON.stringify({ patientId: rawId(patientId) }) }), releaseBed: (bedId: string) => request<any>(`/beds/${rawId(bedId)}/release`, { method: 'POST' }),
  getStaff: () => request<any[]>('/staff'), createStaff: (body: unknown) => request<any>('/staff', { method: 'POST', body: JSON.stringify(body) }), getAmbulances: () => request<any[]>('/ambulances'), createAmbulance: (body: unknown) => request<any>('/ambulances', { method: 'POST', body: JSON.stringify(body) }),
  getSupplies: () => request<any[]>('/supplies'), createSupply: (body: unknown) => request<any>('/supplies', { method: 'POST', body: JSON.stringify(body) }), getTreatments: () => request<any[]>('/treatments'), createTreatment: (body: unknown) => request<any>('/treatments', { method: 'POST', body: JSON.stringify(body) }), getTransportLogs: () => request<any[]>('/transport-logs'), createTransportLog: (body: unknown) => request<any>('/transport-logs', { method: 'POST', body: JSON.stringify(body) }), getShelters: () => request<any[]>('/shelters'), createShelter: (body: unknown) => request<any>('/shelters', { method: 'POST', body: JSON.stringify(body) }), getVolunteers: () => request<any[]>('/volunteers'), createVolunteer: (body: unknown) => request<any>('/volunteers', { method: 'POST', body: JSON.stringify(body) }), getVolunteerAssignments: () => request<any[]>('/volunteer-assignments'), createVolunteerAssignment: (body: unknown) => request<any>('/volunteer-assignments', { method: 'POST', body: JSON.stringify(body) }), updateVolunteerAssignment: (id: string, body: unknown) => request<any>(`/volunteer-assignments/${rawId(id)}`, { method: 'PUT', body: JSON.stringify(body) }), deleteVolunteerAssignment: (id: string) => request<any>(`/volunteer-assignments/${rawId(id)}`, { method: 'DELETE' }), getDashboardHospitals: () => request<any[]>('/dashboard/hospitals'),
}
