import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ToastProvider } from './context/ToastContext'
import { AppDataProvider } from './context/AppDataContext'
import Dashboard from './pages/Dashboard'
import Disasters from './pages/Disasters'
import Patients from './pages/Patients'
import Triage from './pages/Triage'
import Hospitals from './pages/Hospitals'
import Ambulances from './pages/Ambulances'
import MedicalStaff from './pages/MedicalStaff'
import Supplies from './pages/Supplies'
import Shelters from './pages/Shelters'
import Volunteers from './pages/Volunteers'
import Treatments from './pages/Treatments'
import TransportLogs from './pages/TransportLogs'

export default function App() {
  return (
    <ToastProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="disasters" element={<Disasters />} />
              <Route path="patients" element={<Patients />} />
              <Route path="triage" element={<Triage />} />
              <Route path="hospitals" element={<Hospitals />} />
              <Route path="ambulances" element={<Ambulances />} />
              <Route path="medical-staff" element={<MedicalStaff />} />
              <Route path="supplies" element={<Supplies />} />
              <Route path="shelters" element={<Shelters />} />
              <Route path="volunteers" element={<Volunteers />} />
              <Route path="treatments" element={<Treatments />} />
              <Route path="transport-logs" element={<TransportLogs />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </ToastProvider>
  )
}
