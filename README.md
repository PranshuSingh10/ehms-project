\# Emergency Hospital Management System for Natural Disasters (EHMS)



DBMS mini-project, Group 10, Dept. of Computer Engineering, AY 2026-27.

Team: Pranshu Singh, Rushikesh Bhogan, Rohan Kulkarni, Soham Vidhate.



\## Structure

\- `backend/`: Node + Express + EJS + PostgreSQL. Schema (14 tables), triggers, views and seed data are in `backend/sql/`.

\- `frontend/`: React + TypeScript + Tailwind dashboard that uses the backend API. Based on an initial frontend prototype by Lavya S., extended and wired to the real API for this project.



\## Run

1\. Create a PostgreSQL database `ehms`, then run `backend/sql/schema.sql` followed by `backend/sql/seed.sql`.

2\. Backend: `cd backend`, `npm install`, copy `.env.example` to `.env` and set your own database password, then `npm start` (http://localhost:3000).

3\. Frontend: `cd frontend`, `npm install`, copy `.env.example` to `.env`, then `npm run dev` (http://localhost:5173).



\## Database highlights

3NF design with two deliberate denormalizations kept in sync by triggers (`BED.Status`, `SHELTER.OccupancyCount`); two views (`HOSPITAL\_CAPACITY\_DASHBOARD\_VIEW`, `PATIENT\_TRIAGE\_QUEUE\_VIEW`); bed assignment as a transaction with `SELECT ... FOR UPDATE`.



\## Known limitations

Hospital and shelter capacity are not enforced; ambulance rerouting is future scope; the UI has write forms for patients, beds, triage and volunteer assignment only (the API supports CRUD for the other entities).

