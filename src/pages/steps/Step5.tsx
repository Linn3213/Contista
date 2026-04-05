import { useState, useEffect } from 'react'
import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'
import { supabase, Hook } from '../../lib/supabase'
import { useClipboard } from '../../hooks/useClipboard'

const HOOK_CATEGORIES = [
  { key: 'educational', label: 'Nyfikenhet', desc: 'Skapa ett kunskapsgap.' },
  { key: 'authority', label: 'Auktoritet', desc: 'Led med expertis och resultat.' },
  { key: 'myth_busting', label: 'Motvalls', desc: 'Utmana status quo och myter.' },
  { key: 'storytelling', label: 'Emotionell', desc: 'Knyt an genom gemensamma utmaningar.' },
  { key: 'comparison', label: 'Jämförelse', desc: 'Kontrastera för att skapa klarhet.' },
  { key: 'swedish', label: 'Svenska', desc: 'Hooks optimerade för svensk publik.' },
]

export default function Step5() {
  const { state, update } = useCreator()
  const { copy } = useClipboard()
  const [hooks, setHooks] = useState<Hook[]>([])
  const [loading, setLoading] = useState(false)

  const fetchHooks = async (cat: string, lang: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('hooks')
      .select('*')
      .eq('category', cat)
      .eq('language', lang)
      .order('sort_order')
      .limit(6)
    setHooks(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchHooks(state.hookCategory, state.hookLanguage)
  }, [state.hookCategory, state.hookLanguage])

  const shuffle = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('hooks')
      .select('*')
      .eq('category', state.hookCategory)
      .eq('language', state.hookLanguage)
      .limit(100)
    if (data && data.length > 0) {
      const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 6)
      setHooks(shuffled)
    }
    setLoading(false)
  }

  return (
    <StepLayout step={5} canContinue={!!state.selectedHook}>
      <h1 className="serif-headline text-5xl md:text-6xl mb-4 leading-[1.1] tracking-tight italic">
        Utveckla din hook
      </h1>
      <p className="text-on-surface-variant text-lg font-light mb-10 leading-relaxed max-w-xl">
        Din hook är din tysta kurator. Den väljer rätt målgrupp på några sekunder. Välj en psykologisk vinkel.
      </p>

      {/* Language toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-surface-container-high rounded-full p-1">
          {([['sv', 'Svenska'], ['en', 'Engelska']] as const).map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => update({ hookLanguage: val })}
              className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.15em] font-semibold transition-all ${
                state.hookLanguage === val ? 'bg-primary text-white' : 'text-on-surface-variant'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
        <button
          onClick={shuffle}
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant/40 rounded-full text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
        >
          <span className="material-symbols-outlined text-sm">shuffle</span>
          Blanda
        </button>
      </div>

      {/* Category grid */}
      <div className="mb-8">
        <p className="label-xs text-on-surface-variant/60 mb-4">Välj Kategori</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {HOOK_CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => update({ hookCategory: c.key })}
              className={`flex flex-col text-left p-4 rounded-card transition-all ${
                state.hookCategory === c.key
                  ? 'bg-surface-container-lowest border-2 border-secondary shadow-sm'
                  : 'bg-surface-container-lowest border border-transparent hover:border-outline-variant/30'
              }`}
            >
              <span className="serif-headline text-lg mb-1">{c.label}</span>
              <span className="text-[11px] text-on-surface-variant leading-tight opacity-70">{c.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hook suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-3">
          <p className="label-xs text-on-surface-variant/70">Hook-förslag</p>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary/15 rounded-full text-[9px] font-semibold uppercase tracking-wider text-on-surface">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>auto_awesome</span>
            Databas
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface-container-low rounded-card p-8 animate-pulse">
                <div className="h-6 bg-surface-container-high rounded w-3/4 mb-3" />
                <div className="h-4 bg-surface-container-high rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {hooks.map((hook, i) => (
              <div
                key={hook.id}
                className={`bg-surface-container-lowest p-7 rounded-card border border-outline-variant/30 hover:shadow-editorial transition-all duration-500 cursor-pointer ${
                  state.selectedHook === hook.id ? 'ring-2 ring-primary/40' : ''
                } ${i > 0 ? 'opacity-80 hover:opacity-100' : ''}`}
                onClick={() => update({ selectedHook: hook.id, draft: hook.text })}
              >
                <p className="text-xl md:text-2xl serif-headline leading-tight mb-8 text-on-surface italic">
                  "{hook.text}"
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={e => { e.stopPropagation(); copy(hook.text) }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Kopiera
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); update({ selectedHook: hook.id, draft: hook.text }) }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Välj
                  </button>
                  <div className="flex-grow" />
                  {state.selectedHook === hook.id && (
                    <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                      ✓ Vald
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StepLayout>
  )
}
