import { NavLink } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import {
  LayoutDashboard,
  Flame,
  Users,
  Stethoscope,
  Building2,
  Truck,
  UserRound,
  Package,
  Tent,
  HandHeart,
  ClipboardList,
  Route as RouteIcon,
  Siren,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/disasters', label: 'Disasters', icon: Flame },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/triage', label: 'Triage', icon: Stethoscope },
  { to: '/hospitals', label: 'Hospitals & Beds', icon: Building2 },
  { to: '/ambulances', label: 'Ambulances', icon: Truck },
  { to: '/medical-staff', label: 'Medical Staff', icon: UserRound },
  { to: '/supplies', label: 'Supplies', icon: Package },
  { to: '/shelters', label: 'Shelters', icon: Tent },
  { to: '/volunteers', label: 'Volunteers', icon: HandHeart },
  { to: '/treatments', label: 'Treatments', icon: ClipboardList },
  { to: '/transport-logs', label: 'Transport Logs', icon: RouteIcon },
]

interface SidebarProps {
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { loading, error } = useAppData()
  const apiStatus = error ? 'Unavailable' : loading ? 'Connecting' : 'Connected'
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-navy-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between gap-2 border-b border-navy-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Siren className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold leading-tight text-navy-900">EHMS</p>
              <p className="text-xs leading-tight text-navy-500">Emergency Response</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseMobile}
            className="rounded p-1 text-navy-400 hover:bg-navy-100 lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                    }`
                  }
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-navy-100 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">System Status</p>
          <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-navy-800">
            <span className={`h-2 w-2 rounded-full ${error ? 'bg-critical-600' : loading ? 'bg-warn-500' : 'bg-stable-500'}`} aria-hidden="true" />
            API {apiStatus}
          </p>
        </div>
      </aside>
    </>
  )
}
