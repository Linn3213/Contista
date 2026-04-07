import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGuidette } from '../contexts/GuidetteContext'

// ─── Kontextuella tips per sida ────────────────────────────────────────────────

const PAGE_TIPS: Record<string, { message: string; action?: { label: string; to: string } }> = {
  '/dashboard': {
    message: 'Välkommen! Här ser du en överblick av ditt content. Börja med att skapa ett nytt inlägg.',
    action: { label: 'Skapa inlägg', to: '/skapa' },
  },
  '/skapa': {
    message: 'Välj en hook som fångar din målgrupp, bygg din struktur och jag hjälper dig skriva klart.',
    action: { label: 'Se mina pelare', to: '/contentstrategi' },
  },
  '/kalender': {
    message: 'Planera ditt content vecka för vecka. Klicka på en dag för att lägga till ett inlägg.',
  },
  '/bibliotek': {
    message: 'Här samlar du allt ditt material — hooks, texter, idéer. Inget ska gå förlorat.',
    action: { label: 'Ny idé', to: '/bibliotek' },
  },
  '/dreamcustomer': {
    message: 'Ju bättre du känner din drömkund, desto träffsäkrare blir ditt content. Ta dig tid här.',
  },
  '/contentstrategi': {
    message: 'Dina innehållspelare är grunden för allt du postar. Uppdatera dem när din verksamhet förändras.',
  },
  '/trender': {
    message: 'Håll koll på vad som trendar. Kombinera trender med dina pelare för viral potential.',
  },
}

const DEFAULT_TIP = {
  message: 'Jag är här om du behöver hjälp! Vad jobbar du med idag?',
}

export default function GuidetteWidget() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, onboardingDone } = useGuidette()
  const [open, setOpen] = useState(false)

  // Visa inte på onboarding
  if (!onboardingDone || location.pathname === '/onboarding') return null

  const pageTip = PAGE_TIPS[location.pathname] ?? DEFAULT_TIP
  const firstName = profile?.display_name?.split(' ')[0] ?? ''

  return (
    <>
      {/* Bubbla */}
      {open && (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-20 w-72 z-50 animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-2xl shadow-editorial overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">Guidette</p>
                  <p className="text-[10px] text-on-surface-variant/60">Din guide</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Meddelande */}
            <div className="px-4 py-3">
              {firstName && (
                <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-1">{firstName}</p>
              )}
              <p className="text-sm text-on-surface leading-relaxed">{pageTip.message}</p>
            </div>

            {/* Innehållspelare om de finns */}
            {profile?.content_pillars && profile.content_pillars.length > 0 && (
              <div className="px-4 pb-3">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-2">Dina pelare</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.content_pillars.slice(0, 4).map(p => (
                    <span key={p.id} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15">
                      {p.emoji} {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action */}
            {pageTip.action && (
              <div className="px-4 pb-4">
                <button
                  onClick={() => { navigate(pageTip.action!.to); setOpen(false) }}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-medium tracking-wide hover:opacity-90 transition-opacity"
                >
                  {pageTip.action.label}
                </button>
              </div>
            )}

            {/* Snabblänkar */}
            <div className="border-t border-outline-variant/15 px-4 py-3 flex gap-2 flex-wrap">
              {[
                { label: 'Skapa inlägg', to: '/skapa' },
                { label: 'Kalender', to: '/kalender' },
                { label: 'Ny idé', to: '/bibliotek' },
              ].map(link => (
                <button
                  key={link.to}
                  onClick={() => { navigate(link.to); setOpen(false) }}
                  className="text-[10px] px-2.5 py-1 rounded-lg border border-outline-variant/25 text-on-surface-variant hover:text-on-surface hover:border-primary/30 transition-all"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pil */}
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-surface-container-lowest border-r border-b border-outline-variant/25 rotate-45" />
        </div>
      )}

      {/* FAB-knapp */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed bottom-20 right-4 md:bottom-5 md:right-6 z-50 w-12 h-12 rounded-full shadow-editorial flex items-center justify-center transition-all duration-200 ${
          open
            ? 'bg-on-surface text-background scale-95'
            : 'bg-primary text-white hover:scale-105'
        }`}
        title="Guidette"
      >
        <span className="text-lg">{open ? '×' : '✨'}</span>
      </button>
    </>
  )
}
