import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function TopNav({
  sideNavOpen,
  onToggleSideNav,
}: {
  sideNavOpen: boolean
  onToggleSideNav: () => void
}) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'C'

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <header className={`bg-background/90 backdrop-blur-md flex justify-between items-center px-6 md:px-8 py-5 w-full border-b border-black/5 sticky top-0 z-30 transition-all duration-200 ${sideNavOpen ? 'md:ml-64 md:w-[calc(100%-16rem)]' : 'md:ml-0 md:w-full'}`}>
      <div className="flex items-center gap-5">
        <button
          onClick={onToggleSideNav}
          className="hidden md:flex w-9 h-9 rounded-lg border border-outline-variant/30 items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-colors"
          title={sideNavOpen ? 'Stäng sidomeny' : 'Visa sidomeny'}
        >
          <span className="material-symbols-outlined text-[18px]">{sideNavOpen ? 'left_panel_close' : 'left_panel_open'}</span>
        </button>
        <h1 className="serif-headline text-3xl italic tracking-tight text-on-surface md:text-2xl">Contista</h1>
      </div>

      <button
        onClick={handleSignOut}
        className="w-8 h-8 rounded-full bg-primary/10 border border-outline-variant flex items-center justify-center text-primary text-xs font-semibold hover:bg-primary/20 transition-colors md:hidden"
        title="Logga ut"
      >
        {initials}
      </button>
    </header>
  )
}
