import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { loadPillars } from '../lib/contentStrategy'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [pillarCount, setPillarCount] = useState(0)

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'CO'

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  useEffect(() => {
    if (!user) return
    setPillarCount(loadPillars(user.id).length)
  }, [user])

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="label-xs text-on-surface-variant/50 mb-3">Konto</p>
          <h1 className="serif-headline text-5xl italic leading-[1.1] mb-4">Inställningar och profil</h1>
          <p className="text-on-surface-variant text-base font-light leading-relaxed">
            Här samlar du det som styr din riktning, din profil och hur du arbetar i appen.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="serif-headline text-2xl italic text-primary">{initials}</span>
            </div>
            <div>
              <p className="label-xs text-on-surface-variant/50">Inloggad som</p>
              <p className="text-sm text-on-surface mt-1">{user?.email || 'Okänd användare'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/contentstrategi')}
              className="text-left p-4 rounded-xl border border-outline-variant/20 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <p className="text-sm font-medium text-on-surface">Contentstrategi</p>
              <p className="text-xs text-on-surface-variant/50 mt-1">Förtydliga riktning, fokus och innehåll</p>
            </button>
            <button
              onClick={() => navigate('/contentstrategi')}
              className="text-left p-4 rounded-xl border border-outline-variant/20 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <p className="text-sm font-medium text-on-surface">Contentpelare</p>
              <p className="text-xs text-on-surface-variant/50 mt-1">{pillarCount} pelare kopplade till Contentskaparen</p>
            </button>
            <button
              onClick={() => navigate('/dreamcustomer')}
              className="text-left p-4 rounded-xl border border-outline-variant/20 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <p className="text-sm font-medium text-on-surface">Drömkunder</p>
              <p className="text-xs text-on-surface-variant/50 mt-1">Gör målgruppen tydlig och lätt att skriva till</p>
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-4">Säkerhet</h2>
          <button
            onClick={handleSignOut}
            className="w-full py-3 rounded-full border border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all"
          >
            Logga ut
          </button>
        </div>
      </div>
    </Layout>
  )
}
