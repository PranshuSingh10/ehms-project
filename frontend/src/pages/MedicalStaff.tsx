import { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader, EmptyState } from '../components/shared/Card'
import { FilterSelect, TableWrap } from '../components/shared/Controls'
import { StatusBadge } from '../components/shared/StatusBadge'
import type { StaffRole, StaffStatus } from '../types'
import { UserRound } from 'lucide-react'

export default function MedicalStaff() {
  const [roleFilter, setRoleFilter] = useState('all')
  const [hospitalFilter, setHospitalFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const { staff, hospitals, getHospital } = useAppData()

  const doctors = staff.filter((s) => s.role === 'Doctor').length
  const nurses = staff.filter((s) => s.role === 'Nurse').length
  const paramedics = staff.filter((s) => s.role === 'Paramedic').length

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      if (roleFilter !== 'all' && s.role !== (roleFilter as StaffRole)) return false
      if (hospitalFilter !== 'all' && s.hospitalId !== hospitalFilter) return false
      if (statusFilter !== 'all' && s.status !== (statusFilter as StaffStatus)) return false
      return true
    })
  }, [staff, roleFilter, hospitalFilter, statusFilter])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Medical Staff</h1>
        <p className="mt-1 text-sm text-navy-500">Doctors, nurses, and paramedics deployed across the response.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><p className="text-2xl font-bold text-navy-900">{doctors}</p><p className="text-sm text-navy-500">Doctors</p></Card>
        <Card><p className="text-2xl font-bold text-navy-900">{nurses}</p><p className="text-sm text-navy-500">Nurses</p></Card>
        <Card><p className="text-2xl font-bold text-navy-900">{paramedics}</p><p className="text-sm text-navy-500">Paramedics</p></Card>
        <Card><p className="text-2xl font-bold text-navy-900">—</p><p className="text-sm text-navy-500">Duty status not recorded</p></Card>
      </div>

      <Card>
        <SectionHeader title="Staff Directory" icon={<UserRound className="h-4 w-4" aria-hidden="true" />} />
        <div className="mb-4 flex flex-wrap gap-3">
          <FilterSelect
            label="Role"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'Doctor', label: 'Doctor' },
              { value: 'Nurse', label: 'Nurse' },
              { value: 'Paramedic', label: 'Paramedic' },
            ]}
          />
          <FilterSelect
            label="Hospital"
            value={hospitalFilter}
            onChange={setHospitalFilter}
            options={[{ value: 'all', label: 'All Hospitals' }, ...hospitals.map((h) => ({ value: h.id, label: h.name }))]}
          />
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'On Duty', label: 'On Duty' },
              { value: 'Off Duty', label: 'Off Duty' },
              { value: 'Unknown', label: 'Not recorded' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No staff match your filters." />
        ) : (
          <TableWrap>
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                  <th className="py-2 pr-3 font-medium">Staff ID</th>
                  <th className="py-2 pr-3 font-medium">Name</th>
                  <th className="py-2 pr-3 font-medium">Role</th>
                  <th className="py-2 pr-3 font-medium">Specialization</th>
                  <th className="py-2 pr-3 font-medium">Hospital</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-navy-50">
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-700">{s.id}</td>
                    <td className="py-2.5 pr-3 font-medium text-navy-900">{s.name}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{s.role}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{s.specialization}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{getHospital(s.hospitalId)?.name}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge label={s.status} tone={s.status === 'On Duty' ? 'green' : 'gray'} />
                    </td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-navy-500">{s.contact}</td>
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
