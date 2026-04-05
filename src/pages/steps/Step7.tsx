import { useState } from 'react'
import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'
import { useClipboard } from '../../hooks/useClipboard'

const DRAFT_TEMPLATES = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: 'work',
    build: (s: any) => {
      const hook = s.draft || s.selectedHook || ''
      const krok = s.structureKrok || ''
      const kontext = s.structureKontext || ''
      const karna = s.structureKarnavarde || ''
      const parts = []
      if (hook) parts.push(`${hook}\n`)
      if (krok) parts.push(`${krok}\n`)
      if (kontext) parts.push(`\n${kontext}\n`)
      if (karna) parts.push(`\n${karna}`)
      return parts.join('') || 'Fyll i tidigare steg för att generera ett utkast.'
    }
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: 'photo_camera',
    build: (s: any) => {
      const hook = s.draft || s.selectedHook || ''
      const karna = s.structureKarnavarde || ''
      const parts = []
      if (hook) parts.push(`${hook}\n\n`)
      if (karna) parts.push(`${karna}\n\n`)
      parts.push('#contentstrategi #skapare #linkedin')
      return parts.join('') || 'Fyll i tidigare steg för att generera ett utkast.'
    }
  },
]

export default function Step7() {
  const { state, update } = useCreator()
  const { copy } = useClipboard()
  const [activeTemplate, setActiveTemplate] = useState('linkedin')
  const [wordCount, setWordCount] = useState(0)

  const currentTemplate = DRAFT_TEMPLATES.find(t => t.key === activeTemplate)!
  const generatedDraft = currentTemplate.build(state)

  const handleDraftChange = (val: string) => {
    update({ draft: val })
    setWordCount(val.trim().split(/\s+/).filter(Boolean).length)
  }

  const hasDraft = !!state.draft || !!state.structureKrok || !!state.selectedHook

  return (
    <StepLayout step={7} canContinue={!!state.draft} fullWidth>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-0 -mx-6 min-h-[70vh]">
        {/* Left nav */}
        <aside className="col-span-2 px-4 pt-2 border-r border-outline-variant/10">
          <p className="label-xs text-on-surface-variant/50 mb-6">Framsteg</p>
          <div className="h-[2px] bg-outline-variant mb-8">
            <div className="h-full bg-accent-green w-[77%]" />
          </div>
          <nav className="space-y-5">
            {['Koncept','Målgrupp','Tonläge','Research','Narrativ','Struktur','Utkast','Finjustering','Publicera'].map((name, i) => (
              <div key={name} className={`flex items-center gap-3 ${i === 6 ? 'text-accent-rose' : i < 6 ? 'opacity-30' : 'opacity-50'}`}>
                <span className="serif-headline text-base italic">{String(i+1).padStart(2,'0')}</span>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${i === 6 ? 'border-b border-accent-rose/30 pb-0.5 font-bold' : ''}`}>{name}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Center editor */}
        <section className="col-span-7 px-8 overflow-y-auto">
          <h2 className="serif-headline text-4xl mb-3">Utkast</h2>
          <p className="text-on-surface-variant text-sm italic font-light mb-8">Forma ditt innehåll. Redigera fritt.</p>

          {/* Platform tabs */}
          <div className="flex gap-2 mb-6">
            {DRAFT_TEMPLATES.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTemplate(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${
                  activeTemplate === t.key
                    ? 'bg-primary text-white'
                    : 'border border-outline-variant/40 text-on-surface-variant hover:border-primary/40'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Auto-generated preview */}
          {hasDraft && (
            <div className="mb-6 p-5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="flex items-center justify-between mb-3">
                <p className="label-xs text-on-surface-variant/60">Automatiskt utkast</p>
                <button
                  onClick={() => { update({ draft: generatedDraft }); handleDraftChange(generatedDraft) }}
                  className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-primary hover:text-primary/70 font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                  Använd detta
                </button>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line line-clamp-4">{generatedDraft}</p>
            </div>
          )}

          {/* Main editor */}
          <div>
            <label className="label-xs text-on-surface-variant/50 block mb-3">Ditt utkast</label>
            <textarea
              value={state.draft}
              onChange={e => handleDraftChange(e.target.value)}
              placeholder="Skriv eller klistra in ditt utkast här. Du kan också använda det automatiska utkastet ovan som utgångspunkt..."
              className="w-full border border-outline-variant/20 rounded-xl p-5 text-sm leading-relaxed resize-none focus:outline-none focus:border-primary/40 transition-colors bg-surface-container-lowest font-light"
              rows={16}
            />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-on-surface-variant/40">{state.draft.length} tecken</span>
              <span className="text-[10px] text-on-surface-variant/40">{wordCount} ord</span>
            </div>
          </div>
        </section>

        {/* Right panel */}
        <aside className="col-span-3 border-l border-outline-variant/10 px-6 pt-6">
          <p className="label-xs text-on-surface-variant/50 mb-6">Byggstenarna</p>
          <div className="space-y-4 text-xs text-on-surface-variant">
            {state.selectedHook && (
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/10">
                <p className="label-xs text-accent-rose mb-2">Hook</p>
                <p className="serif-headline text-sm italic leading-snug">"{state.draft || state.selectedHook}"</p>
              </div>
            )}
            {state.structureKrok && (
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/10">
                <p className="label-xs text-accent-sage mb-2">Krok</p>
                <p className="leading-relaxed">{state.structureKrok}</p>
              </div>
            )}
            {state.structureKontext && (
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/10">
                <p className="label-xs text-accent-green mb-2">Kontext</p>
                <p className="leading-relaxed">{state.structureKontext}</p>
              </div>
            )}
            {state.structureKarnavarde && (
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/10">
                <p className="label-xs text-on-surface-variant/60 mb-2">Kärnvärde</p>
                <p className="leading-relaxed">{state.structureKarnavarde}</p>
              </div>
            )}
            {!state.selectedHook && !state.structureKrok && (
              <p className="text-on-surface-variant/40 text-xs italic">Fyll i steg 5–6 för att se byggstenarna.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <h1 className="serif-headline text-4xl mb-3">Utkast</h1>
        <p className="text-on-surface-variant text-sm italic font-light mb-6">Forma ditt innehåll.</p>

        <div className="flex gap-2 mb-6">
          {DRAFT_TEMPLATES.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTemplate(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${
                activeTemplate === t.key ? 'bg-primary text-white' : 'border border-outline-variant/40 text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {hasDraft && (
          <div className="mb-4 p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="label-xs text-on-surface-variant/60">Automatiskt utkast</p>
              <button
                onClick={() => handleDraftChange(generatedDraft)}
                className="text-[9px] uppercase tracking-widest text-primary font-semibold"
              >
                Använd
              </button>
            </div>
            <p className="text-xs text-on-surface-variant line-clamp-3 whitespace-pre-line">{generatedDraft}</p>
          </div>
        )}

        <textarea
          value={state.draft}
          onChange={e => handleDraftChange(e.target.value)}
          placeholder="Skriv ditt utkast här..."
          className="w-full border border-outline-variant/20 rounded-xl p-4 text-sm leading-relaxed resize-none focus:outline-none focus:border-primary/40 bg-surface-container-lowest"
          rows={12}
        />
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-on-surface-variant/40">{state.draft.length} tecken</span>
          <button onClick={() => copy(state.draft)} className="text-[10px] text-primary uppercase tracking-widest">Kopiera</button>
        </div>
      </div>
    </StepLayout>
  )
}
