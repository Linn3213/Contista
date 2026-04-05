import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/skapa', icon: 'add_circle', label: 'Contentskaparen' },
  { to: '/kalender', icon: 'calendar_month', label: 'Kalender' },
  { to: '/bibliotek', icon: 'local_library', label: 'Bibliotek' },
  { to: '/trender', icon: 'trending_up', label: 'Trendspaning' },
  { to: '/contentstrategi', icon: 'account_tree', label: 'Contentstrategi' },
  { to: '/dreamcustomer', icon: 'person_search', label: 'Drömkund' },
  { to: '/settings', icon: 'settings', label: 'Inställningar' },
]

export default function SideNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'C'

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <aside className={`hidden md:flex fixed left-0 top-0 h-screen w-64 border-r border-outline-variant/30 bg-surface/90 backdrop-blur-md z-40 transition-transform duration-200 ${isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}>
      <div className="w-full p-5 flex flex-col">
        <div className="pb-5 border-b border-outline-variant/20 flex items-start justify-between gap-2">
          <div>
            <h1 className="serif-headline text-3xl italic text-on-surface">Contista</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1">Workspace</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-colors"
            title="Stäng sidomeny"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <nav className="mt-5 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-2 px-1">Meny</p>
          <div className="space-y-1.5">
            {navItems.map(item => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-primary/12 text-primary border border-primary/20'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="pt-4 border-t border-outline-variant/20">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-all"
            title="Logga ut"
          >
            <span className="text-xs uppercase tracking-widest">Logga ut</span>
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{initials}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
