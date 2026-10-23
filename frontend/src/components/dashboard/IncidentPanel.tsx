import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Building2, Users, Tent } from 'lucide-react'
import type { Disaster } from '../../types'
import { Card } from '../shared/Card'
import { SolidBadge } from '../shared/StatusBadge'
import { Button } from '../shared/Controls'

export function IncidentPanel({ disaster }: { disaster: Disaster }) {
  const navigate = useNavigate()

  return (
    <Card className="border-critical-200">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-critical-600" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-wide text-critical-700">Active Disaster</p>
      </div>
      <h2 className="text-xl font-bold text-navy-900">{disaster.name}</h2>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
        <Stat icon={MapPin} label="Location" value={disaster.location} />
        <Stat icon={Calendar} label="Started" value={new Date(disaster.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
        <div>
          <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-navy-400">Severity</dt>
          <dd><SolidBadge label={disaster.severity} tone="red" /></dd>
        </div>
        <Stat icon={Building2} label="Affected Hospitals" value={String(disaster.affectedHospitals)} />
        <Stat icon={Users} label="Patients" value={String(disaster.patientCount)} />
        <Stat icon={Tent} label="Shelters Tracked" value={String(disaster.activeShelters)} />
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-navy-600">{disaster.description}</p>

      <Button className="mt-4" onClick={() => navigate(`/disasters?id=${disaster.id}`)}>
        View Disaster Details
      </Button>
    </Card>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-navy-400">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="font-semibold text-navy-900">{value}</dd>
    </div>
  )
}
