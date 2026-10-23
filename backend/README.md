# Emergency Hospital Management System for Natural Disasters

EHMS is a full-stack DBMS mini-project for coordinating disaster events, hospital operations, patient triage, bed allocation, transport, shelters, supplies, and volunteers from one PostgreSQL-backed dashboard.

## Stack

- PostgreSQL for the normalized schema, views, triggers, and transactional bed assignment flow
- Node.js + Express for the REST API and server
- EJS + vanilla CSS for the dashboard-style frontend
- `pg` for direct SQL access

## Project structure

```text
.
|-- package.json
|-- public/
|-- sql/
|   |-- schema.sql
|   `-- seed.sql
|-- src/
|   |-- db.js
|   `-- server.js
`-- views/
```

## Setup

1. Create a PostgreSQL database, for example `ehms`.
2. Copy `.env.example` to `.env` and update `DATABASE_URL`.
3. Run the schema:

```sql
\i sql/schema.sql
```

4. Seed the sample data:

```sql
\i sql/seed.sql
```

5. Install dependencies:

```bash
npm install
```

6. Start the app:

```bash
npm start
```

7. Open [http://localhost:3000](http://localhost:3000).

## Key database features

- `BED` status is synchronized by a Postgres trigger, so a bed becomes `Occupied` or `Vacant` automatically based on `PatientID`.
- `SHELTER.OccupancyCount` is maintained by a trigger on `PATIENT`, so shelter occupancy stays consistent even if updates happen outside the app.
- `HOSPITAL_CAPACITY_DASHBOARD_VIEW` aggregates beds, staff, ambulances, and low-stock supplies for admin reporting.
- `PATIENT_TRIAGE_QUEUE_VIEW` exposes the latest admitted-patient triage queue ordered by clinical priority.
- Bed assignment in the API uses a SQL transaction with `SELECT ... FOR UPDATE` to prevent double-booking under concurrent requests.

## REST endpoints

- `GET/POST/PUT/DELETE /api/disasters`
- `GET/POST/PUT/DELETE /api/hospitals`
- `GET/POST/PUT /api/patients`
- `GET /api/triage-queue`
- `POST /api/triage-records`
- `GET/POST /api/beds`
- `POST /api/beds/:id/assign`
- `POST /api/beds/:id/release`
- `GET/POST /api/staff`
- `GET/POST /api/ambulances`
- `GET/POST /api/supplies`
- `GET/POST /api/treatments`
- `GET/POST /api/transport-logs`
- `GET/POST /api/shelters`
- `GET/POST /api/volunteers`
- `GET/POST /api/volunteer-assignments`
- `GET /api/dashboard/hospitals`

## Important schema note

The project brief requires automatic shelter occupancy tracking based on patient-to-shelter movement, but the original `PATIENT` table listing does not include a shelter reference. To make the stated relationship and required occupancy trigger possible, this implementation adds a nullable `ShelterID` foreign key on `PATIENT`.
