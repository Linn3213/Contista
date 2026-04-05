import { useEffect, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import { supabase, Hook } from '../lib/supabase'
import { useClipboard } from '../hooks/useClipboard'

const CATEGORIES = [
  { key: 'all', label: 'Alla' },
  { key: 'swedish', label: 'Svenska' },
  { key: 'educational', label: 'Utbildning' },
  { key: 'comparison', label: 'Jämförelse' },
  { key: 'myth_busting', label: 'Mytsläckning' },
  { key: 'storytelling', label: 'Berättelse' },
  { key: 'authority', label: 'Auktoritet' },
  { key: 'random', label: 'Slumpmässig' },
]

const PAGE_SIZE = 40

export default function HooksPage() {
  const { copy } = useClipboard()
  const [hooks, setHooks] = useState<Hook[]>([])
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState('all')
  const [language, setLanguage] = useState<'all' | 'sv' | 'en'>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [counts, setCounts] = useState<Record<string, number>>({})

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  // Reset page on filter change
  useEffect(() => { setPage(0) }, [category, language, debouncedSearch])

  // Fetch counts per category
  useEffect(() => {
    const fetchCounts = async () => {
      const { data } = await supabase
        .from('hooks')
        .select('category')
      if (data) {
        const c: Record<string, number> = { all: data.length }
        data.forEach((h: { category: string }) => {
          c[h.category] = (c[h.category] || 0) + 1
        })
        setCounts(c)
      }
    }
    fetchCounts()
  }, [])

  const fetchHooks = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('hooks')
      .select('*', { count: 'exact' })
      .order('sort_order')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (category !== 'all') q = q.eq('category', category)
    if (language !== 'all') q = q.eq('language', language)
    if (debouncedSearch) q = q.ilike('text', `%${debouncedSearch}%`)

    const { data, count } = await q
    setHooks(prev => page === 0 ? (data || []) : [...prev, ...(data || [])])
    setTotal(count || 0)
    setLoading(false)
  }, [category, language, debouncedSearch, page])

  useEffect(() => { fetchHooks() }, [fetchHooks])

  const randomHook = () => {
    if (hooks.length === 0) return
    const h = hooks[Math.floor(Math.random() * hooks.length)]
    copy(h.text)
  }

  const categoryColor = (cat: string) => {
    const map: Record<string, string> = {
      swedish: 'bg-accent-rose/10 text-accent-rose',
      educational: 'bg-tertiary/10 text-tertiary',
      comparison: 'bg-secondary/20 text-on-surface-variant',
      myth_busting: 'bg-primary/10 text-primary',
      storytelling: 'bg-surface-container-highest text-on-surface-variant',
      authority: 'bg-accent-green/10 text-accent-green',
      random: 'bg-surface-dim text-on-surface-variant',
    }
    return map[cat] || 'bg-surface-container text-on-surface-variant'
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4">
        {/* Header */}
        <div className="mb-10">
          <p className="label-xs text-primary/70 mb-3">Bibliotek</p>
          <h1 className="serif-headline text-4xl md:text-5xl mb-3">Hooks Bibliotek</h1>
          <p className="text-sm text-on-surface-variant">
            {total.toLocaleString()} hooks för att stoppa scrollandet
          </p>
        </div>

        {/* Language + Random row */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex bg-surface-container-high rounded-full p-1 gap-1">
            {([['all', 'Alla'], ['sv', 'Svenska'], ['en', 'Engelska']] as const).map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setLanguage(val)}
                className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-semibold transition-all ${
                  language === val ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <button
            onClick={randomHook}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full border border-outline-variant/40 text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
          >
            <span className="material-symbols-outlined text-sm">casino</span>
            Slumpa
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Sök bland hooks..."
            className="w-full bg-surface-container-highest/50 rounded-full pl-11 pr-10 py-3 text-sm border border-transparent focus:border-primary/30 transition-colors placeholder-on-surface-variant/40"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.12em] font-semibold transition-all ${
                category === c.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:border-primary/30 hover:text-primary'
              }`}
            >
              {c.label}
              {counts[c.key] && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  category === c.key ? 'bg-white/20' : 'bg-surface-container'
                }`}>
                  {counts[c.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Hooks list */}
      <div className="max-w-3xl mx-auto px-6">
        {loading && page === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface-container-low rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-surface-container-high rounded w-3/4 mb-2" />
                <div className="h-3 bg-surface-container-high rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : hooks.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 block mb-4">search_off</span>
            <p className="text-on-surface-variant text-sm">Inga hooks hittades</p>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {hooks.map(hook => (
              <div
                key={hook.id}
                className="bg-surface-container-lowest rounded-xl p-5 border border-black/5 group hover:shadow-editorial transition-all duration-300"
              >
                <p className="text-sm text-on-surface leading-relaxed mb-4">{hook.text}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full ${categoryColor(hook.category)}`}>
                    {hook.category.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => copy(hook.text)}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Kopiera
                  </button>
                </div>
              </div>
            ))}

            {/* Load more */}
            {hooks.length < total && (
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
                className="w-full py-4 mt-4 border border-dashed border-outline-variant text-on-surface-variant text-[11px] uppercase tracking-[0.2em] rounded-xl hover:border-primary hover:text-primary transition-all disabled:opacity-50"
              >
                {loading ? 'Laddar...' : `Ladda fler (${total - hooks.length} kvar)`}
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
