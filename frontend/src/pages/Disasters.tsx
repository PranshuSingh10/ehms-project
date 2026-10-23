import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader } from '../components/shared/Card'
import { SolidBadge, StatusBadge } from '../components/shared/StatusBadge'
import { Button, TableWrap } from '../components/shared/Controls'
import { Drawer } from '../components/shared/Drawer'
import { ProgressBar } from '../components/shared/ProgressBar'
import { TRIAGE_TONE, shelterStatusTone } from '../utils/status'
import type { Disaster } from '../types'
import { Flame } from 'lucide-react'

export default function Disasters() {
  const { disasters, hospitals, shelters, ambulances, patients } = useAppData()
  const [searchParams] = useSearchParams()
  const [viewingId, setViewingId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) setViewingId(id)
  }, [searchParams])

  const viewing = disasters.find((d) => d.id === viewingId)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Disaster Events</h1>
        <p className="mt-1 text-sm text-navy-500">Active and historical disaster events tracked by the response network.</p>
      </div>

      <Card>
        <SectionHeader title="All Events" icon={<Flame className="h-4 w-4" aria-hidden="true" />} />
        <TableWrap>
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                <th className="py-2 pr-3 font-medium">Disaster ID</th>
                <th className="py-2 pr-3 font-medium">Type</th>
                <th className="py-2 pr-3 font-medium">Location</th>
                <th className="py-2 pr-3 font-medium">Start Date</th>
                <th className="py-2 pr-3 font-medium">Severity</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Patients</th>
                <th className="py-2 pr-3 font-medium">Hospitals</th>
                <th className="py-2 pr-3 font-medium">Shelters</th>
                <th className="py-2 pr-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {disasters.map((d) => (
                <tr key={d.id} className="hover:bg-navy-50">
                  <td className="py-2.5 pr-3 font-mono text-xs text-navy-500">{d.id}</td>
                  <td className="py-2.5 pr-3 font-medium text-navy-900">{d.type}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{d.location}</td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-navy-600">
                    {new Date(d.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-2.5 pr-3">
                    <SolidBadge label={d.severity} tone={d.severity === 'CRITICAL' ? 'red' : d.severity === 'HIGH' ? 'orange' : 'yellow'} />
                  </td>
                  <td className="py-2.5 pr-3">
                    <StatusBadge label={d.status} tone={d.status === 'ACTIVE' ? 'red' : d.status === 'MONITORING' ? 'yellow' : 'gray'} />
                  </td>
                  <td className="py-2.5 pr-3 text-navy-600">{d.patientCount}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{d.affectedHospitals}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{d.activeShelters}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <Button variant="ghost" onClick={() => setViewingId(d.id)}>
                      View Disaster
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>

      <Drawer open={!!viewing} onClose={() => setViewingId(null)} title={viewing?.name ?? ''} subtitle={viewing?.location}>
        {viewing && <DisasterDetail disaster={viewing} hospitals={hospitals} shelters={shelters} ambulances={ambulances} patients={patients} />}
      </Drawer>
    </div>
  )
}

function DisasterDetail({ disaster, hospitals: allHospitals, shelters: allShelters, ambulances, patients }: { disaster: Disaster; hospitals: import('../types').Hospital[]; shelters: import('../types').Shelter[]; ambulances: import('../types').Ambulance[]; patients: import('../types').Patient[] }) {
  const hospitals = allHospitals.filter((h) => h.disasterIds.includes(disaster.id))
  const shelters = allShelters.filter((s) => s.disasterId === disaster.id)
  const triageDistribution = Object.fromEntries((['Red', 'Orange', 'Yellow', 'Green'] as const).map((level) => [level, patients.filter((p) => p.disasterId === disaster.id && p.triage === level).length])) as Record<'Red' | 'Orange' | 'Yellow' | 'Green', number>
  const enRoute = ambulances.filter((a) => a.status === 'On Trip').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <SolidBadge label={disaster.severity} tone="red" />
        <StatusBadge label={disaster.status} tone={disaster.status === 'ACTIVE' ? 'red' : 'gray'} />
      </div>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-navy-900">Incident Summary</h3>
        <p className="text-sm leading-relaxed text-navy-600">{disaster.description}</p>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-navy-400">Patients</dt>
            <dd className="font-semibold text-navy-900">{disaster.patientCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-navy-400">Critical</dt>
            <dd className="font-semibold text-critical-600">{disaster.criticalPatientCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-navy-400">Hospitals</dt>
            <dd className="font-semibold text-navy-900">{disaster.affectedHospitals}</dd>
          </div>
        </dl>
      </section>

      {(
        <>
          <section>
            <h3 className="mb-2 text-sm font-semibold text-navy-900">Triage Distribution</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(triageDistribution) as Array<keyof typeof triageDistribution>).map((level) => (
                <StatusBadge key={level} label={`${level}: ${triageDistribution[level]}`} tone={TRIAGE_TONE[level]} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-navy-900">Affected Hospitals</h3>
            <ul className="flex flex-col gap-2">
              {hospitals.map((h) => (
                <li key={h.id} className="rounded-lg border border-navy-200 p-2.5 text-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium text-navy-900">{h.name}</span>
                    <span className="text-xs text-navy-500">{h.available} beds available</span>
                  </div>
                  <ProgressBar ratio={h.occupied / h.totalCapacity} tone={h.occupied / h.totalCapacity >= 0.95 ? 'red' : 'orange'} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-navy-900">Shelter Status</h3>
            <ul className="flex flex-col gap-2">
              {shelters.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border border-navy-200 p-2.5 text-sm">
                  <span className="text-navy-800">{s.name}</span>
                  <StatusBadge label={s.status} tone={shelterStatusTone(s.status)} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-navy-900">Ambulance Activity</h3>
            <p className="text-sm text-navy-600">{enRoute} ambulances currently en route across the response network.</p>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-navy-900">Resource Availability</h3>
            <p className="text-sm text-navy-600">
              {hospitals.reduce((sum, h) => sum + h.available, 0)} beds and{' '}
              {ambulances.filter((a) => a.status === 'Available').length} ambulances currently available.
            </p>
          </section>
        </>
      )}
    </div>
  )
}
