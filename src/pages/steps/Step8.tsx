import { useState, useEffect } from 'react'
import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'
import { useClipboard } from '../../hooks/useClipboard'
import { useToast } from '../../contexts/ToastContext'
import { supabase } from '../../lib/supabase'

type CTA = { id: string; text: string; category: string }

type AIAnalysis = {
  score: number
  summary: string
  strengths: string[]
  improvements: string[]
  hookStrength: number
  ctaPresent: boolean
  audienceMatch: number
  error?: string
}

const REFINEMENT_TIPS = [
  { icon: 'format_bold',              label: 'Fet inledning',   tip: 'Gör de 3 första orden feta för att stoppa scrollandet.' },
  { icon: 'list',                     label: 'Punktlista',      tip: 'Bryt upp långa stycken med 3–5 korta punkter.' },
  { icon: 'add_circle',               label: 'Radbrytning',     tip: 'Lägg till luft. En tanke per rad ökar läsbarheten.' },
  { icon: 'psychology',               label: 'Emotionell krok', tip: 'Börja med ett problem din läsare känner igen.' },
]

function ScoreDot({ score, max = 10 }: { score: number; max?: number }) {
  const pct = (score / max) * 100
  const color = pct >= 80 ? 'text-accent-green' : pct >= 60 ? 'text-amber-500' : 'text-accent-rose'
  return (
    <span className={`serif-headline text-3xl italic font-bold ${color}`}>{score}<span className="text-base text-on-surface-variant/40">/{max}</span></span>
  )
}

export default function Step8() {
  const { state, update } = useCreator()
  const { copy } = useClipboard()
  const { showToast } = useToast()
  const [ctas, setCtas] = useState<CTA[]>([])
  const [activeTab, setActiveTab] = useState<'draft' | 'ai' | 'cta' | 'tips'>('draft')
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const charCount = state.draft?.length || 0
  const wordCount = state.draft?.trim().split(/\s+/).filter(Boolean).length || 0

  useEffect(() => {
    supabase
      .from('storytelling_structures')
      .select('id, text, category')
      .eq('category', 'cta')
      .order('sort_order')
      .limit(30)
      .then(({ data }) => { if (data) setCtas(data as CTA[]) })
  }, [])

  const analyzeContent = async () => {
    if (!state.draft?.trim()) { showToast('Skriv ett utkast först'); return }
    setAnalyzing(true)
    setActiveTab('ai')
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: {
          draft: state.draft,
          purpose: state.purpose,
          purposeSub: state.purposeSub,
          audience: state.dreamCustomerName || state.audience,
          tone: state.tone,
          insight: state.insight,
          dreamCustomer: state.dreamCustomerName ? {
            name: state.dreamCustomerName,
            answers: state.dreamCustomerAnswers,
          } : null,
        },
      })
      if (error) throw error
      setAnalysis(data as AIAnalysis)
    } catch (e) {
      showToast('AI-analys misslyckades')
      setAnalysis({ score: 0, summary: 'Analys misslyckades. Kontrollera att edge function är deployad.', strengths: [], improvements: [], hookStrength: 0, ctaPresent: false, audienceMatch: 0, error: String(e) })
    }
    setAnalyzing(false)
  }

  return (
    <StepLayout step={8} canContinue={!!state.draft} fullWidth>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-0 -mx-6 min-h-[70vh]">
        {/* Left nav */}
        <aside className="col-span-2 px-4 pt-2 border-r border-outline-variant/10">
          <p className="label-xs text-on-surface-variant/50 mb-6">Framsteg</p>
          <div className="h-[2px] bg-outline-variant mb-8">
            <div className="h-full bg-accent-green w-[88%]" />
          </div>
          <nav className="space-y-5">
            {['Koncept','Målgrupp','Tonläge','Research','Narrativ','Struktur','Utkast','Finjustering','Publicera'].map((name, i) => (
              <div key={name} className={`flex items-center gap-3 ${i === 7 ? 'text-accent-rose' : i < 7 ? 'opacity-30' : 'opacity-50'}`}>
                <span className="serif-headline text-base italic">{String(i+1).padStart(2,'0')}</span>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${i === 7 ? 'border-b border-accent-rose/30 pb-0.5 font-bold' : ''}`}>{name}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Center */}
        <section className="col-span-7 px-8 overflow-y-auto">
          <h2 className="serif-headline text-4xl mb-3">Finjustering</h2>
          <p className="text-on-surface-variant text-sm italic font-light mb-8">Polera. Analysera med AI. Lägg till CTA.</p>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-surface-container-high rounded-full p-1 w-fit">
            {(['draft', 'ai', 'cta', 'tips'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${
                  activeTab === tab ? 'bg-primary text-white' : 'text-on-surface-variant'
                }`}
              >
                {tab === 'draft' ? 'Redigera' : tab === 'ai' ? 'AI-analys' : tab === 'cta' ? 'CTA' : 'Tips'}
              </button>
            ))}
          </div>

          {/* Redigera */}
          {activeTab === 'draft' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="label-xs text-on-surface-variant/50">Ditt inlägg</label>
                <div className="flex gap-4 text-[10px] text-on-surface-variant/40">
                  <span>{charCount} tecken</span>
                  <span>{wordCount} ord</span>
                </div>
              </div>
              <textarea
                value={state.draft}
                onChange={e => update({ draft: e.target.value })}
                className="w-full border border-outline-variant/20 rounded-xl p-5 text-sm leading-relaxed resize-none focus:outline-none focus:border-primary/40 transition-colors bg-surface-container-lowest font-light"
                rows={16}
              />
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-grow h-1 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      charCount < 300 ? 'bg-accent-sage' : charCount < 1300 ? 'bg-accent-green' : charCount < 3000 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min((charCount / 3000) * 100, 100)}%` }}
                  />
                </div>
                <span className={`text-[10px] font-semibold ${
                  charCount < 300 ? 'text-accent-sage' : charCount < 1300 ? 'text-accent-green' : charCount < 3000 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {charCount < 300 ? 'Kort' : charCount < 1300 ? 'Optimal' : charCount < 3000 ? 'Lång' : 'Mycket lång'}
                </span>
              </div>
              <button
                onClick={analyzeContent}
                disabled={analyzing || !state.draft?.trim()}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium hover:border-primary/40 hover:text-primary transition-all disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                {analyzing ? 'Analyserar...' : 'Analysera med AI'}
              </button>
            </div>
          )}

          {/* AI-analys */}
          {activeTab === 'ai' && (
            <div>
              {!analysis && !analyzing && (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <p className="text-on-surface-variant/50 italic mb-6 text-sm">AI analyserar ditt utkast mot ditt mål och drömkund.</p>
                  <button
                    onClick={analyzeContent}
                    disabled={!state.draft?.trim()}
                    className="btn-primary px-8 py-3"
                  >
                    Starta analys
                  </button>
                </div>
              )}

              {analyzing && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <p className="text-on-surface-variant/60 italic text-sm">Analyserar mot ditt syfte och målgrupp...</p>
                </div>
              )}

              {analysis && !analyzing && (
                <div className="space-y-6">
                  {/* Context used */}
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {state.purpose && <span className="px-3 py-1 bg-surface-container-high rounded-full text-on-surface-variant/60 uppercase tracking-widest">{state.purpose}</span>}
                    {state.dreamCustomerName && <span className="px-3 py-1 bg-primary/10 rounded-full text-primary uppercase tracking-widest font-semibold">{state.dreamCustomerName}</span>}
                    {state.tone && <span className="px-3 py-1 bg-surface-container-high rounded-full text-on-surface-variant/60 uppercase tracking-widest">{state.tone}</span>}
                  </div>

                  {/* Score card */}
                  <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="label-xs text-on-surface-variant/50 mb-1">Övergripande betyg</p>
                        <ScoreDot score={analysis.score} />
                      </div>
                      <button onClick={analyzeContent} className="text-[9px] text-on-surface-variant/40 hover:text-primary uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Analysera igen
                      </button>
                    </div>
                    <p className="text-sm text-on-surface leading-relaxed italic">"{analysis.summary}"</p>
                  </div>

                  {/* Sub-scores */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Hook-styrka', score: analysis.hookStrength },
                      { label: 'Målgruppsmatch', score: analysis.audienceMatch },
                      { label: 'CTA', score: analysis.ctaPresent ? 10 : 3 },
                    ].map(s => (
                      <div key={s.label} className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 text-center">
                        <p className="label-xs text-on-surface-variant/50 mb-2">{s.label}</p>
                        <ScoreDot score={s.score} />
                      </div>
                    ))}
                  </div>

                  {/* Strengths */}
                  {analysis.strengths?.length > 0 && (
                    <div>
                      <p className="label-xs text-accent-green mb-3">Styrkor</p>
                      <div className="space-y-2">
                        {analysis.strengths.map((s, i) => (
                          <div key={i} className="flex gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                            <span className="material-symbols-outlined text-accent-green text-lg flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            <p className="text-sm leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements */}
                  {analysis.improvements?.length > 0 && (
                    <div>
                      <p className="label-xs text-accent-rose mb-3">Förbättringsförslag</p>
                      <div className="space-y-2">
                        {analysis.improvements.map((s, i) => (
                          <div key={i} className="flex gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                            <span className="material-symbols-outlined text-accent-rose text-lg flex-shrink-0 mt-0.5">tips_and_updates</span>
                            <p className="text-sm leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          {activeTab === 'cta' && (
            <div className="space-y-3">
              <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">En stark CTA avgör om ditt inlägg konverterar.</p>
              {ctas.map(cta => (
                <div
                  key={cta.id}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    state.selectedCTA === cta.id
                      ? 'border-primary/40 bg-primary/5 ring-2 ring-primary/20'
                      : 'border-outline-variant/20 bg-surface-container-lowest hover:border-outline-variant/40'
                  }`}
                  onClick={() => update({ selectedCTA: cta.id })}
                >
                  <p className="text-sm leading-relaxed">{cta.text}</p>
                  {state.selectedCTA === cta.id && (
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary/10">
                      <span className="text-[10px] text-primary font-semibold uppercase tracking-widest">✓ Vald</span>
                      <button
                        onClick={e => { e.stopPropagation(); update({ draft: state.draft + '\n\n' + cta.text }) }}
                        className="text-[10px] text-on-surface-variant hover:text-primary uppercase tracking-widest font-semibold"
                      >
                        Lägg till i utkast
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              {REFINEMENT_TIPS.map((tip, i) => (
                <div key={i} className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/10 flex gap-4">
                  <span className="material-symbols-outlined text-primary mt-0.5">{tip.icon}</span>
                  <div>
                    <p className="text-sm font-semibold mb-1">{tip.label}</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right preview */}
        <aside className="col-span-3 border-l border-outline-variant/10 px-6 pt-6">
          <p className="label-xs text-on-surface-variant/50 mb-6">Förhandsvisning</p>
          <div className="bg-surface shadow-editorial p-6 rounded-xl mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="serif-headline text-sm text-primary italic">L</span>
              </div>
              <div>
                <p className="text-xs font-semibold">Linn Lundholm</p>
                <p className="text-[10px] text-on-surface-variant/60">Content Creator</p>
              </div>
            </div>
            <div className="text-xs text-on-surface leading-relaxed whitespace-pre-line max-h-80 overflow-hidden">
              {state.draft || <span className="text-on-surface-variant/40 italic">Ditt inlägg visas här...</span>}
            </div>
          </div>

          {state.dreamCustomerName && (
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mb-4">
              <p className="label-xs text-primary mb-1">Riktat till</p>
              <p className="text-sm font-semibold">{state.dreamCustomerName}</p>
            </div>
          )}

          <button
            onClick={() => copy(state.draft)}
            disabled={!state.draft}
            className="w-full flex items-center justify-center gap-2 py-3 border border-outline-variant/30 rounded-full text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Kopiera
          </button>
        </aside>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <h1 className="serif-headline text-4xl mb-3">Finjustering</h1>
        <p className="text-on-surface-variant text-sm italic font-light mb-6">Polera & analysera.</p>

        <div className="flex gap-1 mb-6 bg-surface-container-high rounded-full p-1">
          {(['draft', 'ai', 'cta', 'tips'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-full text-[9px] uppercase tracking-widest font-semibold transition-all ${
                activeTab === tab ? 'bg-primary text-white' : 'text-on-surface-variant'
              }`}
            >
              {tab === 'draft' ? 'Edit' : tab === 'ai' ? 'AI' : tab === 'cta' ? 'CTA' : 'Tips'}
            </button>
          ))}
        </div>

        {activeTab === 'draft' && (
          <div>
            <textarea
              value={state.draft}
              onChange={e => update({ draft: e.target.value })}
              className="w-full border border-outline-variant/20 rounded-xl p-4 text-sm leading-relaxed resize-none focus:outline-none focus:border-primary/40 bg-surface-container-lowest"
              rows={12}
            />
            <div className="flex justify-between mt-2 mb-4">
              <span className="text-[10px] text-on-surface-variant/40">{charCount} tecken · {wordCount} ord</span>
              <button onClick={() => copy(state.draft)} className="text-[10px] text-primary uppercase tracking-widest">Kopiera</button>
            </div>
            <button onClick={analyzeContent} disabled={analyzing || !state.draft?.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm disabled:opacity-40">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              {analyzing ? 'Analyserar...' : 'Analysera med AI'}
            </button>
          </div>
        )}

        {activeTab === 'ai' && analysis && (
          <div className="space-y-4">
            <div className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
              <p className="label-xs text-on-surface-variant/50 mb-1">Betyg</p>
              <ScoreDot score={analysis.score} />
              <p className="text-sm mt-3 italic">"{analysis.summary}"</p>
            </div>
            {analysis.improvements?.map((s, i) => (
              <div key={i} className="flex gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-accent-rose text-lg flex-shrink-0">tips_and_updates</span>
                <p className="text-sm">{s}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && !analysis && (
          <div className="text-center py-12">
            <button onClick={analyzeContent} disabled={analyzing || !state.draft?.trim()} className="btn-primary px-8 py-3">
              {analyzing ? 'Analyserar...' : 'Starta AI-analys'}
            </button>
          </div>
        )}

        {activeTab === 'cta' && (
          <div className="space-y-3">
            {ctas.slice(0, 10).map(cta => (
              <div key={cta.id} className={`p-4 rounded-xl border cursor-pointer transition-all ${state.selectedCTA === cta.id ? 'border-primary/40 bg-primary/5' : 'border-outline-variant/20'}`} onClick={() => update({ selectedCTA: cta.id })}>
                <p className="text-sm">{cta.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-3">
            {REFINEMENT_TIPS.map((tip, i) => (
              <div key={i} className="p-4 bg-surface-container-lowest rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl">{tip.icon}</span>
                <div>
                  <p className="text-sm font-semibold mb-1">{tip.label}</p>
                  <p className="text-xs text-on-surface-variant">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StepLayout>
  )
}
