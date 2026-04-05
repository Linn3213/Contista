import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useClipboard } from '../hooks/useClipboard'

type CTA = { id: string; text: string; category: string; sort_order: number }
type CTATip = { id: string; text: string; category: string; sort_order: number }

const CTA_CATEGORIES = [
  { key: 'all', label: 'Alla' },
  { key: 'engagement', label: 'Engagemang' },
  { key: 'comment', label: 'Kommentar' },
  { key: 'save', label: 'Spara' },
  { key: 'share', label: 'Dela' },
  { key: 'follow', label: 'Följ' },
  { key: 'dm', label: 'DM' },
  { key: 'link', label: 'Länk' },
]

export default function CTAsPage() {
  const { copy } = useClipboard()
  const [ctas, setCtas] = useState<CTA[]>([])
  const [tips, setTips] = useState<CTATip[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'ctas' | 'tips'>('ctas')

  useEffect(() => {
    const load = async () => {
      const [{ data: ctaData }, { data: tipData }] = await Promise.all([
        supabase.from('storytelling_structures').select('*').eq('category', 'cta').order('sort_order'),
        supabase.from('storytelling_structures').select('*').eq('category', 'cta_tip').order('sort_order'),
      ])
      if (ctaData) setCtas(ctaData as CTA[])
      if (tipData) setTips(tipData as CTATip[])
      setLoading(false)
    }
    load()
  }, [])

  const handleCopy = (id: string, text: string) => {
    copy(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredCtas = ctas.filter(c => {
    const matchCat = activeCategory === 'all' || c.category === activeCategory || c.text.toLowerCase().includes(activeCategory)
    const matchSearch = !search || c.text.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="label-xs text-on-surface-variant/50 mb-3">Innehållsbibliotek</p>
          <h1 className="serif-headline text-5xl md:text-6xl italic leading-[1.1] mb-4">Call to Action</h1>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed max-w-xl">
            Välj en CTA som avslutar ditt inlägg med intention. Kopiera direkt till ditt utkast.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 bg-surface-container-high rounded-full p-1 w-fit">
          {(['ctas', 'tips'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${
                activeTab === tab ? 'bg-primary text-white' : 'text-on-surface-variant'
              }`}
            >
              {tab === 'ctas' ? 'CTAs' : 'Tips & Tekniker'}
            </button>
          ))}
        </div>

        {activeTab === 'ctas' && (
          <>
            {/* Search */}
            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl">search</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Sök CTA..."
                className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-8">
              {CTA_CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${
                    activeCategory === cat.key
                      ? 'bg-primary text-white'
                      : 'border border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-surface-container-low rounded-xl p-6 animate-pulse h-20" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCtas.length === 0 && (
                  <p className="text-on-surface-variant/40 italic text-sm py-8 text-center">Inga CTAs hittades.</p>
                )}
                {filteredCtas.map(cta => (
                  <div
                    key={cta.id}
                    className="group flex items-start gap-4 p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-card transition-all cursor-pointer"
                    onClick={() => handleCopy(cta.id, cta.text)}
                  >
                    <div className="flex-grow">
                      <p className="text-sm text-on-surface leading-relaxed">{cta.text}</p>
                    </div>
                    <button
                      className={`flex-shrink-0 flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-semibold transition-all mt-0.5 ${
                        copiedId === cta.id ? 'text-accent-green' : 'text-on-surface-variant/50 group-hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedId === cta.id ? 'check' : 'content_copy'}
                      </span>
                      {copiedId === cta.id ? 'Kopierat' : 'Kopiera'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            {tips.length === 0 && !loading && (
              <p className="text-on-surface-variant/40 italic text-sm py-8 text-center">Inga tips tillgängliga.</p>
            )}
            {tips.map((tip, i) => (
              <div key={tip.id} className="flex gap-4 p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="serif-headline text-sm italic text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-on-surface leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
