INSERT INTO "DISASTER_EVENT" ("Type", "Location", "StartDate", "SeverityLevel", "Description")
VALUES
  ('Flood', 'Chennai Coast', '2026-08-18', 'Critical', 'Coastal flooding with mass evacuations and road disruption.'),
  ('Cyclone', 'Visakhapatnam', '2026-08-12', 'High', 'Cyclone response with structural damage and displaced residents.');

INSERT INTO "HOSPITAL" ("Name", "Location", "Capacity", "ContactNumber")
VALUES
  ('Relief General Hospital', 'Central Chennai', 250, '9876543210'),
  ('Harbor Trauma Center', 'North Chennai', 180, '9876543211');

INSERT INTO "SHELTER" ("Location", "Capacity", "DisasterID")
VALUES
  ('Anna Nagar Community Hall', 120, 1),
  ('Marina Relief Camp', 160, 1);

INSERT INTO "PATIENT" ("Name", "Age", "Gender", "Status", "DisasterID", "ShelterID")
VALUES
  ('Aarav Menon', 34, 'Male', 'Admitted', 1, 1),
  ('Diya Sharma', 12, 'Female', 'Admitted', 1, 1),
  ('Rohan Iyer', 47, 'Male', 'Admitted', 1, NULL),
  ('Meera Das', 29, 'Female', 'Transferred', 1, 2),
  ('Kabir Nair', 63, 'Male', 'Admitted', 1, NULL),
  ('Anika Bose', 39, 'Female', 'Discharged', 1, 2),
  ('Ishaan Paul', 21, 'Male', 'Admitted', 1, 1),
  ('Nisha Patel', 56, 'Female', 'Admitted', 2, NULL),
  ('Vikram Rao', 44, 'Male', 'Deceased', 2, NULL),
  ('Sara Khan', 31, 'Female', 'Admitted', 2, NULL);

INSERT INTO "MEDICAL_STAFF" ("Name", "Role", "Specialization", "ContactNumber", "HospitalID")
VALUES
  ('Dr. Kavya Sen', 'Doctor', 'Emergency Medicine', '9000000001', 1),
  ('Dr. Arjun Roy', 'Doctor', 'Trauma Surgery', '9000000002', 1),
  ('Nurse Priya Thomas', 'Nurse', 'Critical Care', '9000000003', 1),
  ('Paramedic Joel Mathew', 'Paramedic', NULL, '9000000004', 1),
  ('Dr. Sneha Reddy', 'Doctor', 'Pulmonology', '9000000005', 2),
  ('Nurse Farah Ali', 'Nurse', 'Emergency Ward', '9000000006', 2),
  ('Paramedic Harsh Vora', 'Paramedic', NULL, '9000000007', 2);

INSERT INTO "BED" ("WardType", "HospitalID", "PatientID")
VALUES
  ('ICU', 1, 1),
  ('Emergency', 1, 2),
  ('General', 1, 3),
  ('General', 1, NULL),
  ('Emergency', 1, 5),
  ('ICU', 2, 8),
  ('General', 2, 10),
  ('Emergency', 2, NULL),
  ('General', 2, NULL),
  ('ICU', 2, NULL);

INSERT INTO "AMBULANCE" ("VehicleNo", "DriverName", "Status", "HospitalID")
VALUES
  ('TN-01-A-1201', 'Ramesh Kumar', 'Available', 1),
  ('TN-01-A-1202', 'Sathish Mani', 'On Trip', 1),
  ('TN-01-B-2251', 'Imran Khan', 'Available', 2),
  ('TN-01-B-2252', 'Joseph Peter', 'Maintenance', 2);

INSERT INTO "SUPPLY" ("ItemName", "Quantity", "Category", "ExpiryDate", "HospitalID")
VALUES
  ('IV Fluids', 45, 'Medicine', '2027-03-01', 1),
  ('Oxygen Cylinders', 18, 'Oxygen', NULL, 1),
  ('Trauma Kits', 12, 'Equipment', NULL, 1),
  ('Packed Red Cells', 10, 'Blood', '2026-09-10', 1),
  ('Ventilator Circuits', 25, 'Equipment', '2026-12-15', 2),
  ('Pain Medication', 14, 'Medicine', '2026-10-05', 2),
  ('Portable Oxygen', 30, 'Oxygen', NULL, 2),
  ('Plasma Units', 8, 'Blood', '2026-09-02', 2);

INSERT INTO "TRIAGE_LEVEL" ("ColorCode", "Description", "PriorityOrder")
VALUES
  ('Red', 'Immediate life-saving intervention required', 1),
  ('Orange', 'Very urgent treatment required', 2),
  ('Yellow', 'Delayed but serious injuries', 3),
  ('Green', 'Minor injuries and walking wounded', 4);

INSERT INTO "TRIAGE_RECORD" ("TriageID", "PatientID", "TriageTime", "VitalSigns", "StaffID", "TriageLevelID")
VALUES
  (1, 1, '2026-08-24 08:10:00', 'BP 90/60, Pulse 120, SpO2 91%', 1, 1),
  (1, 2, '2026-08-24 08:20:00', 'BP 100/65, Pulse 108, SpO2 95%', 3, 2),
  (1, 3, '2026-08-24 08:40:00', 'BP 110/70, Pulse 96, SpO2 97%', 2, 3),
  (1, 5, '2026-08-24 09:05:00', 'BP 88/58, Pulse 126, SpO2 90%', 1, 1),
  (1, 7, '2026-08-24 09:30:00', 'BP 118/76, Pulse 82, SpO2 99%', 4, 4),
  (1, 8, '2026-08-24 10:00:00', 'BP 102/68, Pulse 92, SpO2 96%', 5, 2),
  (1, 10, '2026-08-24 10:25:00', 'BP 114/73, Pulse 88, SpO2 98%', 6, 3),
  (2, 1, '2026-08-25 06:30:00', 'BP 96/62, Pulse 112, SpO2 93%', 2, 2),
  (2, 5, '2026-08-25 06:45:00', 'BP 92/60, Pulse 119, SpO2 92%', 1, 1);

INSERT INTO "TREATMENT" ("TreatmentDate", "Description", "Medication", "PatientID", "StaffID")
VALUES
  ('2026-08-24 11:00:00', 'Fluid resuscitation and wound dressing', 'Ringer Lactate', 1, 1),
  ('2026-08-24 11:15:00', 'Nebulization for respiratory distress', 'Salbutamol', 5, 2),
  ('2026-08-24 12:30:00', 'Fracture stabilization', 'Paracetamol', 3, 2),
  ('2026-08-25 07:15:00', 'Observation and reassessment', NULL, 8, 5);

INSERT INTO "TRANSPORT_LOG" ("PickupLocation", "DropLocation", "Time", "AmbulanceID", "PatientID")
VALUES
  ('Marina Beach Road', 'Relief General Hospital', '2026-08-24 07:40:00', 1, 1),
  ('Washermanpet Relief Point', 'Relief General Hospital', '2026-08-24 08:05:00', 2, 2),
  ('Harbor Evacuation Zone', 'Harbor Trauma Center', '2026-08-24 09:10:00', 3, 8);

INSERT INTO "VOLUNTEER" ("Name", "Role", "ContactNumber")
VALUES
  ('Aditi Verma', 'Shelter Coordinator', '9111111111'),
  ('Rahul Mehta', 'Food Distribution', '9222222222'),
  ('Fatima Noor', 'Patient Escort', '9333333333'),
  ('Kiran Joshi', 'Logistics Support', '9444444444');

INSERT INTO "VOLUNTEER_ASSIGNMENT" ("VolunteerID", "ShelterID", "HospitalID", "AssignedDate")
VALUES
  (1, 1, NULL, '2026-08-24'),
  (2, 2, NULL, '2026-08-24'),
  (3, NULL, 1, '2026-08-25'),
  (4, NULL, 2, '2026-08-25');
