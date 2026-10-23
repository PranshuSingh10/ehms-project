import { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader, EmptyState } from '../components/shared/Card'
import { FilterSelect, TableWrap } from '../components/shared/Controls'
import { StatusBadge } from '../components/shared/StatusBadge'
import type { TransportStatus } from '../types'
import { Route } from 'lucide-react'

const DATE_OPTIONS = [{ value: 'all', label: 'All Dates' }]

export default function TransportLogs() {
  const [hospitalFilter, setHospitalFilter] = useState('all')
  const [ambulanceFilter, setAmbulanceFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const { transportLogs, hospitals, ambulances, getPatient, getAmbulance } = useAppData()

  const filtered = useMemo(() => {
    return transportLogs.filter((t) => {
      if (hospitalFilter !== 'all' && !hospitals.some((h) => h.id === hospitalFilter && t.destination === h.name)) return false
      if (ambulanceFilter !== 'all' && t.ambulanceId !== ambulanceFilter) return false
      if (statusFilter !== 'all' && t.status !== (statusFilter as TransportStatus)) return false
      if (dateFilter !== 'all') {
        // all mock transport logs occur on the active disaster date; filter is a pass-through for that date.
        return true
      }
      return true
    })
  }, [transportLogs, hospitals, hospitalFilter, ambulanceFilter, dateFilter, statusFilter])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Transport Logs</h1>
        <p className="mt-1 text-sm text-navy-500">Full patient transport history across the ambulance fleet.</p>
      </div>

      <Card>
        <SectionHeader title="Transport History" icon={<Route className="h-4 w-4" aria-hidden="true" />} />
        <div className="mb-4 flex flex-wrap gap-3">
          <FilterSelect
            label="Hospital"
            value={hospitalFilter}
            onChange={setHospitalFilter}
            options={[{ value: 'all', label: 'All Hospitals' }, ...hospitals.map((h) => ({ value: h.id, label: h.name }))]}
          />
          <FilterSelect
            label="Ambulance"
            value={ambulanceFilter}
            onChange={setAmbulanceFilter}
            options={[{ value: 'all', label: 'All Ambulances' }, ...ambulances.map((a) => ({ value: a.id, label: a.id }))]}
          />
          <FilterSelect label="Date" value={dateFilter} onChange={setDateFilter} options={DATE_OPTIONS} />
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Completed', label: 'Completed' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Unknown', label: 'Status not recorded' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No transport logs match your filters." />
        ) : (
          <TableWrap>
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                  <th className="py-2 pr-3 font-medium">Transport ID</th>
                  <th className="py-2 pr-3 font-medium">Patient</th>
                  <th className="py-2 pr-3 font-medium">Ambulance</th>
                  <th className="py-2 pr-3 font-medium">Pickup</th>
                  <th className="py-2 pr-3 font-medium">Destination</th>
                  <th className="py-2 pr-3 font-medium">Time</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-navy-50">
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-700">{t.id}</td>
                    <td className="py-2.5 pr-3 font-medium text-navy-900">
                      {t.patientId} — {getPatient(t.patientId)?.name}
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-600">
                      {t.ambulanceId} · {getAmbulance(t.ambulanceId)?.driver}
                    </td>
                    <td className="py-2.5 pr-3 text-navy-600">{t.pickup}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{t.destination}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-navy-500">{t.time}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge label={t.status} tone={t.status === 'Completed' ? 'green' : t.status === 'In Progress' ? 'blue' : 'yellow'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>
    </div>
  )
}
