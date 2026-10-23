export type TriageLevel = 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Unknown'

export interface TriageLevelOption {
  id: number
  colorCode: Exclude<TriageLevel, 'Unknown'>
  description: string
  priorityOrder: number
}

export type Severity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'

export type DisasterStatus = 'ACTIVE' | 'MONITORING' | 'RESOLVED' | 'UNKNOWN'

export interface Disaster {
  id: string
  name: string
  type: string
  location: string
  startDate: string
  endDate?: string
  severity: Severity
  status: DisasterStatus
  description: string
  /** aggregate, system-wide operational stats for this event (not the sample record count) */
  affectedHospitals: number
  patientCount: number
  criticalPatientCount: number
  activeShelters: number
}

export interface BedGroup {
  total: number
  occupied: number
}

export interface Hospital {
  id: string
  name: string
  location: string
  disasterIds: string[]
  totalCapacity: number
  occupied: number
  available: number
  icu: BedGroup
  emergency: BedGroup
  general: BedGroup
}

export interface HospitalCapacity {
  hospitalId: string
  hospitalName: string
  location: string
  capacity: number
  totalBeds: number
  vacantBeds: number
  staffOnDuty: number
  ambulancesAvailable: number
  lowStockItems: string
}

export type PatientStatus = 'Admitted' | 'Discharged' | 'Transferred' | 'Deceased'
export type Gender = 'Male' | 'Female' | 'Other'

export interface Patient {
  id: string
  name: string
  age: number
  gender: Gender
  triage: TriageLevel
  hospitalId: string
  bedId?: string
  status: PatientStatus
  disasterId: string
  admittedAt: string
}

export type StaffRole = 'Doctor' | 'Nurse' | 'Paramedic'
export type StaffStatus = 'On Duty' | 'Off Duty' | 'Unknown'

export interface MedicalStaff {
  id: string
  name: string
  role: StaffRole
  specialization: string
  hospitalId: string
  status: StaffStatus
  contact: string
}

export type Ward = 'ICU' | 'Emergency' | 'General'
export type BedStatus = 'Occupied' | 'Vacant'

export interface Bed {
  id: string
  hospitalId: string
  ward: Ward
  type: string
  status: BedStatus
  patientId?: string
}

export type AmbulanceStatus = 'Available' | 'On Trip' | 'Maintenance'

export interface Ambulance {
  id: string
  vehicleNo: string
  driver: string
  hospitalId: string
  status: AmbulanceStatus
  currentTrip?: string
  lastUpdated: string
}

export interface Vitals {
  bp: string
  pulse: number
  spo2: number
  temp: number
}

export type TriageRecordStatus = 'Waiting' | 'In Treatment' | 'Stabilized' | 'Critical' | 'Discharged' | 'Unknown'

export interface TriageRecord {
  id: string
  patientId: string
  triage: TriageLevel
  vitals: Vitals
  hospitalId: string
  assessedByStaffId: string
  assessedAt: string
  status: TriageRecordStatus
}

export interface Treatment {
  id: string
  patientId: string
  date: string
  description: string
  medication: string
  staffId: string
  hospitalId: string
}

export type SupplyCategory = 'Medicine' | 'Oxygen' | 'Blood' | 'Equipment'
export type StockStatus = 'NORMAL' | 'LOW STOCK' | 'CRITICAL'

export interface Supply {
  id: string
  item: string
  category: SupplyCategory
  quantity: number
  unit: string
  hospitalId: string
  expiry: string
  stockStatus: StockStatus
}

export type ShelterStatus = 'AVAILABLE' | 'NEAR CAPACITY' | 'FULL'

export interface Shelter {
  id: string
  name: string
  location: string
  disasterId: string
  capacity: number
  occupancy: number
  status: ShelterStatus
}

export type VolunteerRole = 'Medical Aid' | 'Logistics' | 'Shelter Support' | 'Coordination'
export type VolunteerStatus = 'Available' | 'Assigned'

export interface Volunteer {
  id: string
  name: string
  role: VolunteerRole
  contact: string
  status: VolunteerStatus
}

export type AssignmentLocationType = 'Hospital' | 'Shelter'

export interface VolunteerAssignment {
  id: string
  volunteerId: string
  locationType: AssignmentLocationType
  locationId: string
  assignedDate: string
}

export type TransportStatus = 'Completed' | 'In Progress' | 'Scheduled' | 'Unknown'

export interface TransportLog {
  id: string
  patientId: string
  ambulanceId: string
  pickup: string
  destination: string
  time: string
  status: TransportStatus
}

export interface AdmissionPoint {
  time: string
  admissions: number
}
