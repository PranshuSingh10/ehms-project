\# EHMS Frontend



React frontend for the Emergency Hospital Management System for Natural Disasters (DBMS mini-project, Group 10). It talks to the Express + PostgreSQL backend in the /backend inside repo.



\## Stack

Vite, React, TypeScript, Tailwind CSS, Recharts.



\## Run locally



1\. Start PostgreSQL and the backend first (see the `ehms-backend` README). The backend must be running on http://localhost:3000.

2\. In this folder:

```

&#x20;  npm install

&#x20;  copy .env.example .env

&#x20;  npm run dev

```

&#x20;  `.env` only needs `VITE\_API\_BASE\_URL=http://localhost:3000/api`.

3\. Open http://localhost:5173.



Production build: `npm run build`.



\## What the UI does



Connected to the backend API:

\- Overview dashboard: hospital capacity from `HOSPITAL\_CAPACITY\_DASHBOARD\_VIEW` (beds, staff, ambulances, low stock), triage distribution, critical patient queue scoped to the selected disaster.

\- Patients: register a new patient, view details.

\- Triage: new assessment form (triage level loaded from the `TRIAGE\_LEVEL` lookup table), triage queue from `PATIENT\_TRIAGE\_QUEUE\_VIEW`.

\- Hospitals and Beds: add a bed, assign a patient to a vacant bed, release a bed. Bed status is kept in sync by a database trigger, and assignment runs inside a transaction.

\- Volunteers: assign to a shelter or hospital.



Read-only in the UI (the backend API supports create/update/delete for these): disasters, hospitals, ambulances, medical staff, supplies, shelters, treatments, transport logs.



\## Known limitations

\- Hospital and shelter capacity limits are not enforced by the database.

\- Ambulance rerouting is not implemented (future scope).

\- Only patients, beds, triage and volunteer assignment have write forms.

