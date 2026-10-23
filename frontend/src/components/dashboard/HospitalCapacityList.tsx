import { useNavigate } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { Card, SectionHeader } from '../shared/Card'
import { ProgressBar } from '../shared/ProgressBar'
import { StatusBadge } from '../shared/StatusBadge'
import { occupancyTone } from '../../utils/status'

export function HospitalCapacityList() {
  const navigate = useNavigate()
  const { hospitalCapacity } = useAppData()

  return (
    <Card>
      <SectionHeader title="Hospital Capacity" subtitle="Live bed occupancy across all partner facilities" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {hospitalCapacity.map((hospital) => {
          const occupiedBeds = hospital.totalBeds - hospital.vacantBeds
          const ratio = hospital.totalBeds ? occupiedBeds / hospital.totalBeds : 0
          const tone = occupancyTone(ratio)
          return (
            <button
              key={hospital.hospitalId}
              type="button"
              onClick={() => navigate('/hospitals')}
              className="rounded-lg border border-navy-200 p-3.5 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-navy-900">{hospital.hospitalName}</p>
                <StatusBadge
                  label={tone === 'red' ? 'At Capacity' : tone === 'orange' ? 'High Load' : 'Stable'}
                  tone={tone}
                />
              </div>
              <ProgressBar ratio={ratio} tone={tone} label={`${hospital.hospitalName} occupancy`} />
              <div className="mt-2 flex justify-between text-xs text-navy-500">
                <span>Beds {hospital.totalBeds}</span>
                <span>Occupied {occupiedBeds}</span>
                <span>Vacant {hospital.vacantBeds}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-navy-500">
                <span>Facility capacity {hospital.capacity}</span>
                <span>Staff {hospital.staffOnDuty}</span>
                <span>Ambulances {hospital.ambulancesAvailable}</span>
                <span>Low stock: {hospital.lowStockItems}</span>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
