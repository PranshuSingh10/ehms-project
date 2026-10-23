import { useState, type FormEvent } from 'react'
import { Bell, Menu, Search, ChevronDown, UserCircle } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { SolidBadge } from '../shared/StatusBadge'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  onOpenMobileNav: () => void
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { disasters, selectedDisasterId, setSelectedDisasterId, activeDisaster, supplies, shelters, ambulances } = useAppData()

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/patients?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-navy-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={onOpenMobileNav}
        className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <label className="hidden min-w-0 items-center gap-2 rounded-lg border border-navy-200 bg-navy-50 px-3 py-1.5 md:flex">
        <span className="text-xs font-medium text-navy-500">Active Event</span>
        <select value={selectedDisasterId} onChange={(event) => setSelectedDisasterId(event.target.value)} aria-label="Active event" className="min-w-0 max-w-56 truncate bg-transparent text-sm font-semibold text-navy-900 focus:outline-none">
          {disasters.length === 0 ? <option value="">No active event</option> : disasters.map((disaster) => <option key={disaster.id} value={disaster.id}>{disaster.name} — {disaster.location}</option>)}
        </select>
        {activeDisaster && <><SolidBadge label={activeDisaster.status} tone="blue" /><SolidBadge label={activeDisaster.severity} tone="red" /></>}
        <ChevronDown className="h-4 w-4 text-navy-400" aria-hidden="true" />
      </label>

      <form onSubmit={onSearchSubmit} className="relative ml-auto w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients, hospitals…"
          aria-label="Search patients or hospitals"
          className="w-full rounded-lg border border-navy-200 bg-navy-50 py-2 pl-9 pr-3 text-sm text-navy-800 placeholder:text-navy-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </form>

      <div className="relative">
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setNotifOpen((v) => !v)}
          className="relative rounded-lg p-2 text-navy-500 hover:bg-navy-100"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-critical-600" aria-hidden="true" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-navy-200 bg-white p-3 shadow-lg">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Notifications</p>
            <ul className="flex flex-col gap-2 text-sm text-navy-700">
              {supplies.filter((s) => s.stockStatus !== 'NORMAL').slice(0, 3).map((s) => <li key={s.id} className="rounded-md bg-warn-50 px-2.5 py-2 text-warn-700">Low stock: {s.item} ({s.quantity} {s.unit})</li>)}
              {shelters.filter((s) => s.status === 'FULL').map((s) => <li key={s.id} className="rounded-md bg-critical-50 px-2.5 py-2 text-critical-700">Shelter at capacity: {s.name}</li>)}
              <li className="rounded-md bg-navy-50 px-2.5 py-2 text-navy-700">{ambulances.filter((a) => a.status === 'On Trip').length} ambulances currently on trip</li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-l border-navy-200 pl-3">
        <UserCircle className="h-8 w-8 text-navy-400" aria-hidden="true" />
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-semibold text-navy-900">Ananya Deshpande</p>
          <p className="text-xs text-navy-500">Disaster Response Administrator</p>
        </div>
      </div>
    </header>
  )
}
