import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader } from '../components/shared/Card'
import { TableWrap } from '../components/shared/Controls'
import { StatusBadge } from '../components/shared/StatusBadge'
import { ambulanceStatusTone } from '../utils/status'
import { Truck } from 'lucide-react'

export default function Ambulances() {
  const { ambulances, transportLogs, getHospital, getPatient } = useAppData()
  const available = ambulances.filter((a) => a.status === 'Available').length
  const onTrip = ambulances.filter((a) => a.status === 'On Trip').length
  const maintenance = ambulances.filter((a) => a.status === 'Maintenance').length
  const activeTransports = transportLogs

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Ambulances</h1>
        <p className="mt-1 text-sm text-navy-500">Fleet status and live patient transport across the response network.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><p className="text-2xl font-bold text-stable-600">{available}</p><p className="text-sm text-navy-500">Available</p></Card>
        <Card><p className="text-2xl font-bold text-brand-600">{onTrip}</p><p className="text-sm text-navy-500">On Trip</p></Card>
        <Card><p className="text-2xl font-bold text-navy-500">{maintenance}</p><p className="text-sm text-navy-500">Maintenance</p></Card>
      </div>

      <Card>
        <SectionHeader title="Fleet Status" icon={<Truck className="h-4 w-4" aria-hidden="true" />} />
        <TableWrap>
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                <th className="py-2 pr-3 font-medium">Ambulance ID</th>
                <th className="py-2 pr-3 font-medium">Vehicle No.</th>
                <th className="py-2 pr-3 font-medium">Driver</th>
                <th className="py-2 pr-3 font-medium">Hospital</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Current Trip</th>
                <th className="py-2 pr-3 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {ambulances.map((a) => (
                <tr key={a.id} className="hover:bg-navy-50">
                  <td className="py-2.5 pr-3 font-mono text-xs text-navy-700">{a.id}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{a.vehicleNo}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{a.driver}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{getHospital(a.hospitalId)?.name}</td>
                  <td className="py-2.5 pr-3">
                    <StatusBadge label={a.status.toUpperCase()} tone={ambulanceStatusTone(a.status)} />
                  </td>
                  <td className="py-2.5 pr-3 text-navy-600">{a.currentTrip ?? '—'}</td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-navy-500">{a.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>

      <Card>
        <SectionHeader title="Transport Records" subtitle="The backend does not record per-trip progress status" />
        <TableWrap>
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                <th className="py-2 pr-3 font-medium">Pickup</th>
                <th className="py-2 pr-3 font-medium">Destination</th>
                <th className="py-2 pr-3 font-medium">Patient</th>
                <th className="py-2 pr-3 font-medium">Ambulance</th>
                <th className="py-2 pr-3 font-medium">Driver</th>
                <th className="py-2 pr-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {activeTransports.map((t) => {
                const ambulance = ambulances.find((a) => a.id === t.ambulanceId)
                return (
                  <tr key={t.id} className="hover:bg-navy-50">
                    <td className="py-2.5 pr-3 text-navy-800">{t.pickup}</td>
                    <td className="py-2.5 pr-3 text-navy-800">{t.destination}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{getPatient(t.patientId)?.name}</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-600">{t.ambulanceId}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{ambulance?.driver}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-navy-500">{t.time}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  )
}
