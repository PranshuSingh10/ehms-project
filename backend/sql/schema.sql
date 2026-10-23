DROP VIEW IF EXISTS "PATIENT_TRIAGE_QUEUE_VIEW";
DROP VIEW IF EXISTS "HOSPITAL_CAPACITY_DASHBOARD_VIEW";

DROP TABLE IF EXISTS "VOLUNTEER_ASSIGNMENT" CASCADE;
DROP TABLE IF EXISTS "TRANSPORT_LOG" CASCADE;
DROP TABLE IF EXISTS "TREATMENT" CASCADE;
DROP TABLE IF EXISTS "TRIAGE_RECORD" CASCADE;
DROP TABLE IF EXISTS "TRIAGE_LEVEL" CASCADE;
DROP TABLE IF EXISTS "SUPPLY" CASCADE;
DROP TABLE IF EXISTS "AMBULANCE" CASCADE;
DROP TABLE IF EXISTS "BED" CASCADE;
DROP TABLE IF EXISTS "MEDICAL_STAFF" CASCADE;
DROP TABLE IF EXISTS "VOLUNTEER" CASCADE;
DROP TABLE IF EXISTS "PATIENT" CASCADE;
DROP TABLE IF EXISTS "SHELTER" CASCADE;
DROP TABLE IF EXISTS "HOSPITAL" CASCADE;
DROP TABLE IF EXISTS "DISASTER_EVENT" CASCADE;

CREATE TABLE "DISASTER_EVENT" (
  "DisasterID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Type" VARCHAR(50) NOT NULL,
  "Location" VARCHAR(150) NOT NULL,
  "StartDate" DATE NOT NULL,
  "SeverityLevel" VARCHAR(20) NOT NULL CHECK ("SeverityLevel" IN ('Low', 'Moderate', 'High', 'Critical')),
  "Description" TEXT
);

CREATE TABLE "HOSPITAL" (
  "HospitalID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Name" VARCHAR(100) NOT NULL,
  "Location" VARCHAR(150) NOT NULL,
  "Capacity" INT NOT NULL CHECK ("Capacity" >= 0),
  "ContactNumber" VARCHAR(15) NOT NULL
);

CREATE TABLE "SHELTER" (
  "ShelterID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Location" VARCHAR(150) NOT NULL,
  "Capacity" INT NOT NULL CHECK ("Capacity" >= 0),
  "OccupancyCount" INT DEFAULT 0 CHECK ("OccupancyCount" >= 0),
  "DisasterID" INT NOT NULL REFERENCES "DISASTER_EVENT" ("DisasterID") ON DELETE CASCADE
);

CREATE TABLE "PATIENT" (
  "PatientID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Name" VARCHAR(100) NOT NULL,
  "Age" INT NOT NULL CHECK ("Age" >= 0),
  "Gender" VARCHAR(10) NOT NULL,
  "Status" VARCHAR(20) DEFAULT 'Admitted' CHECK ("Status" IN ('Admitted', 'Discharged', 'Deceased', 'Transferred')),
  "DisasterID" INT NOT NULL REFERENCES "DISASTER_EVENT" ("DisasterID") ON DELETE CASCADE,
  "ShelterID" INT REFERENCES "SHELTER" ("ShelterID") ON DELETE SET NULL
);

CREATE TABLE "MEDICAL_STAFF" (
  "StaffID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Name" VARCHAR(100) NOT NULL,
  "Role" VARCHAR(30) NOT NULL CHECK ("Role" IN ('Doctor', 'Nurse', 'Paramedic')),
  "Specialization" VARCHAR(50),
  "ContactNumber" VARCHAR(15) NOT NULL,
  "HospitalID" INT NOT NULL REFERENCES "HOSPITAL" ("HospitalID") ON DELETE RESTRICT
);

CREATE TABLE "BED" (
  "BedID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "WardType" VARCHAR(30) NOT NULL CHECK ("WardType" IN ('ICU', 'General', 'Emergency')),
  "Status" VARCHAR(20) DEFAULT 'Vacant' CHECK ("Status" IN ('Occupied', 'Vacant')),
  "HospitalID" INT NOT NULL REFERENCES "HOSPITAL" ("HospitalID") ON DELETE RESTRICT,
  "PatientID" INT UNIQUE REFERENCES "PATIENT" ("PatientID") ON DELETE SET NULL
);

CREATE TABLE "AMBULANCE" (
  "AmbulanceID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "VehicleNo" VARCHAR(20) UNIQUE NOT NULL,
  "DriverName" VARCHAR(100) NOT NULL,
  "Status" VARCHAR(20) DEFAULT 'Available' CHECK ("Status" IN ('Available', 'On Trip', 'Maintenance')),
  "HospitalID" INT NOT NULL REFERENCES "HOSPITAL" ("HospitalID") ON DELETE RESTRICT
);

CREATE TABLE "SUPPLY" (
  "SupplyID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "ItemName" VARCHAR(100) NOT NULL,
  "Quantity" INT NOT NULL CHECK ("Quantity" >= 0),
  "Category" VARCHAR(50) NOT NULL CHECK ("Category" IN ('Medicine', 'Oxygen', 'Blood', 'Equipment')),
  "ExpiryDate" DATE,
  "HospitalID" INT NOT NULL REFERENCES "HOSPITAL" ("HospitalID") ON DELETE RESTRICT
);

CREATE TABLE "TRIAGE_LEVEL" (
  "TriageLevelID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "ColorCode" VARCHAR(10) UNIQUE NOT NULL CHECK ("ColorCode" IN ('Green', 'Yellow', 'Orange', 'Red')),
  "Description" VARCHAR(100) NOT NULL,
  "PriorityOrder" INT NOT NULL UNIQUE CHECK ("PriorityOrder" >= 1)
);

CREATE TABLE "TRIAGE_RECORD" (
  "TriageID" INT NOT NULL,
  "PatientID" INT NOT NULL,
  "TriageTime" TIMESTAMP NOT NULL,
  "VitalSigns" TEXT,
  "StaffID" INT NOT NULL REFERENCES "MEDICAL_STAFF" ("StaffID") ON DELETE RESTRICT,
  "TriageLevelID" INT NOT NULL REFERENCES "TRIAGE_LEVEL" ("TriageLevelID") ON DELETE RESTRICT,
  PRIMARY KEY ("PatientID", "TriageID"),
  FOREIGN KEY ("PatientID") REFERENCES "PATIENT" ("PatientID") ON DELETE CASCADE
);

CREATE TABLE "TREATMENT" (
  "TreatmentID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "TreatmentDate" TIMESTAMP NOT NULL,
  "Description" TEXT,
  "Medication" VARCHAR(150),
  "PatientID" INT NOT NULL REFERENCES "PATIENT" ("PatientID") ON DELETE CASCADE,
  "StaffID" INT NOT NULL REFERENCES "MEDICAL_STAFF" ("StaffID") ON DELETE RESTRICT
);

CREATE TABLE "TRANSPORT_LOG" (
  "TransportID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "PickupLocation" VARCHAR(150) NOT NULL,
  "DropLocation" VARCHAR(150) NOT NULL,
  "Time" TIMESTAMP NOT NULL,
  "AmbulanceID" INT NOT NULL REFERENCES "AMBULANCE" ("AmbulanceID") ON DELETE RESTRICT,
  "PatientID" INT NOT NULL REFERENCES "PATIENT" ("PatientID") ON DELETE CASCADE
);

CREATE TABLE "VOLUNTEER" (
  "VolunteerID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Name" VARCHAR(100) NOT NULL,
  "Role" VARCHAR(50),
  "ContactNumber" VARCHAR(15) NOT NULL
);

CREATE TABLE "VOLUNTEER_ASSIGNMENT" (
  "AssignmentID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "VolunteerID" INT NOT NULL REFERENCES "VOLUNTEER" ("VolunteerID") ON DELETE CASCADE,
  "ShelterID" INT REFERENCES "SHELTER" ("ShelterID") ON DELETE RESTRICT,
  "HospitalID" INT REFERENCES "HOSPITAL" ("HospitalID") ON DELETE RESTRICT,
  "AssignedDate" DATE NOT NULL,
  CHECK (
    (CASE WHEN "ShelterID" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN "HospitalID" IS NULL THEN 0 ELSE 1 END) = 1
  )
);

CREATE OR REPLACE FUNCTION sync_bed_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."PatientID" IS NULL THEN
    NEW."Status" := 'Vacant';
  ELSE
    NEW."Status" := 'Occupied';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bed_status_sync_trigger
BEFORE INSERT OR UPDATE OF "PatientID" ON "BED"
FOR EACH ROW
EXECUTE FUNCTION sync_bed_status();

CREATE OR REPLACE FUNCTION sync_shelter_occupancy()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW."ShelterID" IS NOT NULL THEN
      UPDATE "SHELTER"
      SET "OccupancyCount" = "OccupancyCount" + 1
      WHERE "ShelterID" = NEW."ShelterID";
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD."ShelterID" IS DISTINCT FROM NEW."ShelterID" THEN
      IF OLD."ShelterID" IS NOT NULL THEN
        UPDATE "SHELTER"
        SET "OccupancyCount" = GREATEST("OccupancyCount" - 1, 0)
        WHERE "ShelterID" = OLD."ShelterID";
      END IF;

      IF NEW."ShelterID" IS NOT NULL THEN
        UPDATE "SHELTER"
        SET "OccupancyCount" = "OccupancyCount" + 1
        WHERE "ShelterID" = NEW."ShelterID";
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD."ShelterID" IS NOT NULL THEN
      UPDATE "SHELTER"
      SET "OccupancyCount" = GREATEST("OccupancyCount" - 1, 0)
      WHERE "ShelterID" = OLD."ShelterID";
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shelter_occupancy_sync_trigger
AFTER INSERT OR UPDATE OF "ShelterID" OR DELETE ON "PATIENT"
FOR EACH ROW
EXECUTE FUNCTION sync_shelter_occupancy();

CREATE VIEW "HOSPITAL_CAPACITY_DASHBOARD_VIEW" AS
SELECT
  h."HospitalID",
  h."Name" AS "HospitalName",
  h."Location",
  h."Capacity",
  COUNT(DISTINCT b."BedID") AS "TotalBeds",
  COUNT(DISTINCT CASE WHEN b."Status" = 'Vacant' THEN b."BedID" END) AS "VacantBeds",
  COUNT(DISTINCT ms."StaffID") AS "StaffOnDuty",
  COUNT(DISTINCT CASE WHEN a."Status" = 'Available' THEN a."AmbulanceID" END) AS "AmbulancesAvailable",
  COALESCE(
    STRING_AGG(
      DISTINCT CASE
        WHEN s."Quantity" < 20 THEN s."ItemName" || ' (' || s."Quantity" || ')'
        ELSE NULL
      END,
      ', '
    ),
    'None'
  ) AS "LowStockItems"
FROM "HOSPITAL" h
LEFT JOIN "BED" b ON b."HospitalID" = h."HospitalID"
LEFT JOIN "MEDICAL_STAFF" ms ON ms."HospitalID" = h."HospitalID"
LEFT JOIN "AMBULANCE" a ON a."HospitalID" = h."HospitalID"
LEFT JOIN "SUPPLY" s ON s."HospitalID" = h."HospitalID"
GROUP BY h."HospitalID", h."Name", h."Location", h."Capacity";

CREATE VIEW "PATIENT_TRIAGE_QUEUE_VIEW" AS
WITH latest_triage AS (
  SELECT DISTINCT ON (tr."PatientID")
    tr."PatientID",
    tr."TriageID",
    tr."TriageTime",
    tr."VitalSigns",
    tr."StaffID",
    tr."TriageLevelID"
  FROM "TRIAGE_RECORD" tr
  ORDER BY tr."PatientID", tr."TriageTime" DESC, tr."TriageID" DESC
)
SELECT
  p."PatientID",
  p."Name" AS "PatientName",
  p."Status",
  tl."ColorCode",
  tl."Description" AS "TriageDescription",
  tl."PriorityOrder",
  lt."TriageTime",
  JUSTIFY_INTERVAL(AGE(NOW(), lt."TriageTime"))::TEXT AS "TimeSinceLastAssessment"
FROM "PATIENT" p
JOIN latest_triage lt ON lt."PatientID" = p."PatientID"
JOIN "TRIAGE_LEVEL" tl ON tl."TriageLevelID" = lt."TriageLevelID"
WHERE p."Status" = 'Admitted'
ORDER BY tl."PriorityOrder", lt."TriageTime" ASC;
