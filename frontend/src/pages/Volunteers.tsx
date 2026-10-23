import { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader, EmptyState } from '../components/shared/Card'
import { FilterSelect, TableWrap, Button } from '../components/shared/Controls'
import { StatusBadge } from '../components/shared/StatusBadge'
import { Modal } from '../components/shared/Modal'
import type { AssignmentLocationType, VolunteerRole } from '../types'
import { HandHeart } from 'lucide-react'

export default function Volunteers() {
  const { volunteers, hospitals, shelters, assignments, assignVolunteer, unassignVolunteer, assignmentFor, locationName } = useAppData()
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [locationType, setLocationType] = useState<AssignmentLocationType>('Hospital')
  const [locationId, setLocationId] = useState('')

  const total = volunteers.length
  const assignedCount = volunteers.filter((v) => v.status === 'Assigned').length
  const availableCount = volunteers.filter((v) => v.status === 'Available').length
  const atShelters = assignments.filter((a) => a.locationType === 'Shelter').length
  const atHospitals = assignments.filter((a) => a.locationType === 'Hospital').length

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      if (roleFilter !== 'all' && v.role !== (roleFilter as VolunteerRole)) return false
      if (statusFilter !== 'all' && v.status !== statusFilter) return false
      return true
    })
  }, [volunteers, roleFilter, statusFilter])

  const assigningVolunteer = volunteers.find((v) => v.id === assigningId)

  const openAssignModal = (volunteerId: string) => {
    setAssigningId(volunteerId)
    const existing = assignmentFor(volunteerId)
    setLocationType(existing?.locationType ?? 'Hospital')
    setLocationId(existing?.locationId ?? (hospitals[0]?.id ?? shelters[0]?.id ?? ''))
  }

  const confirmAssign = () => {
    if (!assigningId) return
    void assignVolunteer(assigningId, locationType, locationId)
    setAssigningId(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Volunteers</h1>
        <p className="mt-1 text-sm text-navy-500">Coordinate volunteer deployment across hospitals and shelters.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card><p className="text-2xl font-bold text-navy-900">{total}</p><p className="text-sm text-navy-500">Total Volunteers</p></Card>
        <Card><p className="text-2xl font-bold text-brand-600">{assignedCount}</p><p className="text-sm text-navy-500">Assigned</p></Card>
        <Card><p className="text-2xl font-bold text-stable-600">{availableCount}</p><p className="text-sm text-navy-500">Available</p></Card>
        <Card><p className="text-2xl font-bold text-navy-900">{atShelters}</p><p className="text-sm text-navy-500">At Shelters</p></Card>
        <Card><p className="text-2xl font-bold text-navy-900">{atHospitals}</p><p className="text-sm text-navy-500">At Hospitals</p></Card>
      </div>

      <Card>
        <SectionHeader title="Volunteer Roster" icon={<HandHeart className="h-4 w-4" aria-hidden="true" />} />
        <div className="mb-4 flex flex-wrap gap-3">
          <FilterSelect
            label="Role"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'Medical Aid', label: 'Medical Aid' },
              { value: 'Logistics', label: 'Logistics' },
              { value: 'Shelter Support', label: 'Shelter Support' },
              { value: 'Coordination', label: 'Coordination' },
            ]}
          />
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Assigned', label: 'Assigned' },
              { value: 'Available', label: 'Available' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No volunteers match your filters." />
        ) : (
          <TableWrap>
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                  <th className="py-2 pr-3 font-medium">Volunteer ID</th>
                  <th className="py-2 pr-3 font-medium">Name</th>
                  <th className="py-2 pr-3 font-medium">Role</th>
                  <th className="py-2 pr-3 font-medium">Contact</th>
                  <th className="py-2 pr-3 font-medium">Assignment</th>
                  <th className="py-2 pr-3 font-medium">Location</th>
                  <th className="py-2 pr-3 font-medium">Assigned Date</th>
                  <th className="py-2 pr-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.map((v) => {
                  const assignment = assignmentFor(v.id)
                  return (
                    <tr key={v.id} className="hover:bg-navy-50">
                      <td className="py-2.5 pr-3 font-mono text-xs text-navy-700">{v.id}</td>
                      <td className="py-2.5 pr-3 font-medium text-navy-900">{v.name}</td>
                      <td className="py-2.5 pr-3 text-navy-600">{v.role}</td>
                      <td className="py-2.5 pr-3 whitespace-nowrap text-navy-500">{v.contact}</td>
                      <td className="py-2.5 pr-3">
                        <StatusBadge label={v.status} tone={v.status === 'Assigned' ? 'blue' : 'green'} />
                      </td>
                      <td className="py-2.5 pr-3 text-navy-600">
                        {assignment ? `${assignment.locationType} — ${locationName(assignment)}` : '—'}
                      </td>
                      <td className="py-2.5 pr-3 whitespace-nowrap text-navy-500">{assignment?.assignedDate ?? '—'}</td>
                      <td className="py-2.5 pr-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" onClick={() => openAssignModal(v.id)}>
                            {assignment ? 'Reassign' : 'Assign Volunteer'}
                          </Button>
                          {assignment && (
                            <Button variant="ghost" onClick={() => unassignVolunteer(v.id)}>
                              Release
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      <Modal
        open={!!assigningVolunteer}
        onClose={() => setAssigningId(null)}
        title={`Assign ${assigningVolunteer?.name ?? ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAssigningId(null)}>Cancel</Button>
            <Button onClick={confirmAssign}>Confirm Assignment</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <FilterSelect
            label="Location Type"
            value={locationType}
            onChange={(v) => {
              const type = v as AssignmentLocationType
              setLocationType(type)
              setLocationId(type === 'Hospital' ? (hospitals[0]?.id ?? '') : (shelters[0]?.id ?? ''))
            }}
            options={[
              { value: 'Hospital', label: 'Hospital' },
              { value: 'Shelter', label: 'Shelter' },
            ]}
          />
          <FilterSelect
            label={locationType === 'Hospital' ? 'Hospital' : 'Shelter'}
            value={locationId}
            onChange={setLocationId}
            options={(locationType === 'Hospital' ? hospitals : shelters).map((loc) => ({ value: loc.id, label: loc.name }))}
          />
        </div>
      </Modal>
    </div>
  )
}
