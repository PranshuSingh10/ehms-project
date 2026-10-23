import { useNavigate } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { Card, SectionHeader, EmptyState } from '../shared/Card'
import { StatusBadge } from '../shared/StatusBadge'
import { Button, TableWrap } from '../shared/Controls'
import { TRIAGE_TONE, patientStatusTone } from '../../utils/status'

interface CriticalQueueProps {
  onViewPatient: (patientId: string) => void
  disasterId: string
}

export function CriticalQueue({ onViewPatient, disasterId }: CriticalQueueProps) {
  const navigate = useNavigate()
  const { patients, getHospital, triageRecords } = useAppData()
  const critical = patients.filter((p) => p.disasterId === disasterId && p.triage === 'Red' && p.status === 'Admitted').slice(0, 8)

  return (
    <Card>
      <SectionHeader
        title="Critical Patient Queue"
        subtitle="Red-triage patients requiring immediate attention"
        action={
          <Button variant="secondary" onClick={() => navigate('/patients')}>
            View All Patients
          </Button>
        }
      />
      {critical.length === 0 ? (
          <EmptyState message="No critical patients for this disaster event." />
      ) : (
        <TableWrap>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                <th className="py-2 pr-3 font-medium">Patient ID</th>
                <th className="py-2 pr-3 font-medium">Patient</th>
                <th className="py-2 pr-3 font-medium">Age</th>
                <th className="py-2 pr-3 font-medium">Triage</th>
                <th className="py-2 pr-3 font-medium">Current Hospital</th>
                <th className="py-2 pr-3 font-medium">Assigned Bed</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Last Assessment</th>
                <th className="py-2 pr-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {critical.map((p) => (
                <tr key={p.id} className="hover:bg-navy-50">
                  <td className="py-2.5 pr-3 font-mono text-xs text-navy-500">{p.id}</td>
                  <td className="py-2.5 pr-3 font-medium text-navy-900">{p.name}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{p.age}</td>
                  <td className="py-2.5 pr-3">
                    <StatusBadge label="RED" tone={TRIAGE_TONE[p.triage]} />
                  </td>
                  <td className="py-2.5 pr-3 text-navy-600">{getHospital(p.hospitalId)?.name}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-navy-600">{p.bedId ?? '—'}</td>
                  <td className="py-2.5 pr-3">
                    <StatusBadge label={p.status} tone={patientStatusTone(p.status)} />
                  </td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-navy-600">{triageRecords.find((r) => r.patientId === p.id)?.assessedAt ?? '—'}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <Button variant="ghost" onClick={() => onViewPatient(p.id)}>
                      View Patient
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </Card>
  )
}
