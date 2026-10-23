import { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { Card, SectionHeader, EmptyState } from '../components/shared/Card'
import { FilterSelect, SearchInput, TableWrap } from '../components/shared/Controls'
import { StatusBadge } from '../components/shared/StatusBadge'
import { STOCK_TONE } from '../utils/status'
import type { SupplyCategory, StockStatus } from '../types'
import { AlertTriangle, Package } from 'lucide-react'

export default function Supplies() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const { supplies, getHospital } = useAppData()

  const urgent = supplies.filter((s) => s.stockStatus !== 'NORMAL').sort((a, b) =>
    a.stockStatus === b.stockStatus ? 0 : a.stockStatus === 'CRITICAL' ? -1 : 1,
  )

  const filtered = useMemo(() => {
    return supplies.filter((s) => {
      if (search && !s.item.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter !== 'all' && s.category !== (categoryFilter as SupplyCategory)) return false
      if (stockFilter !== 'all' && s.stockStatus !== (stockFilter as StockStatus)) return false
      return true
    })
  }, [supplies, search, categoryFilter, stockFilter])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Supplies</h1>
        <p className="mt-1 text-sm text-navy-500">Emergency inventory across medicine, oxygen, blood, and equipment.</p>
      </div>

      <Card className="border-critical-200">
        <SectionHeader title="Urgent Supplies" subtitle="Items requiring immediate resupply" icon={<AlertTriangle className="h-4 w-4 text-critical-600" aria-hidden="true" />} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {urgent.map((s) => (
            <div key={s.id} className="rounded-lg border border-navy-200 p-3">
              <div className="mb-1 flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-navy-900">{s.item}</p>
                <StatusBadge label={s.stockStatus} tone={STOCK_TONE[s.stockStatus]} />
              </div>
              <p className="text-xs text-navy-500">{getHospital(s.hospitalId)?.name}</p>
              <p className="mt-1 text-sm font-medium text-navy-700">{s.quantity}{s.unit ? ` ${s.unit}` : ''} remaining</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Inventory" icon={<Package className="h-4 w-4" aria-hidden="true" />} />
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search supply items…" className="sm:max-w-xs" />
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'Medicine', label: 'Medicine' },
                { value: 'Oxygen', label: 'Oxygen' },
                { value: 'Blood', label: 'Blood' },
                { value: 'Equipment', label: 'Equipment' },
              ]}
            />
            <FilterSelect
              label="Stock Status"
              value={stockFilter}
              onChange={setStockFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'NORMAL', label: 'Normal' },
                { value: 'LOW STOCK', label: 'Low Stock' },
                { value: 'CRITICAL', label: 'Critical' },
              ]}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No supplies match your filters." />
        ) : (
          <TableWrap>
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-xs uppercase tracking-wide text-navy-400">
                  <th className="py-2 pr-3 font-medium">Supply ID</th>
                  <th className="py-2 pr-3 font-medium">Item</th>
                  <th className="py-2 pr-3 font-medium">Category</th>
                  <th className="py-2 pr-3 font-medium">Quantity</th>
                  <th className="py-2 pr-3 font-medium">Hospital</th>
                  <th className="py-2 pr-3 font-medium">Expiry</th>
                  <th className="py-2 pr-3 font-medium">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-navy-50">
                    <td className="py-2.5 pr-3 font-mono text-xs text-navy-700">{s.id}</td>
                    <td className="py-2.5 pr-3 font-medium text-navy-900">{s.item}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{s.category}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{s.quantity}{s.unit ? ` ${s.unit}` : ''}</td>
                    <td className="py-2.5 pr-3 text-navy-600">{getHospital(s.hospitalId)?.name}</td>
                    <td className="py-2.5 pr-3 text-navy-500">{s.expiry}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge label={s.stockStatus} tone={STOCK_TONE[s.stockStatus]} />
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
