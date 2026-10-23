import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader } from '../components/shared/Card'
import { TableWrap } from '../components/shared/Controls'
import { Modal } from '../components/shared/Modal'
import { ClipboardList } from 'lucide-react'

export default function Treatments() {
  const [viewingId, setViewingId] = useState<string | null>(null)
  const { treatments, getPatient, getStaff, getHospital } = useAppData()
  const viewing = treatments.find((t) => t.id === viewingId)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Treatments</h1>
        <p className="mt-1 text-sm text-navy-500">Clinical treatment records logged across the response.</p>
      </div>

      <Card>
        <SectionHeader title="Treatment Records" icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />} />
        <TableWrap>
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                <th className="py-2 pr-3 font-medium">Treatment ID</th>
                <th className="py-2 pr-3 font-medium">Patient</th>
                <th className="py-2 pr-3 font-medium">Treatment Date</th>
                <th className="py-2 pr-3 font-medium">Description</th>
                <th className="py-2 pr-3 font-medium">Medication</th>
                <th className="py-2 pr-3 font-medium">Medical Staff</th>
                <th className="py-2 pr-3 font-medium">Hospital</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {treatments.map((t) => (
                <tr key={t.id} className="cursor-pointer hover:bg-navy-50" onClick={() => setViewingId(t.id)}>
                  <td className="py-2.5 pr-3 font-mono text-xs text-navy-700">{t.id}</td>
                  <td className="py-2.5 pr-3 font-medium text-navy-900">
                    {t.patientId} — {getPatient(t.patientId)?.name}
                  </td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-navy-600">{t.date}</td>
                  <td className="py-2.5 pr-3 text-navy-800">{t.description}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{t.medication}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{getStaff(t.staffId)?.name}</td>
                  <td className="py-2.5 pr-3 text-navy-600">{getHospital(t.hospitalId)?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>

      <Modal open={!!viewing} onClose={() => setViewingId(null)} title={viewing?.id ?? ''}>
        {viewing && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="col-span-2">
              <dt className="text-xs text-navy-400">Patient</dt>
              <dd className="font-semibold text-navy-900">{getPatient(viewing.patientId)?.name} ({viewing.patientId})</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-400">Treatment Date</dt>
              <dd className="text-navy-800">{viewing.date}</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-400">Hospital</dt>
              <dd className="text-navy-800">{getHospital(viewing.hospitalId)?.name}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-navy-400">Description</dt>
              <dd className="text-navy-800">{viewing.description}</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-400">Medication</dt>
              <dd className="text-navy-800">{viewing.medication}</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-400">Medical Staff</dt>
              <dd className="text-navy-800">{getStaff(viewing.staffId)?.name}</dd>
            </div>
          </dl>
        )}
      </Modal>
    </div>
  )
}
