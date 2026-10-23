import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader } from '../components/shared/Card'
import { StatusBadge } from '../components/shared/StatusBadge'
import { ProgressBar } from '../components/shared/ProgressBar'
import { shelterStatusTone } from '../utils/status'
import { MapPin, Tent } from 'lucide-react'

export default function Shelters() {
  const { shelters } = useAppData()
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Shelters</h1>
        <p className="mt-1 text-sm text-navy-500">Relief shelter capacity and occupancy across the affected region.</p>
      </div>

      <Card>
        <SectionHeader title="Shelters" subtitle={`${shelters.length} shelters tracked`} icon={<Tent className="h-4 w-4" aria-hidden="true" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shelters.map((s) => {
            const tone = shelterStatusTone(s.status)
            const available = s.capacity - s.occupancy
            return (
              <div key={s.id} className="rounded-xl border border-navy-200 p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="font-semibold text-navy-900">{s.name}</p>
                  <StatusBadge label={s.status} tone={tone} />
                </div>
                <p className="mb-3 flex items-center gap-1 text-xs text-navy-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {s.location}
                </p>
                <ProgressBar ratio={s.occupancy / s.capacity} tone={tone} label={`${s.name} occupancy`} />
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-md bg-navy-50 py-1.5">
                    <p className="font-semibold text-navy-900">{s.capacity}</p>
                    <p className="text-navy-500">Capacity</p>
                  </div>
                  <div className="rounded-md bg-navy-50 py-1.5">
                    <p className="font-semibold text-navy-900">{s.occupancy}</p>
                    <p className="text-navy-500">Occupancy</p>
                  </div>
                  <div className="rounded-md bg-navy-50 py-1.5">
                    <p className="font-semibold text-stable-600">{available}</p>
                    <p className="text-navy-500">Available</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
