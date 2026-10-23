import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts'
import { Card, SectionHeader } from '../shared/Card'
import { useAppData } from '../../context/AppDataContext'

const TRIAGE_COLORS: Record<string, string> = {
  Red: '#dc2626',
  Orange: '#ea580c',
  Yellow: '#ca8a04',
  Green: '#16a34a',
}

export function TriageDonutChart() {
  const { patients } = useAppData()
  const data = (['Red', 'Orange', 'Yellow', 'Green'] as const).map((name) => ({ name, value: patients.filter((p) => p.triage === name).length }))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <SectionHeader title="Patient Triage Distribution" subtitle={`${total} assessed patients; unassessed patients are excluded`} />
      <div className="flex items-center gap-4">
        <div className="h-52 w-1/2 min-w-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={TRIAGE_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value} patients`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex-1 space-y-2">
          {data.map((d) => (
            <li key={d.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-navy-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TRIAGE_COLORS[d.name] }} aria-hidden="true" />
                {d.name}
              </span>
              <span className="font-semibold text-navy-900">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

export function BedOccupancyChart() {
  const { hospitalCapacity } = useAppData()
  const data = hospitalCapacity.map((hospital) => ({
    name: hospital.hospitalName.replace(' Hospital', '').replace(' Multispecialty', '').replace(' Relief Center', ''),
    Occupied: hospital.totalBeds - hospital.vacantBeds,
    Available: hospital.vacantBeds,
  }))

  return (
    <Card>
      <SectionHeader title="Hospital Bed Occupancy" subtitle="Occupied vs. available beds by facility" />
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6eaf1" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#54698c' }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: '#37455e' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Occupied" stackId="a" fill="#dc2626" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Available" stackId="a" fill="#16a34a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function AdmissionsChart() {
  const { disasters, patients } = useAppData()
  const data = disasters.map((d) => ({ time: d.name, admissions: patients.filter((p) => p.disasterId === d.id).length }))
  return (
    <Card>
      <SectionHeader title="Patients by Disaster" subtitle="Patient counts from the live patient records" />
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -16, right: 16 }}>
            <defs>
              <linearGradient id="admissionsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2f6fdb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2f6fdb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6eaf1" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#54698c' }} />
            <YAxis tick={{ fontSize: 12, fill: '#54698c' }} />
            <Tooltip />
            <Area type="monotone" dataKey="admissions" stroke="#2f6fdb" strokeWidth={2} fill="url(#admissionsFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function SupplyStatusChart() {
  const { supplies } = useAppData()
  const categories = ['Oxygen', 'Blood', 'Medicine', 'Equipment'] as const
  const data = categories.map((category) => {
    const items = supplies.filter((s) => s.category === category)
    const worst = items.some((i) => i.stockStatus === 'CRITICAL')
      ? '#dc2626'
      : items.some((i) => i.stockStatus === 'LOW STOCK')
        ? '#ca8a04'
        : '#16a34a'
    return {
      name: category === 'Medicine' ? 'Medicines' : category === 'Equipment' ? 'Emergency Equipment' : category,
      items: items.length,
      lowStock: items.filter((i) => i.stockStatus !== 'NORMAL').length,
      fill: worst,
    }
  })

  return (
    <Card>
      <SectionHeader title="Medical Supply Status" subtitle="Tracked items by category — flagged items shown in red/amber" />
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -16, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6eaf1" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#54698c' }} />
            <YAxis tick={{ fontSize: 12, fill: '#54698c' }} allowDecimals={false} />
            <Tooltip formatter={(value: number, key: string) => [value, key === 'items' ? 'Tracked items' : key]} />
            <Bar dataKey="items" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-navy-500">Items below the backend’s 20-unit low-stock threshold are flagged.</p>
    </Card>
  )
}
