import { NavLink } from 'react-router-dom'

const items = [
  { to: '/dashboard',       icon: 'home',           label: 'Dashboard' },
  { to: '/skapa',           icon: 'add_circle',     label: 'Contentskaparen' },
  { to: '/kalender',        icon: 'calendar_month', label: 'Kalender' },
  { to: '/bibliotek',       icon: 'local_library',  label: 'Bibliotek' },
  { to: '/trender',         icon: 'trending_up',    label: 'Trendspaning' },
  { to: '/contentstrategi', icon: 'account_tree',   label: 'Contentstrategi' },
  { to: '/dreamcustomer',   icon: 'person_search',  label: 'Drömkund' },
  { to: '/settings',        icon: 'settings',       label: 'Inställningar' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full overflow-x-auto no-scrollbar bg-background/95 backdrop-blur-xl border-t border-outline-variant/30 z-50">
      <div className="min-w-max flex items-center gap-4 px-4 pb-6 pt-3">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all min-w-[62px] ${
              isActive ? 'text-primary' : 'text-on-surface-variant opacity-50 hover:opacity-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" : undefined }}
              >
                {item.icon}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
      </div>
    </nav>
  )
}
