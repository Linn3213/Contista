import { ReactNode, useEffect, useState } from 'react'
import TopNav from './TopNav'
import BottomNav from './BottomNav'
import SideNav from './SideNav'

export default function Layout({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const [sideNavOpen, setSideNavOpen] = useState(true)

  useEffect(() => {
    if (hideNav || !import.meta.env.DEV) return
    try {
      const saved = localStorage.getItem('contista.sidenav.open')
      if (saved === '0') setSideNavOpen(false)
    } catch {
      // Ignore storage failures.
    }
  }, [hideNav])

  useEffect(() => {
    if (hideNav || !import.meta.env.DEV) return
    try {
      localStorage.setItem('contista.sidenav.open', sideNavOpen ? '1' : '0')
    } catch {
      // Ignore storage failures.
    }
  }, [sideNavOpen, hideNav])

  return (
    <div className="min-h-screen bg-background relative">
      <div className="ambient-blob-1" />
      <div className="ambient-blob-2" />
      {!hideNav && <SideNav isOpen={sideNavOpen} onClose={() => setSideNavOpen(false)} />}
      {!hideNav && <TopNav sideNavOpen={sideNavOpen} onToggleSideNav={() => setSideNavOpen(v => !v)} />}
      <main className={`relative z-10 pb-28 md:pb-0 transition-all duration-200 ${sideNavOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
