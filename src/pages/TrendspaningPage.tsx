import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

type Trend = {
  id: string
  user_id: string
  title: string
  description: string
  platform: string
  source: string
  is_admin: boolean
  tags: string[]
  created_at: string
}

function loadLocalTrends(userId: string): Trend[] {
  try {
    const raw = localStorage.getItem(`contista.trends.${userId}`)
    return raw ? (JSON.parse(raw) as Trend[]) : []
  } catch {
    return []
  }
}

function saveLocalTrends(userId: string, trends: Trend[]) {
  localStorage.setItem(`contista.trends.${userId}`, JSON.stringify(trends))
}

const PLATFORM_OPTIONS = ['instagram','tiktok','linkedin','youtube','pinterest','x','annat']

const PLATFORM_ICONS: Record<string, string> = {
  instagram: 'photo_camera',
  tiktok: 'music_note',
  linkedin: 'work',
  youtube: 'play_circle',
  pinterest: 'push_pin',
  x: 'tag',
  annat: 'language',
}

export default function TrendspaningPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTrend, setEditingTrend] = useState<Trend | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [localMode, setLocalMode] = useState(false)

  // Formulär
  const [formTitle, setFormTitle]           = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPlatform, setFormPlatform]     = useState('instagram')
  const [formSource, setFormSource]         = useState('')
  const [formTags, setFormTags]             = useState('')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data, error } = await supabase
        .from('trends')
        .select('*')
        .or(`user_id.eq.${user.id},is_admin.eq.true`)
        .order('created_at', { ascending: false })

      if (error) {
        setLocalMode(true)
        setTrends(loadLocalTrends(user.id))
        setLoading(false)
        return
      }

      setLocalMode(false)
      if (data) setTrends(data as Trend[])
      setLoading(false)
    }
    load()
  }, [user])

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormPlatform('instagram')
    setFormSource('')
    setFormTags('')
    setEditingTrend(null)
  }

  const openEdit = (trend: Trend) => {
    setEditingTrend(trend)
    setFormTitle(trend.title)
    setFormDescription(trend.description)
    setFormPlatform(trend.platform)
    setFormSource(trend.source || '')
    setFormTags(trend.tags?.join(', ') || '')
    setShowForm(true)
  }

  const saveTrend = async () => {
    if (!formTitle.trim() || !user) return
    setSaving(true)
    const payload = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      platform: formPlatform,
      source: formSource.trim(),
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
    }

    if (localMode) {
      if (editingTrend) {
        const updated = trends.map(t => t.id === editingTrend.id ? { ...t, ...payload } : t)
        setTrends(updated)
        saveLocalTrends(user.id, updated)
      } else {
        const created: Trend = {
          id: crypto.randomUUID(),
          user_id: user.id,
          title: payload.title,
          description: payload.description,
          platform: payload.platform,
          source: payload.source,
          tags: payload.tags,
          is_admin: false,
          created_at: new Date().toISOString(),
        }
        const updated = [created, ...trends]
        setTrends(updated)
        saveLocalTrends(user.id, updated)
      }
      showToast('Trend sparad lokalt ✓')
      setShowForm(false)
      resetForm()
      setSaving(false)
      return
    }

    if (editingTrend) {
      const { error } = await supabase
        .from('trends')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', editingTrend.id)
      if (!error) {
        setTrends(prev => prev.map(t =>
          t.id === editingTrend.id ? { ...t, ...payload } : t
        ))
        showToast('Trend uppdaterad ✓')
        setShowForm(false)
        resetForm()
      } else showToast('Kunde inte spara')
    } else {
      const { data, error } = await supabase
        .from('trends')
        .insert({ ...payload, user_id: user.id, is_admin: false })
        .select()
        .single()
      if (!error && data) {
        setTrends(prev => [data as Trend, ...prev])
        showToast('Trend sparad ✓')
        setShowForm(false)
        resetForm()
      } else showToast('Kunde inte spara')
    }
    setSaving(false)
  }

  const deleteTrend = async (id: string) => {
    if (!confirm('Ta bort denna trend?')) return
    if (localMode && user) {
      const updated = trends.filter(t => t.id !== id)
      setTrends(updated)
      saveLocalTrends(user.id, updated)
      showToast('Trend borttagen (lokalt)')
      return
    }
    await supabase.from('trends').delete().eq('id', id)
    setTrends(prev => prev.filter(t => t.id !== id))
    showToast('Trend borttagen')
  }

  const visibleTrends = filterPlatform === 'all'
    ? trends
    : trends.filter(t => t.platform === filterPlatform)

  const sendToCreator = (trend: Trend) => {
    if (!user) return
    const prefill = [trend.title, trend.description, trend.source ? `Källa: ${trend.source}` : '']
      .filter(Boolean)
      .join('\n\n')
    localStorage.setItem(`contista.prefill.freeThoughts.${user.id}`, prefill)
    showToast('Skickad till Contentskaparen ✓')
    navigate('/skapa')
  }

  const adminTrends = visibleTrends.filter(t => t.is_admin)
  const myTrends    = visibleTrends.filter(t => !t.is_admin && t.user_id === user?.id)

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-5 py-10">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="label-xs text-on-surface-variant/50 mb-2">Contista</p>
            <h1 className="serif-headline text-5xl italic leading-[1.1]">Trendspaning</h1>
            <p className="text-on-surface-variant text-base font-light mt-2 max-w-md">
              Samla signaler från marknaden. Välj trender som passar din strategi och gör dem till relevant content.
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(v => !v) }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Spara trend
          </button>
        </div>

        {localMode && (
          <div className="mb-5 p-3 rounded-xl border border-amber-200 bg-amber-50/40 text-amber-700 text-xs">
            Trendspaning körs i lokalt läge just nu. Dina trender sparas på den här enheten.
          </div>
        )}

        {/* ── Plattformsfilter ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar">
          <FilterChip label="Alla" active={filterPlatform === 'all'} onClick={() => setFilterPlatform('all')} />
          {PLATFORM_OPTIONS.map(p => (
            <FilterChip
              key={p}
              label={p.charAt(0).toUpperCase() + p.slice(1)}
              active={filterPlatform === p}
              onClick={() => setFilterPlatform(p)}
            />
          ))}
        </div>

        {/* ── Formulär ── */}
        {showForm && (
          <div className="bg-surface rounded-3xl border border-outline-variant/20 p-5 mb-6 space-y-3">
            <h3 className="text-sm font-semibold text-on-surface">
              {editingTrend ? 'Redigera trend' : 'Spara ny trend'}
            </h3>
            <input
              type="text"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="Trend-titel *"
              className="w-full text-sm border-b border-outline-variant/30 pb-2 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30"
            />
            <textarea
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              placeholder="Beskrivning. Vad är trenden och varför är den viktig för din målgrupp?"
              className="w-full min-h-[100px] text-sm text-on-surface resize-none placeholder:text-on-surface-variant/30 leading-relaxed border-b border-outline-variant/30 pb-2 focus:border-primary"
            />
            {/* Plattform */}
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormPlatform(p)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-all capitalize
                    ${formPlatform === p
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
                    }`}
                >
                  <span className="material-symbols-outlined text-[12px]">{PLATFORM_ICONS[p]}</span>
                  {p}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formSource}
              onChange={e => setFormSource(e.target.value)}
              placeholder="Källa (länk, konto eller namn)"
              className="w-full text-sm border-b border-outline-variant/30 pb-2 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30"
            />
            <input
              type="text"
              value={formTags}
              onChange={e => setFormTags(e.target.value)}
              placeholder="Taggar (kommaseparerade): reels, hooks, storytelling"
              className="w-full text-sm border-b border-outline-variant/30 pb-2 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={saveTrend}
                disabled={saving || !formTitle.trim()}
                className="flex-1 py-2.5 bg-primary text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-40 transition-all"
              >
                {saving ? 'Sparar...' : editingTrend ? 'Uppdatera' : 'Spara trend'}
              </button>
              <button
                onClick={() => { setShowForm(false); resetForm() }}
                className="px-4 py-2.5 border border-outline-variant/40 rounded-full text-xs font-semibold text-on-surface-variant hover:border-primary/40 transition-all"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-on-surface text-sm text-center py-10">Laddar...</p>
        )}

        {/* ── Admin-flöde ── */}
        {adminTrends.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface">
                Från Contista ({adminTrends.length})
              </h2>
            </div>
            <div className="space-y-3">
              {adminTrends.map(t => (
                <TrendCard key={t.id} trend={t} isOwn={false} onEdit={() => {}} onDelete={() => {}} onUse={() => sendToCreator(t)} />
              ))}
            </div>
          </div>
        )}

        {/* ── Mina trender ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-[16px]">person</span>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface">
              Mina sparade trender ({myTrends.length})
            </h2>
          </div>
          {myTrends.length === 0 && !loading && (
            <div className="text-center py-12 bg-surface rounded-3xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 block mb-3">trending_up</span>
              <p className="text-on-surface text-sm">
                Du har inga sparade trender ännu.<br />Tryck på "Spara trend" för att lägga till.
              </p>
            </div>
          )}
          <div className="space-y-3">
            {myTrends.map(t => (
              <TrendCard
                key={t.id}
                trend={t}
                isOwn
                onEdit={() => openEdit(t)}
                onDelete={() => deleteTrend(t.id)}
                onUse={() => sendToCreator(t)}
              />
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

/* ── Trend-kort ── */
function TrendCard({
  trend, isOwn, onEdit, onDelete, onUse,
}: {
  trend: Trend
  isOwn: boolean
  onEdit: () => void
  onDelete: () => void
  onUse: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-5 py-4 hover:bg-outline-variant/5 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="material-symbols-outlined text-[14px] text-on-surface-variant/50"
              >
                {PLATFORM_ICONS[trend.platform] || 'language'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 capitalize">
                {trend.platform}
              </span>
              {trend.is_admin && (
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-wider">Contista</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-on-surface">{trend.title}</h3>
          </div>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant/30 shrink-0 mt-0.5">
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-outline-variant/10">
          {trend.description && (
            <p className="text-sm text-on-surface-variant leading-relaxed mt-3 mb-3">{trend.description}</p>
          )}
          {trend.source && (
            <p className="text-xs text-on-surface-variant/50 mb-3">
              <span className="font-medium">Källa:</span> {trend.source}
            </p>
          )}
          {trend.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {trend.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">#{tag}</span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-on-surface-variant/30 mb-3">
            {new Date(trend.created_at).toLocaleDateString('sv-SE')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onUse}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/70 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              Använd i Contentskaparen
            </button>
          </div>

          {isOwn && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                Redigera
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                Ta bort
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Filterknapp ── */
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-1.5 rounded-full border text-xs transition-all
        ${active
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
        }`}
    >
      {label}
    </button>
  )
}
