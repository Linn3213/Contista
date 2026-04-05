import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'

type Hook = { id: string; text: string; category: string; language: string; sort_order: number }
type AdminTab = 'hooks'

const HOOK_CATEGORIES = ['educational', 'authority', 'myth_busting', 'storytelling', 'comparison', 'swedish']
const LANGUAGES = ['sv', 'en']

const ADMIN_EMAILS = ['linn@contista.se', 'admin@contista.se']

export default function AdminPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('hooks')
  const [hooks, setHooks] = useState<Hook[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('all')
  const [filterLang, setFilterLang] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [newHook, setNewHook] = useState({ text: '', category: 'educational', language: 'sv' })
  const [showNewForm, setShowNewForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Access check
  const isAdmin = user && (ADMIN_EMAILS.includes(user.email || '') || user.email?.endsWith('@contista.se'))

  useEffect(() => {
    if (!isAdmin) return
    loadHooks()
  }, [isAdmin, filterCat, filterLang])

  const loadHooks = async () => {
    setLoading(true)
    let q = supabase.from('hooks').select('*').order('sort_order').limit(100)
    if (filterCat !== 'all') q = q.eq('category', filterCat)
    if (filterLang !== 'all') q = q.eq('language', filterLang)
    const { data } = await q
    if (data) setHooks(data as Hook[])
    setLoading(false)
  }

  const startEdit = (hook: Hook) => {
    setEditingId(hook.id)
    setEditText(hook.text)
  }

  const saveEdit = async (id: string) => {
    setSaving(true)
    const { error } = await supabase.from('hooks').update({ text: editText }).eq('id', id)
    if (error) { showToast('Fel vid sparande'); setSaving(false); return }
    setHooks(prev => prev.map(h => h.id === id ? { ...h, text: editText } : h))
    setEditingId(null)
    setSaving(false)
    showToast('Hook uppdaterad ✓')
  }

  const deleteHook = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna hook?')) return
    setDeletingId(id)
    await supabase.from('hooks').delete().eq('id', id)
    setHooks(prev => prev.filter(h => h.id !== id))
    setDeletingId(null)
    showToast('Hook borttagen')
  }

  const createHook = async () => {
    if (!newHook.text.trim()) return
    setSaving(true)
    const { data, error } = await supabase
      .from('hooks')
      .insert({ text: newHook.text, category: newHook.category, language: newHook.language, sort_order: 9999 })
      .select()
      .single()
    if (error) { showToast('Fel vid skapande'); setSaving(false); return }
    setHooks(prev => [...prev, data as Hook])
    setNewHook({ text: '', category: 'educational', language: 'sv' })
    setShowNewForm(false)
    setSaving(false)
    showToast('Hook skapad ✓')
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-6 block">lock</span>
          <h1 className="serif-headline text-4xl italic mb-4">Begränsad åtkomst</h1>
          <p className="text-on-surface-variant mb-8">Du har inte behörighet att se den här sidan.</p>
          <button onClick={() => navigate('/')} className="btn-primary px-8 py-3">Gå tillbaka</button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="label-xs text-on-surface-variant/50 mb-3">Admin</p>
          <h1 className="serif-headline text-5xl italic leading-tight mb-3">Innehållshantering</h1>
          <p className="text-on-surface-variant font-light">Hantera hooks i databasen.</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 bg-surface-container-high rounded-full p-1 w-fit">
          {(['hooks'] as AdminTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${
                activeTab === tab ? 'bg-primary text-white' : 'text-on-surface-variant'
              }`}
            >
              Hooks
            </button>
          ))}
        </div>

        {activeTab === 'hooks' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm focus:outline-none focus:border-primary/40"
              >
                <option value="all">Alla kategorier</option>
                {HOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterLang}
                onChange={e => setFilterLang(e.target.value)}
                className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm focus:outline-none focus:border-primary/40"
              >
                <option value="all">Alla språk</option>
                {LANGUAGES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-[10px] uppercase tracking-widest font-semibold"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Ny hook
              </button>
            </div>

            {/* New hook form */}
            {showNewForm && (
              <div className="mb-6 p-6 bg-surface-container-low rounded-xl border border-primary/20">
                <h3 className="label-xs text-on-surface-variant/60 mb-4">Ny hook</h3>
                <textarea
                  value={newHook.text}
                  onChange={e => setNewHook(p => ({ ...p, text: e.target.value }))}
                  placeholder="Hook-text..."
                  className="w-full border border-outline-variant/20 rounded-xl p-4 text-sm resize-none mb-4 focus:outline-none focus:border-primary/40"
                  rows={3}
                />
                <div className="flex flex-wrap gap-3 mb-4">
                  <select
                    value={newHook.category}
                    onChange={e => setNewHook(p => ({ ...p, category: e.target.value }))}
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm focus:outline-none"
                  >
                    {HOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={newHook.language}
                    onChange={e => setNewHook(p => ({ ...p, language: e.target.value }))}
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm focus:outline-none"
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={createHook} disabled={saving} className="btn-primary px-6 py-2.5 text-sm">
                    {saving ? 'Sparar...' : 'Skapa'}
                  </button>
                  <button onClick={() => setShowNewForm(false)} className="px-6 py-2.5 border border-outline-variant/30 rounded-full text-sm">
                    Avbryt
                  </button>
                </div>
              </div>
            )}

            {/* Hooks list */}
            <div className="text-xs text-on-surface-variant/50 mb-3">{hooks.length} hooks</div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-surface-container-low rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {hooks.map(hook => (
                  <div
                    key={hook.id}
                    className="flex items-start gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 group"
                  >
                    <div className="flex-grow">
                      {editingId === hook.id ? (
                        <div>
                          <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            className="w-full border border-primary/30 rounded-lg p-3 text-sm resize-none focus:outline-none"
                            rows={3}
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => saveEdit(hook.id)} disabled={saving} className="px-4 py-1.5 bg-primary text-white rounded-full text-[10px] uppercase tracking-widest font-semibold">
                              {saving ? '...' : 'Spara'}
                            </button>
                            <button onClick={() => setEditingId(null)} className="px-4 py-1.5 border border-outline-variant/30 rounded-full text-[10px] uppercase tracking-widest">
                              Avbryt
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-on-surface leading-relaxed">{hook.text}</p>
                          <div className="flex gap-3 mt-1">
                            <span className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest">{hook.category}</span>
                            <span className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest">{hook.language.toUpperCase()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {editingId !== hook.id && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => startEdit(hook)}
                          className="p-2 hover:text-primary transition-colors"
                          title="Redigera"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => deleteHook(hook.id)}
                          disabled={deletingId === hook.id}
                          className="p-2 hover:text-red-500 transition-colors"
                          title="Ta bort"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  )
}
