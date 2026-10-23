import type {
  Ambulance,
  Bed,
  Disaster,
  Hospital,
  MedicalStaff,
  Patient,
  Shelter,
  Supply,
  TransportLog,
  Treatment,
  TriageRecord,
  Volunteer,
  VolunteerAssignment,
  AdmissionPoint,
} from '../types'

export const DISASTERS: Disaster[] = [
  {
    id: 'D-2026-09',
    name: 'Monsoon Flood',
    type: 'Flood',
    location: 'Pune Region',
    startDate: '2026-09-28',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    description:
      'Severe flooding has affected multiple areas across the Pune region and triggered a mass-casualty emergency response operation across five partner hospitals and eight relief shelters.',
    affectedHospitals: 5,
    patientCount: 248,
    criticalPatientCount: 24,
    activeShelters: 8,
  },
  {
    id: 'D-2025-05',
    name: 'Heatwave',
    type: 'Extreme Heat',
    location: 'Nagpur District',
    startDate: '2025-05-12',
    endDate: '2025-05-20',
    severity: 'HIGH',
    status: 'RESOLVED',
    description:
      'A prolonged extreme-heat event caused a surge in heatstroke and dehydration admissions across Nagpur District. The response concluded with all patients discharged and shelters stood down.',
    affectedHospitals: 2,
    patientCount: 63,
    criticalPatientCount: 4,
    activeShelters: 0,
  },
]

export const ACTIVE_DISASTER_ID = 'D-2026-09'

export const HOSPITALS: Hospital[] = [
  {
    id: 'H-01',
    name: 'City General Hospital',
    location: 'Pune Central',
    disasterIds: ['D-2026-09'],
    totalCapacity: 320,
    occupied: 286,
    available: 34,
    icu: { total: 20, occupied: 18 },
    emergency: { total: 40, occupied: 36 },
    general: { total: 260, occupied: 232 },
  },
  {
    id: 'H-02',
    name: 'District Emergency Hospital',
    location: 'Kothrud, Pune',
    disasterIds: ['D-2026-09'],
    totalCapacity: 250,
    occupied: 231,
    available: 19,
    icu: { total: 15, occupied: 14 },
    emergency: { total: 30, occupied: 28 },
    general: { total: 205, occupied: 189 },
  },
  {
    id: 'H-03',
    name: 'Pune Civil Hospital',
    location: 'Pune Camp',
    disasterIds: ['D-2026-09'],
    totalCapacity: 400,
    occupied: 386,
    available: 14,
    icu: { total: 25, occupied: 24 },
    emergency: { total: 45, occupied: 42 },
    general: { total: 330, occupied: 320 },
  },
  {
    id: 'H-04',
    name: 'Sahyadri Multispecialty Hospital',
    location: 'Hadapsar, Pune',
    disasterIds: ['D-2026-09'],
    totalCapacity: 180,
    occupied: 172,
    available: 8,
    icu: { total: 12, occupied: 11 },
    emergency: { total: 20, occupied: 19 },
    general: { total: 148, occupied: 142 },
  },
  {
    id: 'H-05',
    name: 'Ruby Hall Relief Center',
    location: 'Wanowrie, Pune',
    disasterIds: ['D-2026-09'],
    totalCapacity: 150,
    occupied: 138,
    available: 12,
    icu: { total: 10, occupied: 9 },
    emergency: { total: 15, occupied: 14 },
    general: { total: 125, occupied: 115 },
  },
]

export const MEDICAL_STAFF: MedicalStaff[] = [
  { id: 'S-01', name: 'Dr. Priya Mehta', role: 'Doctor', specialization: 'Emergency Medicine', hospitalId: 'H-01', status: 'On Duty', contact: '+91 98221 34567' },
  { id: 'S-02', name: 'Dr. Arvind Kulkarni', role: 'Doctor', specialization: 'Trauma Surgery', hospitalId: 'H-01', status: 'On Duty', contact: '+91 98221 34568' },
  { id: 'S-03', name: 'Dr. Neha Deshpande', role: 'Doctor', specialization: 'Critical Care', hospitalId: 'H-02', status: 'On Duty', contact: '+91 98221 34569' },
  { id: 'S-04', name: 'Dr. Sameer Joshi', role: 'Doctor', specialization: 'Orthopedics', hospitalId: 'H-03', status: 'Off Duty', contact: '+91 98221 34570' },
  { id: 'S-05', name: 'Dr. Kavita Rane', role: 'Doctor', specialization: 'Pediatrics', hospitalId: 'H-04', status: 'On Duty', contact: '+91 98221 34571' },
  { id: 'S-06', name: 'Dr. Rohan Kale', role: 'Doctor', specialization: 'General Medicine', hospitalId: 'H-05', status: 'On Duty', contact: '+91 98221 34572' },
  { id: 'S-07', name: 'Anjali Pawar', role: 'Nurse', specialization: 'ICU Care', hospitalId: 'H-01', status: 'On Duty', contact: '+91 98221 34573' },
  { id: 'S-08', name: 'Sunita More', role: 'Nurse', specialization: 'Emergency Care', hospitalId: 'H-02', status: 'On Duty', contact: '+91 98221 34574' },
  { id: 'S-09', name: 'Deepak Shinde', role: 'Nurse', specialization: 'General Ward', hospitalId: 'H-03', status: 'Off Duty', contact: '+91 98221 34575' },
  { id: 'S-10', name: 'Meera Gokhale', role: 'Nurse', specialization: 'Triage', hospitalId: 'H-01', status: 'On Duty', contact: '+91 98221 34576' },
  { id: 'S-11', name: 'Rajesh Patil', role: 'Nurse', specialization: 'ICU Care', hospitalId: 'H-04', status: 'On Duty', contact: '+91 98221 34577' },
  { id: 'S-12', name: 'Vikram Salunkhe', role: 'Paramedic', specialization: 'Ambulance Response', hospitalId: 'H-01', status: 'On Duty', contact: '+91 98221 34578' },
  { id: 'S-13', name: 'Farhan Shaikh', role: 'Paramedic', specialization: 'Field Triage', hospitalId: 'H-02', status: 'On Duty', contact: '+91 98221 34579' },
  { id: 'S-14', name: 'Omkar Bhosale', role: 'Paramedic', specialization: 'Ambulance Response', hospitalId: 'H-03', status: 'Off Duty', contact: '+91 98221 34580' },
]

export const AMBULANCES: Ambulance[] = [
  { id: 'AMB-001', vehicleNo: 'MH12 AB 1234', driver: 'Raj Patil', hospitalId: 'H-01', status: 'On Trip', currentTrip: 'Riverbank Colony → City General Hospital', lastUpdated: '10:55 AM' },
  { id: 'AMB-002', vehicleNo: 'MH12 CD 5678', driver: 'Suresh Nikam', hospitalId: 'H-01', status: 'Available', lastUpdated: '09:50 AM' },
  { id: 'AMB-003', vehicleNo: 'MH12 EF 9012', driver: 'Ganesh Waghmare', hospitalId: 'H-02', status: 'On Trip', currentTrip: 'Kharadi Flood Pocket → District Emergency Hospital', lastUpdated: '11:02 AM' },
  { id: 'AMB-004', vehicleNo: 'MH12 GH 3456', driver: 'Prakash Jadhav', hospitalId: 'H-02', status: 'Available', lastUpdated: '09:40 AM' },
  { id: 'AMB-005', vehicleNo: 'MH12 IJ 7890', driver: 'Santosh More', hospitalId: 'H-03', status: 'On Trip', currentTrip: 'Camp Flood Zone - Sector 4 → Pune Civil Hospital', lastUpdated: '11:08 AM' },
  { id: 'AMB-006', vehicleNo: 'MH12 KL 2345', driver: 'Dattatray Kadam', hospitalId: 'H-03', status: 'Available', lastUpdated: '09:30 AM' },
  { id: 'AMB-007', vehicleNo: 'MH12 MN 6789', driver: 'Yogesh Gaikwad', hospitalId: 'H-04', status: 'Available', lastUpdated: '09:55 AM' },
  { id: 'AMB-008', vehicleNo: 'MH12 OP 0123', driver: 'Nitin Chavan', hospitalId: 'H-05', status: 'Maintenance', lastUpdated: '08:00 AM' },
  { id: 'AMB-009', vehicleNo: 'MH12 QR 4567', driver: 'Abhijit Thorat', hospitalId: 'H-05', status: 'Available', lastUpdated: '09:45 AM' },
  { id: 'AMB-010', vehicleNo: 'MH12 ST 8901', driver: 'Manoj Bhalerao', hospitalId: 'H-04', status: 'Maintenance', lastUpdated: '07:30 AM' },
]

export const PATIENTS: Patient[] = [
  { id: 'P-1001', name: 'Meera Iyer', age: 34, gender: 'Female', triage: 'Yellow', hospitalId: 'H-01', bedId: 'GEN-101', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '09:12 AM' },
  { id: 'P-1004', name: 'Rohan Deshmukh', age: 29, gender: 'Male', triage: 'Green', hospitalId: 'H-01', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '09:20 AM' },
  { id: 'P-1008', name: 'Sanjana Kulkarni', age: 58, gender: 'Female', triage: 'Orange', hospitalId: 'H-02', bedId: 'EMG-03', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '09:25 AM' },
  { id: 'P-1012', name: 'Imran Sheikh', age: 46, gender: 'Male', triage: 'Red', hospitalId: 'H-02', bedId: 'ICU-05', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '09:31 AM' },
  { id: 'P-1015', name: 'Priya Nair', age: 8, gender: 'Female', triage: 'Orange', hospitalId: 'H-01', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '09:38 AM' },
  { id: 'P-1017', name: 'Vikas Choudhary', age: 61, gender: 'Male', triage: 'Red', hospitalId: 'H-03', bedId: 'ICU-07', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '09:44 AM' },
  { id: 'P-1019', name: 'Ananya Rao', age: 22, gender: 'Female', triage: 'Green', hospitalId: 'H-03', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '09:50 AM' },
  { id: 'P-1024', name: 'Aarav Sharma', age: 42, gender: 'Male', triage: 'Red', hospitalId: 'H-01', bedId: 'ICU-04', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:15 AM' },
  { id: 'P-1028', name: 'Fatima Ansari', age: 35, gender: 'Female', triage: 'Yellow', hospitalId: 'H-04', bedId: 'GEN-110', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '09:58 AM' },
  { id: 'P-1033', name: 'Karan Malhotra', age: 50, gender: 'Male', triage: 'Orange', hospitalId: 'H-01', bedId: 'EMG-01', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:02 AM' },
  { id: 'P-1037', name: 'Divya Patil', age: 27, gender: 'Female', triage: 'Green', hospitalId: 'H-05', bedId: 'GEN-111', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:06 AM' },
  { id: 'P-1041', name: 'Suresh Yadav', age: 67, gender: 'Male', triage: 'Red', hospitalId: 'H-02', bedId: 'ICU-06', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:11 AM' },
  { id: 'P-1044', name: 'Neha Verma', age: 19, gender: 'Female', triage: 'Yellow', hospitalId: 'H-03', bedId: 'GEN-108', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:15 AM' },
  { id: 'P-1048', name: 'Amitabh Ghosh', age: 55, gender: 'Male', triage: 'Orange', hospitalId: 'H-04', bedId: 'EMG-06', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:20 AM' },
  { id: 'P-1052', name: 'Kavya Menon', age: 31, gender: 'Female', triage: 'Green', hospitalId: 'H-01', status: 'Discharged', disasterId: 'D-2026-09', admittedAt: '08:40 AM' },
  { id: 'P-1057', name: 'Rahul Bhatt', age: 44, gender: 'Male', triage: 'Yellow', hospitalId: 'H-05', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:26 AM' },
  { id: 'P-1061', name: 'Sneha Joshi', age: 6, gender: 'Female', triage: 'Red', hospitalId: 'H-01', bedId: 'ICU-01', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:33 AM' },
  { id: 'P-1064', name: 'Manoj Tiwari', age: 39, gender: 'Male', triage: 'Green', hospitalId: 'H-02', status: 'Transferred', disasterId: 'D-2026-09', admittedAt: '09:05 AM' },
  { id: 'P-1068', name: 'Pooja Reddy', age: 52, gender: 'Female', triage: 'Orange', hospitalId: 'H-03', bedId: 'EMG-05', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:37 AM' },
  { id: 'P-1073', name: 'Deepak Kumar', age: 71, gender: 'Male', triage: 'Red', hospitalId: 'H-04', status: 'Deceased', disasterId: 'D-2026-09', admittedAt: '08:55 AM' },
  { id: 'P-1077', name: 'Anushka Pillai', age: 24, gender: 'Female', triage: 'Yellow', hospitalId: 'H-05', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:40 AM' },
  { id: 'P-1082', name: 'Harish Naidu', age: 63, gender: 'Male', triage: 'Green', hospitalId: 'H-02', bedId: 'GEN-107', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:45 AM' },
  { id: 'P-1085', name: 'Ritu Saxena', age: 41, gender: 'Female', triage: 'Orange', hospitalId: 'H-01', bedId: 'GEN-103', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:48 AM' },
  { id: 'P-1091', name: 'Vivaan Kapoor', age: 37, gender: 'Male', triage: 'Yellow', hospitalId: 'H-01', bedId: 'GEN-104', status: 'Admitted', disasterId: 'D-2026-09', admittedAt: '10:50 AM' },
  { id: 'P-1094', name: 'Lata Kulkarni', age: 68, gender: 'Female', triage: 'Yellow', hospitalId: 'H-01', status: 'Discharged', disasterId: 'D-2025-05', admittedAt: '2025-05-13 11:20 AM' },
  { id: 'P-1097', name: 'Sanjay Pawar', age: 45, gender: 'Male', triage: 'Orange', hospitalId: 'H-02', status: 'Discharged', disasterId: 'D-2025-05', admittedAt: '2025-05-14 09:15 AM' },
]

export const BEDS: Bed[] = [
  { id: 'ICU-01', hospitalId: 'H-01', ward: 'ICU', type: 'Isolation ICU', status: 'Occupied', patientId: 'P-1061' },
  { id: 'ICU-02', hospitalId: 'H-01', ward: 'ICU', type: 'Standard ICU', status: 'Vacant' },
  { id: 'ICU-03', hospitalId: 'H-01', ward: 'ICU', type: 'Standard ICU', status: 'Vacant' },
  { id: 'ICU-04', hospitalId: 'H-01', ward: 'ICU', type: 'Standard ICU', status: 'Occupied', patientId: 'P-1024' },
  { id: 'EMG-01', hospitalId: 'H-01', ward: 'Emergency', type: 'Trauma Bay', status: 'Occupied', patientId: 'P-1033' },
  { id: 'EMG-02', hospitalId: 'H-01', ward: 'Emergency', type: 'Trauma Bay', status: 'Vacant' },
  { id: 'GEN-101', hospitalId: 'H-01', ward: 'General', type: 'Standard Ward', status: 'Occupied', patientId: 'P-1001' },
  { id: 'GEN-102', hospitalId: 'H-01', ward: 'General', type: 'Standard Ward', status: 'Vacant' },
  { id: 'GEN-103', hospitalId: 'H-01', ward: 'General', type: 'Standard Ward', status: 'Occupied', patientId: 'P-1085' },
  { id: 'GEN-104', hospitalId: 'H-01', ward: 'General', type: 'Standard Ward', status: 'Occupied', patientId: 'P-1091' },
  { id: 'GEN-105', hospitalId: 'H-01', ward: 'General', type: 'Standard Ward', status: 'Vacant' },
  { id: 'ICU-05', hospitalId: 'H-02', ward: 'ICU', type: 'Standard ICU', status: 'Occupied', patientId: 'P-1012' },
  { id: 'ICU-06', hospitalId: 'H-02', ward: 'ICU', type: 'Standard ICU', status: 'Occupied', patientId: 'P-1041' },
  { id: 'EMG-03', hospitalId: 'H-02', ward: 'Emergency', type: 'Trauma Bay', status: 'Occupied', patientId: 'P-1008' },
  { id: 'EMG-04', hospitalId: 'H-02', ward: 'Emergency', type: 'Trauma Bay', status: 'Vacant' },
  { id: 'GEN-106', hospitalId: 'H-02', ward: 'General', type: 'Standard Ward', status: 'Vacant' },
  { id: 'GEN-107', hospitalId: 'H-02', ward: 'General', type: 'Standard Ward', status: 'Occupied', patientId: 'P-1082' },
  { id: 'ICU-07', hospitalId: 'H-03', ward: 'ICU', type: 'Standard ICU', status: 'Occupied', patientId: 'P-1017' },
  { id: 'EMG-05', hospitalId: 'H-03', ward: 'Emergency', type: 'Trauma Bay', status: 'Occupied', patientId: 'P-1068' },
  { id: 'GEN-108', hospitalId: 'H-03', ward: 'General', type: 'Standard Ward', status: 'Occupied', patientId: 'P-1044' },
  { id: 'GEN-109', hospitalId: 'H-03', ward: 'General', type: 'Standard Ward', status: 'Vacant' },
  { id: 'ICU-08', hospitalId: 'H-04', ward: 'ICU', type: 'Standard ICU', status: 'Vacant' },
  { id: 'EMG-06', hospitalId: 'H-04', ward: 'Emergency', type: 'Trauma Bay', status: 'Occupied', patientId: 'P-1048' },
  { id: 'GEN-110', hospitalId: 'H-04', ward: 'General', type: 'Standard Ward', status: 'Occupied', patientId: 'P-1028' },
  { id: 'GEN-111', hospitalId: 'H-05', ward: 'General', type: 'Standard Ward', status: 'Occupied', patientId: 'P-1037' },
  { id: 'GEN-112', hospitalId: 'H-05', ward: 'General', type: 'Standard Ward', status: 'Vacant' },
]

export const TRIAGE_RECORDS: TriageRecord[] = [
  { id: 'TRG-001', patientId: 'P-1001', triage: 'Yellow', vitals: { bp: '128/84', pulse: 92, spo2: 97, temp: 37.1 }, hospitalId: 'H-01', assessedByStaffId: 'S-10', assessedAt: '09:14 AM', status: 'In Treatment' },
  { id: 'TRG-002', patientId: 'P-1004', triage: 'Green', vitals: { bp: '118/76', pulse: 78, spo2: 99, temp: 36.8 }, hospitalId: 'H-01', assessedByStaffId: 'S-10', assessedAt: '09:22 AM', status: 'Stabilized' },
  { id: 'TRG-003', patientId: 'P-1008', triage: 'Orange', vitals: { bp: '142/92', pulse: 104, spo2: 94, temp: 37.6 }, hospitalId: 'H-02', assessedByStaffId: 'S-08', assessedAt: '09:27 AM', status: 'In Treatment' },
  { id: 'TRG-004', patientId: 'P-1012', triage: 'Red', vitals: { bp: '88/56', pulse: 128, spo2: 86, temp: 36.2 }, hospitalId: 'H-02', assessedByStaffId: 'S-03', assessedAt: '09:33 AM', status: 'Critical' },
  { id: 'TRG-005', patientId: 'P-1015', triage: 'Orange', vitals: { bp: '110/70', pulse: 110, spo2: 95, temp: 37.9 }, hospitalId: 'H-01', assessedByStaffId: 'S-10', assessedAt: '09:40 AM', status: 'In Treatment' },
  { id: 'TRG-006', patientId: 'P-1017', triage: 'Red', vitals: { bp: '92/60', pulse: 122, spo2: 88, temp: 36.5 }, hospitalId: 'H-03', assessedByStaffId: 'S-04', assessedAt: '09:46 AM', status: 'Critical' },
  { id: 'TRG-007', patientId: 'P-1019', triage: 'Green', vitals: { bp: '116/74', pulse: 80, spo2: 99, temp: 36.9 }, hospitalId: 'H-03', assessedByStaffId: 'S-09', assessedAt: '09:52 AM', status: 'Stabilized' },
  { id: 'TRG-008', patientId: 'P-1024', triage: 'Red', vitals: { bp: '84/52', pulse: 132, spo2: 85, temp: 36.1 }, hospitalId: 'H-01', assessedByStaffId: 'S-01', assessedAt: '10:42 AM', status: 'Critical' },
  { id: 'TRG-009', patientId: 'P-1028', triage: 'Yellow', vitals: { bp: '124/80', pulse: 88, spo2: 96, temp: 37.2 }, hospitalId: 'H-04', assessedByStaffId: 'S-05', assessedAt: '10:00 AM', status: 'In Treatment' },
  { id: 'TRG-010', patientId: 'P-1033', triage: 'Orange', vitals: { bp: '138/88', pulse: 100, spo2: 95, temp: 37.4 }, hospitalId: 'H-01', assessedByStaffId: 'S-02', assessedAt: '10:04 AM', status: 'In Treatment' },
  { id: 'TRG-011', patientId: 'P-1037', triage: 'Green', vitals: { bp: '114/72', pulse: 76, spo2: 99, temp: 36.7 }, hospitalId: 'H-05', assessedByStaffId: 'S-06', assessedAt: '10:08 AM', status: 'Stabilized' },
  { id: 'TRG-012', patientId: 'P-1041', triage: 'Red', vitals: { bp: '90/58', pulse: 124, spo2: 87, temp: 36.4 }, hospitalId: 'H-02', assessedByStaffId: 'S-03', assessedAt: '10:13 AM', status: 'Critical' },
  { id: 'TRG-013', patientId: 'P-1044', triage: 'Yellow', vitals: { bp: '120/78', pulse: 90, spo2: 97, temp: 37.0 }, hospitalId: 'H-03', assessedByStaffId: 'S-04', assessedAt: '10:17 AM', status: 'In Treatment' },
  { id: 'TRG-014', patientId: 'P-1048', triage: 'Orange', vitals: { bp: '136/86', pulse: 98, spo2: 93, temp: 37.5 }, hospitalId: 'H-04', assessedByStaffId: 'S-05', assessedAt: '10:22 AM', status: 'In Treatment' },
  { id: 'TRG-015', patientId: 'P-1052', triage: 'Green', vitals: { bp: '112/70', pulse: 74, spo2: 99, temp: 36.6 }, hospitalId: 'H-01', assessedByStaffId: 'S-10', assessedAt: '08:42 AM', status: 'Discharged' },
  { id: 'TRG-016', patientId: 'P-1057', triage: 'Yellow', vitals: { bp: '122/80', pulse: 86, spo2: 96, temp: 37.3 }, hospitalId: 'H-05', assessedByStaffId: 'S-06', assessedAt: '10:28 AM', status: 'In Treatment' },
  { id: 'TRG-017', patientId: 'P-1061', triage: 'Red', vitals: { bp: '86/54', pulse: 134, spo2: 84, temp: 36.0 }, hospitalId: 'H-01', assessedByStaffId: 'S-01', assessedAt: '10:35 AM', status: 'Critical' },
  { id: 'TRG-018', patientId: 'P-1064', triage: 'Green', vitals: { bp: '118/74', pulse: 82, spo2: 98, temp: 36.9 }, hospitalId: 'H-02', assessedByStaffId: 'S-08', assessedAt: '09:07 AM', status: 'Discharged' },
  { id: 'TRG-019', patientId: 'P-1068', triage: 'Orange', vitals: { bp: '140/90', pulse: 102, spo2: 94, temp: 37.6 }, hospitalId: 'H-03', assessedByStaffId: 'S-04', assessedAt: '10:39 AM', status: 'In Treatment' },
  { id: 'TRG-020', patientId: 'P-1073', triage: 'Red', vitals: { bp: '70/44', pulse: 140, spo2: 78, temp: 35.6 }, hospitalId: 'H-04', assessedByStaffId: 'S-05', assessedAt: '08:57 AM', status: 'Critical' },
  { id: 'TRG-021', patientId: 'P-1077', triage: 'Yellow', vitals: { bp: '126/82', pulse: 89, spo2: 96, temp: 37.1 }, hospitalId: 'H-05', assessedByStaffId: 'S-06', assessedAt: '10:42 AM', status: 'In Treatment' },
  { id: 'TRG-022', patientId: 'P-1082', triage: 'Green', vitals: { bp: '120/76', pulse: 80, spo2: 98, temp: 36.8 }, hospitalId: 'H-02', assessedByStaffId: 'S-08', assessedAt: '10:47 AM', status: 'Stabilized' },
  { id: 'TRG-023', patientId: 'P-1085', triage: 'Orange', vitals: { bp: '134/88', pulse: 99, spo2: 95, temp: 37.4 }, hospitalId: 'H-01', assessedByStaffId: 'S-02', assessedAt: '10:50 AM', status: 'In Treatment' },
  { id: 'TRG-024', patientId: 'P-1091', triage: 'Yellow', vitals: { bp: '122/78', pulse: 87, spo2: 97, temp: 37.0 }, hospitalId: 'H-01', assessedByStaffId: 'S-10', assessedAt: '10:52 AM', status: 'In Treatment' },
  { id: 'TRG-025', patientId: 'P-1094', triage: 'Yellow', vitals: { bp: '124/80', pulse: 91, spo2: 96, temp: 38.2 }, hospitalId: 'H-01', assessedByStaffId: 'S-01', assessedAt: '2025-05-13 11:24 AM', status: 'Discharged' },
  { id: 'TRG-026', patientId: 'P-1097', triage: 'Orange', vitals: { bp: '138/90', pulse: 105, spo2: 94, temp: 39.0 }, hospitalId: 'H-02', assessedByStaffId: 'S-03', assessedAt: '2025-05-14 09:19 AM', status: 'Discharged' },
]

export const TREATMENTS: Treatment[] = [
  { id: 'TR-2041', patientId: 'P-1024', date: '28 Sep 2026 10:31', description: 'Emergency stabilization', medication: 'IV fluids', staffId: 'S-01', hospitalId: 'H-01' },
  { id: 'TR-2042', patientId: 'P-1061', date: '28 Sep 2026 10:40', description: 'Airway management and oxygen support', medication: 'Oxygen therapy', staffId: 'S-02', hospitalId: 'H-01' },
  { id: 'TR-2043', patientId: 'P-1033', date: '28 Sep 2026 10:10', description: 'Fracture immobilization', medication: 'Analgesics', staffId: 'S-02', hospitalId: 'H-01' },
  { id: 'TR-2044', patientId: 'P-1012', date: '28 Sep 2026 09:40', description: 'Hemorrhage control', medication: 'IV fluids, Tranexamic acid', staffId: 'S-03', hospitalId: 'H-02' },
  { id: 'TR-2045', patientId: 'P-1041', date: '28 Sep 2026 10:18', description: 'Cardiac monitoring and stabilization', medication: 'Aspirin, Oxygen', staffId: 'S-03', hospitalId: 'H-02' },
  { id: 'TR-2046', patientId: 'P-1017', date: '28 Sep 2026 09:52', description: 'Spinal precaution and stabilization', medication: 'IV fluids', staffId: 'S-04', hospitalId: 'H-03' },
  { id: 'TR-2047', patientId: 'P-1068', date: '28 Sep 2026 10:44', description: 'Wound cleaning and dressing', medication: 'Antibiotics', staffId: 'S-04', hospitalId: 'H-03' },
  { id: 'TR-2048', patientId: 'P-1048', date: '28 Sep 2026 10:26', description: 'Smoke and floodwater inhalation management', medication: 'Oxygen therapy, Bronchodilators', staffId: 'S-05', hospitalId: 'H-04' },
  { id: 'TR-2049', patientId: 'P-1028', date: '28 Sep 2026 10:05', description: 'Minor laceration repair', medication: 'Antiseptic dressing', staffId: 'S-05', hospitalId: 'H-04' },
  { id: 'TR-2050', patientId: 'P-1057', date: '28 Sep 2026 10:32', description: 'Observation for dehydration', medication: 'Oral rehydration salts', staffId: 'S-06', hospitalId: 'H-05' },
  { id: 'TR-2051', patientId: 'P-1037', date: '28 Sep 2026 10:12', description: 'General checkup and observation', medication: 'None required', staffId: 'S-06', hospitalId: 'H-05' },
  { id: 'TR-2052', patientId: 'P-1073', date: '28 Sep 2026 09:00', description: 'Resuscitation attempted', medication: 'Epinephrine', staffId: 'S-02', hospitalId: 'H-04' },
]

export const SUPPLIES: Supply[] = [
  { id: 'SUP-01', item: 'Oxygen Cylinders', category: 'Oxygen', quantity: 18, unit: 'cylinders', hospitalId: 'H-01', expiry: '—', stockStatus: 'CRITICAL' },
  { id: 'SUP-02', item: 'O- Blood Units', category: 'Blood', quantity: 12, unit: 'units', hospitalId: 'H-02', expiry: '2026-10-05', stockStatus: 'LOW STOCK' },
  { id: 'SUP-03', item: 'IV Fluids (Normal Saline)', category: 'Medicine', quantity: 340, unit: 'bottles', hospitalId: 'H-01', expiry: '2027-03-01', stockStatus: 'NORMAL' },
  { id: 'SUP-04', item: 'Paracetamol 500mg', category: 'Medicine', quantity: 25, unit: 'strips', hospitalId: 'H-03', expiry: '2026-12-15', stockStatus: 'LOW STOCK' },
  { id: 'SUP-05', item: 'Surgical Masks', category: 'Equipment', quantity: 1200, unit: 'pcs', hospitalId: 'H-01', expiry: '—', stockStatus: 'NORMAL' },
  { id: 'SUP-06', item: 'Ventilators', category: 'Equipment', quantity: 3, unit: 'units', hospitalId: 'H-04', expiry: '—', stockStatus: 'CRITICAL' },
  { id: 'SUP-07', item: 'A+ Blood Units', category: 'Blood', quantity: 40, unit: 'units', hospitalId: 'H-01', expiry: '2026-10-20', stockStatus: 'NORMAL' },
  { id: 'SUP-08', item: 'O+ Blood Units', category: 'Blood', quantity: 15, unit: 'units', hospitalId: 'H-03', expiry: '2026-10-08', stockStatus: 'LOW STOCK' },
  { id: 'SUP-09', item: 'Oxygen Concentrators', category: 'Oxygen', quantity: 22, unit: 'units', hospitalId: 'H-02', expiry: '—', stockStatus: 'NORMAL' },
  { id: 'SUP-10', item: 'Oxygen Cylinders', category: 'Oxygen', quantity: 45, unit: 'cylinders', hospitalId: 'H-03', expiry: '—', stockStatus: 'NORMAL' },
  { id: 'SUP-11', item: 'Antibiotics (Ceftriaxone)', category: 'Medicine', quantity: 8, unit: 'vials', hospitalId: 'H-04', expiry: '2026-11-02', stockStatus: 'CRITICAL' },
  { id: 'SUP-12', item: 'Bandages & Dressing Kits', category: 'Equipment', quantity: 260, unit: 'kits', hospitalId: 'H-02', expiry: '—', stockStatus: 'NORMAL' },
  { id: 'SUP-13', item: 'IV Cannulas', category: 'Equipment', quantity: 18, unit: 'boxes', hospitalId: 'H-05', expiry: '—', stockStatus: 'LOW STOCK' },
  { id: 'SUP-14', item: 'Tetanus Vaccine', category: 'Medicine', quantity: 60, unit: 'doses', hospitalId: 'H-05', expiry: '2027-01-10', stockStatus: 'NORMAL' },
  { id: 'SUP-15', item: 'Stretchers', category: 'Equipment', quantity: 4, unit: 'units', hospitalId: 'H-05', expiry: '—', stockStatus: 'CRITICAL' },
  { id: 'SUP-16', item: 'AB+ Blood Units', category: 'Blood', quantity: 9, unit: 'units', hospitalId: 'H-04', expiry: '2026-10-12', stockStatus: 'CRITICAL' },
]

export const SHELTERS: Shelter[] = [
  { id: 'SH-01', name: 'Shivaji Relief Shelter', location: 'Pune Central', disasterId: 'D-2026-09', capacity: 500, occupancy: 386, status: 'AVAILABLE' },
  { id: 'SH-02', name: 'Kothrud Community Hall Shelter', location: 'Kothrud', disasterId: 'D-2026-09', capacity: 300, occupancy: 275, status: 'NEAR CAPACITY' },
  { id: 'SH-03', name: 'Hadapsar Sports Complex Shelter', location: 'Hadapsar', disasterId: 'D-2026-09', capacity: 450, occupancy: 200, status: 'AVAILABLE' },
  { id: 'SH-04', name: 'Wanowrie School Relief Camp', location: 'Wanowrie', disasterId: 'D-2026-09', capacity: 250, occupancy: 250, status: 'FULL' },
  { id: 'SH-05', name: 'Camp No. 4 — Sinhagad Road', location: 'Sinhagad Road', disasterId: 'D-2026-09', capacity: 200, occupancy: 140, status: 'AVAILABLE' },
  { id: 'SH-06', name: 'Deccan Gymkhana Relief Shelter', location: 'Deccan', disasterId: 'D-2026-09', capacity: 180, occupancy: 165, status: 'NEAR CAPACITY' },
  { id: 'SH-07', name: 'Yerawada Relief Center', location: 'Yerawada', disasterId: 'D-2026-09', capacity: 220, occupancy: 90, status: 'AVAILABLE' },
  { id: 'SH-08', name: 'Kharadi Riverside Camp', location: 'Kharadi', disasterId: 'D-2026-09', capacity: 160, occupancy: 158, status: 'FULL' },
]

export const VOLUNTEERS: Volunteer[] = [
  { id: 'V-01', name: 'Rahul Verma', role: 'Medical Aid', contact: '+91 90221 11001', status: 'Assigned' },
  { id: 'V-02', name: 'Sneha Kulkarni', role: 'Shelter Support', contact: '+91 90221 11002', status: 'Assigned' },
  { id: 'V-03', name: 'Aditya Rane', role: 'Logistics', contact: '+91 90221 11003', status: 'Assigned' },
  { id: 'V-04', name: 'Pooja Desai', role: 'Coordination', contact: '+91 90221 11004', status: 'Assigned' },
  { id: 'V-05', name: 'Karan Shah', role: 'Medical Aid', contact: '+91 90221 11005', status: 'Assigned' },
  { id: 'V-06', name: 'Ishita Bhatt', role: 'Shelter Support', contact: '+91 90221 11006', status: 'Assigned' },
  { id: 'V-07', name: 'Nikhil Rao', role: 'Logistics', contact: '+91 90221 11007', status: 'Available' },
  { id: 'V-08', name: 'Tanvi Joshi', role: 'Medical Aid', contact: '+91 90221 11008', status: 'Available' },
  { id: 'V-09', name: 'Arjun Mehta', role: 'Coordination', contact: '+91 90221 11009', status: 'Assigned' },
  { id: 'V-10', name: 'Riya Sharma', role: 'Shelter Support', contact: '+91 90221 11010', status: 'Assigned' },
  { id: 'V-11', name: 'Yash Patil', role: 'Logistics', contact: '+91 90221 11011', status: 'Assigned' },
  { id: 'V-12', name: 'Simran Kaur', role: 'Medical Aid', contact: '+91 90221 11012', status: 'Assigned' },
  { id: 'V-13', name: 'Rohit Nair', role: 'Coordination', contact: '+91 90221 11013', status: 'Available' },
  { id: 'V-14', name: 'Ananya Ghosh', role: 'Shelter Support', contact: '+91 90221 11014', status: 'Available' },
  { id: 'V-15', name: 'Vivek Iyer', role: 'Logistics', contact: '+91 90221 11015', status: 'Available' },
  { id: 'V-16', name: 'Meghna Pillai', role: 'Medical Aid', contact: '+91 90221 11016', status: 'Assigned' },
]

export const VOLUNTEER_ASSIGNMENTS: VolunteerAssignment[] = [
  { id: 'VA-01', volunteerId: 'V-01', locationType: 'Hospital', locationId: 'H-01', assignedDate: '28 Sep 2026' },
  { id: 'VA-02', volunteerId: 'V-02', locationType: 'Shelter', locationId: 'SH-01', assignedDate: '28 Sep 2026' },
  { id: 'VA-03', volunteerId: 'V-03', locationType: 'Shelter', locationId: 'SH-02', assignedDate: '28 Sep 2026' },
  { id: 'VA-04', volunteerId: 'V-04', locationType: 'Hospital', locationId: 'H-02', assignedDate: '28 Sep 2026' },
  { id: 'VA-05', volunteerId: 'V-05', locationType: 'Hospital', locationId: 'H-03', assignedDate: '28 Sep 2026' },
  { id: 'VA-06', volunteerId: 'V-06', locationType: 'Shelter', locationId: 'SH-04', assignedDate: '28 Sep 2026' },
  { id: 'VA-07', volunteerId: 'V-09', locationType: 'Shelter', locationId: 'SH-01', assignedDate: '28 Sep 2026' },
  { id: 'VA-08', volunteerId: 'V-10', locationType: 'Shelter', locationId: 'SH-03', assignedDate: '28 Sep 2026' },
  { id: 'VA-09', volunteerId: 'V-11', locationType: 'Hospital', locationId: 'H-04', assignedDate: '28 Sep 2026' },
  { id: 'VA-10', volunteerId: 'V-12', locationType: 'Hospital', locationId: 'H-05', assignedDate: '28 Sep 2026' },
  { id: 'VA-11', volunteerId: 'V-16', locationType: 'Shelter', locationId: 'SH-06', assignedDate: '28 Sep 2026' },
]

export const TRANSPORT_LOGS: TransportLog[] = [
  { id: 'T-501', patientId: 'P-1024', ambulanceId: 'AMB-001', pickup: 'Flood Relief Zone 3', destination: 'City General Hospital', time: '10:12 AM', status: 'Completed' },
  { id: 'T-502', patientId: 'P-1012', ambulanceId: 'AMB-003', pickup: 'Riverside Colony', destination: 'District Emergency Hospital', time: '09:35 AM', status: 'Completed' },
  { id: 'T-503', patientId: 'P-1017', ambulanceId: 'AMB-005', pickup: 'Camp Flood Zone', destination: 'Pune Civil Hospital', time: '09:48 AM', status: 'Completed' },
  { id: 'T-504', patientId: 'P-1061', ambulanceId: 'AMB-002', pickup: 'Sinhagad Road Relief Camp', destination: 'City General Hospital', time: '10:25 AM', status: 'Completed' },
  { id: 'T-505', patientId: 'P-1041', ambulanceId: 'AMB-004', pickup: 'Kothrud Low-Lying Area', destination: 'District Emergency Hospital', time: '10:05 AM', status: 'Completed' },
  { id: 'T-506', patientId: 'P-1048', ambulanceId: 'AMB-007', pickup: 'Hadapsar Industrial Zone', destination: 'Sahyadri Multispecialty Hospital', time: '10:15 AM', status: 'Completed' },
  { id: 'T-507', patientId: 'P-1033', ambulanceId: 'AMB-006', pickup: 'Camp Flood Zone', destination: 'City General Hospital', time: '09:58 AM', status: 'Completed' },
  { id: 'T-508', patientId: 'P-1068', ambulanceId: 'AMB-009', pickup: 'Wanowrie Relief Camp', destination: 'Pune Civil Hospital', time: '10:30 AM', status: 'Completed' },
  { id: 'T-509', patientId: 'P-1085', ambulanceId: 'AMB-001', pickup: 'Riverbank Colony', destination: 'City General Hospital', time: '10:55 AM', status: 'In Progress' },
  { id: 'T-510', patientId: 'P-1082', ambulanceId: 'AMB-003', pickup: 'Kharadi Flood Pocket', destination: 'District Emergency Hospital', time: '11:02 AM', status: 'In Progress' },
  { id: 'T-511', patientId: 'P-1044', ambulanceId: 'AMB-005', pickup: 'Camp Flood Zone - Sector 4', destination: 'Pune Civil Hospital', time: '11:08 AM', status: 'In Progress' },
  { id: 'T-512', patientId: 'P-1077', ambulanceId: 'AMB-004', pickup: 'District Emergency Hospital', destination: 'Sahyadri Multispecialty Hospital', time: '11:30 AM', status: 'Scheduled' },
]

/** System-wide triage distribution for the active disaster (headline stat, sums to patientCount). */
export const TRIAGE_DISTRIBUTION: Record<'Red' | 'Orange' | 'Yellow' | 'Green', number> = {
  Red: 24,
  Orange: 51,
  Yellow: 97,
  Green: 76,
}

export const ADMISSIONS_TIMELINE: AdmissionPoint[] = [
  { time: '06:00', admissions: 4 },
  { time: '07:00', admissions: 9 },
  { time: '08:00', admissions: 18 },
  { time: '09:00', admissions: 34 },
  { time: '10:00', admissions: 52 },
  { time: '11:00', admissions: 41 },
]

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const getHospital = (id: string) => HOSPITALS.find((h) => h.id === id)
export const getPatient = (id: string) => PATIENTS.find((p) => p.id === id)
export const getStaff = (id: string) => MEDICAL_STAFF.find((s) => s.id === id)
export const getAmbulance = (id: string) => AMBULANCES.find((a) => a.id === id)
export const getDisaster = (id: string) => DISASTERS.find((d) => d.id === id)
export const getShelter = (id: string) => SHELTERS.find((s) => s.id === id)

export const patientTriageRecords = (patientId: string) =>
  TRIAGE_RECORDS.filter((t) => t.patientId === patientId)
export const patientTreatments = (patientId: string) =>
  TREATMENTS.filter((t) => t.patientId === patientId)
export const patientTransportLogs = (patientId: string) =>
  TRANSPORT_LOGS.filter((t) => t.patientId === patientId)

export const hospitalBeds = (hospitalId: string) => BEDS.filter((b) => b.hospitalId === hospitalId)
export const hospitalStaff = (hospitalId: string) => MEDICAL_STAFF.filter((s) => s.hospitalId === hospitalId)
export const hospitalSupplies = (hospitalId: string) => SUPPLIES.filter((s) => s.hospitalId === hospitalId)
export const hospitalAmbulances = (hospitalId: string) => AMBULANCES.filter((a) => a.hospitalId === hospitalId)
export const hospitalPatients = (hospitalId: string) => PATIENTS.filter((p) => p.hospitalId === hospitalId)
