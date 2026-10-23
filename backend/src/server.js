const express = require("express");
const cors = require("cors");
const path = require("path");
const { query, withTransaction } = require("./db");

const app = express();
const port = Number(process.env.PORT || 3000);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(cors({ origin: "http://localhost:5173" }));

app.locals.formatDateOnly = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

app.locals.formatDateTime = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

function parseInteger(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

async function loadCommonData() {
  const [
    disasters,
    hospitals,
    patients,
    shelters,
    staff,
    triageLevels,
    volunteers,
    ambulances
  ] = await Promise.all([
    query('SELECT * FROM "DISASTER_EVENT" ORDER BY "DisasterID" DESC'),
    query('SELECT * FROM "HOSPITAL" ORDER BY "HospitalID"'),
    query('SELECT * FROM "PATIENT" ORDER BY "PatientID" DESC'),
    query('SELECT * FROM "SHELTER" ORDER BY "ShelterID"'),
    query('SELECT * FROM "MEDICAL_STAFF" ORDER BY "StaffID"'),
    query('SELECT * FROM "TRIAGE_LEVEL" ORDER BY "PriorityOrder"'),
    query('SELECT * FROM "VOLUNTEER" ORDER BY "VolunteerID"'),
    query('SELECT * FROM "AMBULANCE" ORDER BY "AmbulanceID"')
  ]);

  return {
    disasters: disasters.rows,
    hospitals: hospitals.rows,
    patients: patients.rows,
    shelters: shelters.rows,
    staff: staff.rows,
    triageLevels: triageLevels.rows,
    volunteers: volunteers.rows,
    ambulances: ambulances.rows
  };
}

app.get(
  "/",
  asyncHandler(async (req, res) => {
    const summary = await query(`
      SELECT
        (SELECT COUNT(*) FROM "DISASTER_EVENT") AS disaster_count,
        (SELECT COUNT(*) FROM "HOSPITAL") AS hospital_count,
        (SELECT COUNT(*) FROM "PATIENT") AS patient_count,
        (SELECT COUNT(*) FROM "SHELTER") AS shelter_count,
        (SELECT COUNT(*) FROM "VOLUNTEER") AS volunteer_count
    `);

    res.render("index", {
      page: "home",
      summary: summary.rows[0]
    });
  })
);

app.get(
  "/disasters",
  asyncHandler(async (req, res) => {
    const disasters = await query(`
      SELECT
        d.*,
        COUNT(DISTINCT p."PatientID") AS patient_count,
        COUNT(DISTINCT s."ShelterID") AS shelter_count
      FROM "DISASTER_EVENT" d
      LEFT JOIN "PATIENT" p ON p."DisasterID" = d."DisasterID"
      LEFT JOIN "SHELTER" s ON s."DisasterID" = d."DisasterID"
      GROUP BY d."DisasterID"
      ORDER BY d."StartDate" DESC, d."DisasterID" DESC
    `);

    res.render("disasters", {
      page: "disasters",
      disasters: disasters.rows
    });
  })
);

app.get(
  "/hospitals",
  asyncHandler(async (req, res) => {
    const hospitals = await query(`
      SELECT
        h.*,
        COUNT(DISTINCT b."BedID") AS total_beds,
        COUNT(DISTINCT CASE WHEN b."Status" = 'Vacant' THEN b."BedID" END) AS vacant_beds,
        COUNT(DISTINCT ms."StaffID") AS staff_count,
        COUNT(DISTINCT a."AmbulanceID") AS ambulance_count
      FROM "HOSPITAL" h
      LEFT JOIN "BED" b ON b."HospitalID" = h."HospitalID"
      LEFT JOIN "MEDICAL_STAFF" ms ON ms."HospitalID" = h."HospitalID"
      LEFT JOIN "AMBULANCE" a ON a."HospitalID" = h."HospitalID"
      GROUP BY h."HospitalID"
      ORDER BY h."HospitalID"
    `);

    res.render("hospitals", {
      page: "hospitals",
      hospitals: hospitals.rows
    });
  })
);

app.get(
  "/patients",
  asyncHandler(async (req, res) => {
    const common = await loadCommonData();
    const triageQueue = await query('SELECT * FROM "PATIENT_TRIAGE_QUEUE_VIEW"');

    res.render("patients", {
      page: "patients",
      ...common,
      triageQueue: triageQueue.rows
    });
  })
);

app.get(
  "/beds",
  asyncHandler(async (req, res) => {
    const common = await loadCommonData();
    const beds = await query(`
      SELECT
        b.*,
        h."Name" AS hospital_name,
        p."Name" AS patient_name
      FROM "BED" b
      JOIN "HOSPITAL" h ON h."HospitalID" = b."HospitalID"
      LEFT JOIN "PATIENT" p ON p."PatientID" = b."PatientID"
      ORDER BY h."Name", b."BedID"
    `);

    res.render("beds", {
      page: "beds",
      ...common,
      beds: beds.rows
    });
  })
);

app.get(
  "/resources",
  asyncHandler(async (req, res) => {
    const common = await loadCommonData();
    const supplies = await query(`
      SELECT
        s.*,
        h."Name" AS hospital_name,
        CASE
          WHEN s."Quantity" < 20 THEN 'Low Stock'
          WHEN s."ExpiryDate" IS NOT NULL AND s."ExpiryDate" <= CURRENT_DATE + INTERVAL '30 day' THEN 'Expiring Soon'
          ELSE 'OK'
        END AS alert_status
      FROM "SUPPLY" s
      JOIN "HOSPITAL" h ON h."HospitalID" = s."HospitalID"
      ORDER BY h."Name", s."ItemName"
    `);

    res.render("resources", {
      page: "resources",
      ...common,
      supplies: supplies.rows
    });
  })
);

app.get(
  "/treatments",
  asyncHandler(async (req, res) => {
    const common = await loadCommonData();
    const treatments = await query(`
      SELECT
        t.*,
        p."Name" AS patient_name,
        ms."Name" AS staff_name
      FROM "TREATMENT" t
      JOIN "PATIENT" p ON p."PatientID" = t."PatientID"
      JOIN "MEDICAL_STAFF" ms ON ms."StaffID" = t."StaffID"
      ORDER BY t."TreatmentDate" DESC
    `);

    res.render("treatments", {
      page: "treatments",
      ...common,
      treatments: treatments.rows
    });
  })
);

app.get(
  "/transport",
  asyncHandler(async (req, res) => {
    const common = await loadCommonData();
    const transportLogs = await query(`
      SELECT
        tl.*,
        a."VehicleNo" AS vehicle_no,
        p."Name" AS patient_name
      FROM "TRANSPORT_LOG" tl
      JOIN "AMBULANCE" a ON a."AmbulanceID" = tl."AmbulanceID"
      JOIN "PATIENT" p ON p."PatientID" = tl."PatientID"
      ORDER BY tl."Time" DESC
    `);

    res.render("transport", {
      page: "transport",
      ...common,
      transportLogs: transportLogs.rows
    });
  })
);

app.get(
  "/shelters",
  asyncHandler(async (req, res) => {
    const common = await loadCommonData();
    const assignments = await query(`
      SELECT
        va.*,
        v."Name" AS volunteer_name,
        s."Location" AS shelter_location,
        h."Name" AS hospital_name
      FROM "VOLUNTEER_ASSIGNMENT" va
      JOIN "VOLUNTEER" v ON v."VolunteerID" = va."VolunteerID"
      LEFT JOIN "SHELTER" s ON s."ShelterID" = va."ShelterID"
      LEFT JOIN "HOSPITAL" h ON h."HospitalID" = va."HospitalID"
      ORDER BY va."AssignedDate" DESC, va."AssignmentID" DESC
    `);

    res.render("shelters", {
      page: "shelters",
      ...common,
      assignments: assignments.rows
    });
  })
);

app.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const [
      hospitalCapacity,
      shelterSummary,
      patientSummary,
      ambulanceSummary,
      disasterSummary
    ] = await Promise.all([
      query('SELECT * FROM "HOSPITAL_CAPACITY_DASHBOARD_VIEW" ORDER BY "HospitalID"'),
      query(`
        SELECT
          s."ShelterID",
          s."Location",
          s."Capacity",
          s."OccupancyCount",
          d."Type" AS disaster_type
        FROM "SHELTER" s
        JOIN "DISASTER_EVENT" d ON d."DisasterID" = s."DisasterID"
        ORDER BY s."ShelterID"
      `),
      query(`
        SELECT
          COUNT(*) AS total_patients,
          COUNT(*) FILTER (WHERE "Status" = 'Admitted') AS admitted_patients,
          COUNT(*) FILTER (WHERE "Status" = 'Discharged') AS discharged_patients,
          COUNT(*) FILTER (WHERE "Status" = 'Transferred') AS transferred_patients
        FROM "PATIENT"
      `),
      query(`
        SELECT
          COUNT(*) FILTER (WHERE "Status" = 'Available') AS available_ambulances,
          COUNT(*) FILTER (WHERE "Status" = 'On Trip') AS on_trip_ambulances,
          COUNT(*) FILTER (WHERE "Status" = 'Maintenance') AS maintenance_ambulances
        FROM "AMBULANCE"
      `),
      query(`
        SELECT
          d."DisasterID",
          d."Type",
          d."Location",
          COUNT(DISTINCT p."PatientID") AS patient_count,
          COUNT(DISTINCT s."ShelterID") AS shelter_count
        FROM "DISASTER_EVENT" d
        LEFT JOIN "PATIENT" p ON p."DisasterID" = d."DisasterID"
        LEFT JOIN "SHELTER" s ON s."DisasterID" = d."DisasterID"
        GROUP BY d."DisasterID"
        ORDER BY d."DisasterID" DESC
      `)
    ]);

    res.render("dashboard", {
      page: "dashboard",
      hospitalCapacity: hospitalCapacity.rows,
      shelterSummary: shelterSummary.rows,
      patientSummary: patientSummary.rows[0],
      ambulanceSummary: ambulanceSummary.rows[0],
      disasterSummary: disasterSummary.rows
    });
  })
);

app.get(
  "/api/disasters",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "DISASTER_EVENT" ORDER BY "DisasterID" DESC');
    res.json(result.rows);
  })
);

app.post(
  "/api/disasters",
  asyncHandler(async (req, res) => {
    const { type, location, startDate, severityLevel, description } = req.body;
    const result = await query(
      `
        INSERT INTO "DISASTER_EVENT" ("Type", "Location", "StartDate", "SeverityLevel", "Description")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [type, location, startDate, severityLevel, description || null]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.put(
  "/api/disasters/:id",
  asyncHandler(async (req, res) => {
    const { type, location, startDate, severityLevel, description } = req.body;
    const result = await query(
      `
        UPDATE "DISASTER_EVENT"
        SET "Type" = $1,
            "Location" = $2,
            "StartDate" = $3,
            "SeverityLevel" = $4,
            "Description" = $5
        WHERE "DisasterID" = $6
        RETURNING *
      `,
      [type, location, startDate, severityLevel, description || null, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Disaster event not found" });
    }

    res.json(result.rows[0]);
  })
);

app.delete(
  "/api/disasters/:id",
  asyncHandler(async (req, res) => {
    const result = await query('DELETE FROM "DISASTER_EVENT" WHERE "DisasterID" = $1 RETURNING *', [req.params.id]);

    if (!result.rowCount) {
      return res.status(404).json({ error: "Disaster event not found" });
    }

    res.json({ deleted: result.rows[0] });
  })
);

app.get(
  "/api/hospitals",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "HOSPITAL" ORDER BY "HospitalID"');
    res.json(result.rows);
  })
);

app.post(
  "/api/hospitals",
  asyncHandler(async (req, res) => {
    const { name, location, capacity, contactNumber } = req.body;
    const result = await query(
      `
        INSERT INTO "HOSPITAL" ("Name", "Location", "Capacity", "ContactNumber")
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [name, location, capacity, contactNumber]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.put(
  "/api/hospitals/:id",
  asyncHandler(async (req, res) => {
    const { name, location, capacity, contactNumber } = req.body;
    const result = await query(
      `
        UPDATE "HOSPITAL"
        SET "Name" = $1,
            "Location" = $2,
            "Capacity" = $3,
            "ContactNumber" = $4
        WHERE "HospitalID" = $5
        RETURNING *
      `,
      [name, location, capacity, contactNumber, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json(result.rows[0]);
  })
);

app.delete(
  "/api/hospitals/:id",
  asyncHandler(async (req, res) => {
    const result = await query('DELETE FROM "HOSPITAL" WHERE "HospitalID" = $1 RETURNING *', [req.params.id]);

    if (!result.rowCount) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json({ deleted: result.rows[0] });
  })
);

app.get(
  "/api/patients",
  asyncHandler(async (req, res) => {
    const result = await query(`
      SELECT
        p.*,
        d."Type" AS disaster_type,
        s."Location" AS shelter_location,
        b."HospitalID" AS hospital_id,
        latest."ColorCode" AS triage_level,
        latest."TriageTime" AS triage_time
      FROM "PATIENT" p
      JOIN "DISASTER_EVENT" d ON d."DisasterID" = p."DisasterID"
      LEFT JOIN "SHELTER" s ON s."ShelterID" = p."ShelterID"
      LEFT JOIN "BED" b ON b."PatientID" = p."PatientID"
      LEFT JOIN LATERAL (
        SELECT tl."ColorCode", tr."TriageTime"
        FROM "TRIAGE_RECORD" tr
        JOIN "TRIAGE_LEVEL" tl ON tl."TriageLevelID" = tr."TriageLevelID"
        WHERE tr."PatientID" = p."PatientID"
        ORDER BY tr."TriageTime" DESC, tr."TriageID" DESC
        LIMIT 1
      ) latest ON TRUE
      ORDER BY p."PatientID" DESC
    `);
    res.json(result.rows);
  })
);

app.post(
  "/api/patients",
  asyncHandler(async (req, res) => {
    const { name, age, gender, status, disasterId, shelterId } = req.body;
    const result = await query(
      `
        INSERT INTO "PATIENT" ("Name", "Age", "Gender", "Status", "DisasterID", "ShelterID")
        VALUES ($1, $2, $3, COALESCE($4, 'Admitted'), $5, $6)
        RETURNING *
      `,
      [name, age, gender, status || null, disasterId, parseInteger(shelterId)]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.put(
  "/api/patients/:id",
  asyncHandler(async (req, res) => {
    const { name, age, gender, status, disasterId, shelterId } = req.body;
    const result = await query(
      `
        UPDATE "PATIENT"
        SET "Name" = $1,
            "Age" = $2,
            "Gender" = $3,
            "Status" = $4,
            "DisasterID" = $5,
            "ShelterID" = $6
        WHERE "PatientID" = $7
        RETURNING *
      `,
      [name, age, gender, status, disasterId, parseInteger(shelterId), req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(result.rows[0]);
  })
);

app.get(
  "/api/triage-levels",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "TRIAGE_LEVEL" ORDER BY "TriageLevelID"');
    res.json(result.rows);
  })
);

app.get(
  "/api/triage-queue",
  asyncHandler(async (req, res) => {
    const result = await query(`
      SELECT q.*, tr."TriageID", tr."VitalSigns", tr."StaffID",
             tl."TriageLevelID", b."HospitalID"
      FROM "PATIENT_TRIAGE_QUEUE_VIEW" q
      JOIN LATERAL (
        SELECT * FROM "TRIAGE_RECORD"
        WHERE "PatientID" = q."PatientID"
        ORDER BY "TriageTime" DESC, "TriageID" DESC
        LIMIT 1
      ) tr ON TRUE
      JOIN "TRIAGE_LEVEL" tl ON tl."TriageLevelID" = tr."TriageLevelID"
      LEFT JOIN "BED" b ON b."PatientID" = q."PatientID"
    `);
    res.json(result.rows);
  })
);

app.get(
  "/api/triage-records",
  asyncHandler(async (req, res) => {
    const result = await query(`
      SELECT
        tr."TriageID",
        tr."PatientID",
        tr."TriageTime",
        tr."VitalSigns",
        tr."StaffID",
        tl."ColorCode",
        tl."TriageLevelID",
        b."HospitalID"
      FROM "TRIAGE_RECORD" tr
      JOIN "TRIAGE_LEVEL" tl ON tl."TriageLevelID" = tr."TriageLevelID"
      LEFT JOIN "BED" b ON b."PatientID" = tr."PatientID"
      ORDER BY tr."TriageTime" DESC, tr."PatientID", tr."TriageID" DESC
    `);
    res.json(result.rows);
  })
);

app.post(
  "/api/triage-records",
  asyncHandler(async (req, res) => {
    const { patientId, triageTime, vitalSigns, staffId, triageLevelId } = req.body;

    const result = await withTransaction(async (client) => {
      const sequence = await client.query(
        'SELECT COALESCE(MAX("TriageID"), 0) + 1 AS next_id FROM "TRIAGE_RECORD" WHERE "PatientID" = $1',
        [patientId]
      );

      return client.query(
        `
          INSERT INTO "TRIAGE_RECORD" ("TriageID", "PatientID", "TriageTime", "VitalSigns", "StaffID", "TriageLevelID")
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `,
        [sequence.rows[0].next_id, patientId, triageTime, vitalSigns || null, staffId, triageLevelId]
      );
    });

    res.status(201).json(result.rows[0]);
  })
);

app.get(
  "/api/beds",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "BED" ORDER BY "HospitalID", "BedID"');
    res.json(result.rows);
  })
);

app.post(
  "/api/beds",
  asyncHandler(async (req, res) => {
    const { wardType, hospitalId, patientId } = req.body;
    const result = await query(
      `
        INSERT INTO "BED" ("WardType", "HospitalID", "PatientID")
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [wardType, hospitalId, parseInteger(patientId)]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.post(
  "/api/beds/:id/assign",
  asyncHandler(async (req, res) => {
    const patientId = parseInteger(req.body.patientId);
    const bedId = parseInteger(req.params.id);

    if (!patientId || !bedId) {
      return res.status(400).json({ error: "A valid patient and bed are required" });
    }

    const assignment = await withTransaction(async (client) => {
      const bedResult = await client.query(
        'SELECT * FROM "BED" WHERE "BedID" = $1 FOR UPDATE',
        [bedId]
      );

      if (!bedResult.rowCount) {
        const error = new Error("Bed not found");
        error.status = 404;
        throw error;
      }

      if (bedResult.rows[0].PatientID || bedResult.rows[0].patientid) {
        const error = new Error("Bed is already occupied");
        error.status = 409;
        throw error;
      }

      const patientResult = await client.query(
        'SELECT "PatientID" FROM "PATIENT" WHERE "PatientID" = $1 FOR UPDATE',
        [patientId]
      );

      if (!patientResult.rowCount) {
        const error = new Error("Patient not found");
        error.status = 404;
        throw error;
      }

      await client.query('UPDATE "BED" SET "PatientID" = NULL WHERE "PatientID" = $1', [patientId]);

      return client.query(
        'UPDATE "BED" SET "PatientID" = $1 WHERE "BedID" = $2 RETURNING *',
        [patientId, bedId]
      );
    });

    res.json(assignment.rows[0]);
  })
);

app.post(
  "/api/beds/:id/release",
  asyncHandler(async (req, res) => {
    const result = await query(
      'UPDATE "BED" SET "PatientID" = NULL WHERE "BedID" = $1 RETURNING *',
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Bed not found" });
    }

    res.json(result.rows[0]);
  })
);

app.get(
  "/api/staff",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "MEDICAL_STAFF" ORDER BY "HospitalID", "StaffID"');
    res.json(result.rows);
  })
);

app.post(
  "/api/staff",
  asyncHandler(async (req, res) => {
    const { name, role, specialization, contactNumber, hospitalId } = req.body;
    const result = await query(
      `
        INSERT INTO "MEDICAL_STAFF" ("Name", "Role", "Specialization", "ContactNumber", "HospitalID")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [name, role, specialization || null, contactNumber, hospitalId]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.get(
  "/api/ambulances",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "AMBULANCE" ORDER BY "HospitalID", "AmbulanceID"');
    res.json(result.rows);
  })
);

app.post(
  "/api/ambulances",
  asyncHandler(async (req, res) => {
    const { vehicleNo, driverName, status, hospitalId } = req.body;
    const result = await query(
      `
        INSERT INTO "AMBULANCE" ("VehicleNo", "DriverName", "Status", "HospitalID")
        VALUES ($1, $2, COALESCE($3, 'Available'), $4)
        RETURNING *
      `,
      [vehicleNo, driverName, status || null, hospitalId]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.get(
  "/api/supplies",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "SUPPLY" ORDER BY "HospitalID", "SupplyID"');
    res.json(result.rows);
  })
);

app.post(
  "/api/supplies",
  asyncHandler(async (req, res) => {
    const { itemName, quantity, category, expiryDate, hospitalId } = req.body;
    const result = await query(
      `
        INSERT INTO "SUPPLY" ("ItemName", "Quantity", "Category", "ExpiryDate", "HospitalID")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [itemName, quantity, category, expiryDate || null, hospitalId]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.get(
  "/api/treatments",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "TREATMENT" ORDER BY "TreatmentDate" DESC');
    res.json(result.rows);
  })
);

app.post(
  "/api/treatments",
  asyncHandler(async (req, res) => {
    const { treatmentDate, description, medication, patientId, staffId } = req.body;
    const result = await query(
      `
        INSERT INTO "TREATMENT" ("TreatmentDate", "Description", "Medication", "PatientID", "StaffID")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [treatmentDate, description || null, medication || null, patientId, staffId]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.get(
  "/api/transport-logs",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "TRANSPORT_LOG" ORDER BY "Time" DESC');
    res.json(result.rows);
  })
);

app.post(
  "/api/transport-logs",
  asyncHandler(async (req, res) => {
    const { pickupLocation, dropLocation, time, ambulanceId, patientId } = req.body;
    const result = await query(
      `
        INSERT INTO "TRANSPORT_LOG" ("PickupLocation", "DropLocation", "Time", "AmbulanceID", "PatientID")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [pickupLocation, dropLocation, time, ambulanceId, patientId]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.get(
  "/api/shelters",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "SHELTER" ORDER BY "ShelterID"');
    res.json(result.rows);
  })
);

app.post(
  "/api/shelters",
  asyncHandler(async (req, res) => {
    const { location, capacity, disasterId } = req.body;
    const result = await query(
      `
        INSERT INTO "SHELTER" ("Location", "Capacity", "DisasterID")
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [location, capacity, disasterId]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.get(
  "/api/volunteers",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "VOLUNTEER" ORDER BY "VolunteerID"');
    res.json(result.rows);
  })
);

app.post(
  "/api/volunteers",
  asyncHandler(async (req, res) => {
    const { name, role, contactNumber } = req.body;
    const result = await query(
      `
        INSERT INTO "VOLUNTEER" ("Name", "Role", "ContactNumber")
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [name, role || null, contactNumber]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.get(
  "/api/volunteer-assignments",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "VOLUNTEER_ASSIGNMENT" ORDER BY "AssignmentID" DESC');
    res.json(result.rows);
  })
);

app.post(
  "/api/volunteer-assignments",
  asyncHandler(async (req, res) => {
    const { volunteerId, shelterId, hospitalId, assignedDate } = req.body;
    const result = await query(
      `
        INSERT INTO "VOLUNTEER_ASSIGNMENT" ("VolunteerID", "ShelterID", "HospitalID", "AssignedDate")
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [volunteerId, parseInteger(shelterId), parseInteger(hospitalId), assignedDate]
    );
    res.status(201).json(result.rows[0]);
  })
);

app.put(
  "/api/volunteer-assignments/:id",
  asyncHandler(async (req, res) => {
    const { volunteerId, shelterId, hospitalId, assignedDate } = req.body;
    const result = await query(
      `
        UPDATE "VOLUNTEER_ASSIGNMENT"
        SET "VolunteerID" = $1,
            "ShelterID" = $2,
            "HospitalID" = $3,
            "AssignedDate" = $4
        WHERE "AssignmentID" = $5
        RETURNING *
      `,
      [volunteerId, parseInteger(shelterId), parseInteger(hospitalId), assignedDate, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Volunteer assignment not found" });
    }

    res.json(result.rows[0]);
  })
);

app.delete(
  "/api/volunteer-assignments/:id",
  asyncHandler(async (req, res) => {
    const result = await query(
      'DELETE FROM "VOLUNTEER_ASSIGNMENT" WHERE "AssignmentID" = $1 RETURNING *',
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Volunteer assignment not found" });
    }

    res.json({ deleted: result.rows[0] });
  })
);

app.get(
  "/api/dashboard/hospitals",
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM "HOSPITAL_CAPACITY_DASHBOARD_VIEW" ORDER BY "HospitalID"');
    res.json(result.rows);
  })
);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Unexpected server error";

  if (status >= 500) {
    console.error(error);
  }

  if (req.path.startsWith("/api/")) {
    return res.status(status).json({ error: message });
  }

  res.status(status).render("error", {
    page: "error",
    error: message
  });
});

app.listen(port, () => {
  console.log(`EHMS server listening on http://localhost:${port}`);
});
