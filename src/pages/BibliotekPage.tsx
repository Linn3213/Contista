import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useClipboard } from '../hooks/useClipboard'
import { useToast } from '../contexts/ToastContext'

/* ─── Types ─────────────────────────────────────────────── */
type Post = {
  id: string; user_id: string; title: string | null; content: string
  platform: string; status: 'draft' | 'idea' | 'published' | 'scheduled'
  purpose: string | null; audience: string | null; tone: string | null
  scheduled_date: string | null; tags: string[]; created_at: string; updated_at: string
}
type Tab = 'oversikt' | 'kategorier' | 'texter' | 'ideer' | 'kalender' | 'anteckningar'
type LibraryCategory = 'hooks' | 'captions' | 'ctas' | 'texter' | 'bilder' | 'videos' | 'qa' | 'anteckningsblock'
type LibraryEntry = { id: string; text: string; created_at: string }

const LIBRARY_CATEGORIES: { id: LibraryCategory; label: string; icon: string; hint: string }[] = [
  { id: 'hooks', label: 'Hooks', icon: 'tag', hint: 'Krokar och öppningar' },
  { id: 'captions', label: 'Captions', icon: 'format_quote', hint: 'Bildtexter' },
  { id: 'ctas', label: 'CTAs', icon: 'ads_click', hint: 'Call to action' },
  { id: 'texter', label: 'Texter', icon: 'article', hint: 'Längre texter' },
  { id: 'bilder', label: 'Bilder', icon: 'image', hint: 'Bildidéer / filer' },
  { id: 'videos', label: 'Videos', icon: 'movie', hint: 'Videoidéer / filer' },
  { id: 'qa', label: 'Q&A', icon: 'help', hint: 'Frågor & svar' },
  { id: 'anteckningsblock', label: 'Anteckningsblock', icon: 'edit_note', hint: 'Gemensamma anteckningar' },
]

const PLATFORMS = [
  { key: 'linkedin', icon: 'work', label: 'LinkedIn' },
  { key: 'instagram', icon: 'photo_camera', label: 'Instagram' },
  { key: 'facebook', icon: 'thumb_up', label: 'Facebook' },
  { key: 'email', icon: 'email', label: 'Email' },
]

const STATUS_META = {
  draft:     { label: 'Utkast',     color: 'bg-amber-100 text-amber-700' },
  idea:      { label: 'Idé',        color: 'bg-blue-100 text-blue-700' },
  published: { label: 'Publicerad', color: 'bg-green-100 text-green-700' },
  scheduled: { label: 'Schemalagd', color: 'bg-purple-100 text-purple-700' },
}

function getPostDisplayText(post: Pick<Post, 'title' | 'content'>) {
  const content = (post.content || '').trim()
  if (content) return content
  const title = (post.title || '').trim()
  if (title) return title
  return 'Tom idé – öppna kortet och lägg till text.'
}

function isMeaningfulPost(post: Pick<Post, 'title' | 'content'>) {
  return Boolean((post.content || '').trim() || (post.title || '').trim())
}

/* ─── Calendar helpers ──────────────────────────────────── */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
const MONTHS_SV = ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December']
const DAYS_SV   = ['Mån','Tis','Ons','Tor','Fre','Lör','Sön']

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function BibliotekPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { copy } = useClipboard()
  const { showToast } = useToast()

  const [tab, setTab] = useState<Tab>('oversikt')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // New post form state
  const [formContent, setFormContent] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formStatus, setFormStatus] = useState<Post['status']>('idea')
  const [formPlatform, setFormPlatform] = useState('linkedin')
  const [formDate, setFormDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [sharedNotes, setSharedNotes] = useState('')
  const [quickIdeaText, setQuickIdeaText] = useState('')
  const [quickTextDraft, setQuickTextDraft] = useState('')
  const [notesTimer, setNotesTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory>('hooks')
  const [libraryEntries, setLibraryEntries] = useState<Record<LibraryCategory, LibraryEntry[]>>({
    hooks: [], captions: [], ctas: [], texter: [], bilder: [], videos: [], qa: [], anteckningsblock: [],
  })
  const [newCategoryText, setNewCategoryText] = useState('')

  useEffect(() => {
    if (!user) return
    supabase
      .from('saved_posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data as Post[])
        setLoading(false)
      })

    const notes = localStorage.getItem(`contista.shared.notes.${user.id}`)
    if (notes) setSharedNotes(notes)

    const lib = localStorage.getItem(`contista.library.categories.${user.id}`)
    if (lib) {
      try {
        const parsed = JSON.parse(lib)
        setLibraryEntries(prev => ({ ...prev, ...parsed }))
      } catch {
        // ignore corrupt local data
      }
    }
  }, [user])

  const handleSharedNotes = (val: string) => {
    setSharedNotes(val)
    if (notesTimer) clearTimeout(notesTimer)
    const timer = setTimeout(() => {
      if (user) localStorage.setItem(`contista.shared.notes.${user.id}`, val)
    }, 600)
    setNotesTimer(timer)
  }

  const persistLibrary = (next: Record<LibraryCategory, LibraryEntry[]>) => {
    setLibraryEntries(next)
    if (user) localStorage.setItem(`contista.library.categories.${user.id}`, JSON.stringify(next))
  }

  const addLibraryEntry = () => {
    const text = newCategoryText.trim()
    if (!text) return
    const entry: LibraryEntry = { id: crypto.randomUUID(), text, created_at: new Date().toISOString() }
    const next = {
      ...libraryEntries,
      [selectedCategory]: [entry, ...libraryEntries[selectedCategory]],
    }
    persistLibrary(next)
    setNewCategoryText('')
    showToast('Sparat i biblioteket ✓')
  }

  const addLibraryFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (selectedCategory !== 'bilder' && selectedCategory !== 'videos') return

    const now = new Date().toISOString()
    const newEntries: LibraryEntry[] = Array.from(files).map(file => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
      return {
        id: crypto.randomUUID(),
        text: `${file.name} (${sizeMb} MB)`,
        created_at: now,
      }
    })

    const next = {
      ...libraryEntries,
      [selectedCategory]: [...newEntries, ...libraryEntries[selectedCategory]],
    }
    persistLibrary(next)
    showToast(`${newEntries.length} fil(er) tillagda ✓`)
  }

  const deleteLibraryEntry = (category: LibraryCategory, id: string) => {
    const next = {
      ...libraryEntries,
      [category]: libraryEntries[category].filter(e => e.id !== id),
    }
    persistLibrary(next)
    showToast('Borttagen')
  }

  const resetForm = () => {
    setFormContent(''); setFormTitle(''); setFormStatus('idea')
    setFormPlatform('linkedin'); setFormDate(''); setEditingPost(null)
  }

  const openNewPost = (status: Post['status'] = 'idea', date?: string) => {
    resetForm()
    setFormStatus(status)
    if (date) setFormDate(date)
    setShowPostForm(true)
  }

  const openEdit = (p: Post) => {
    setEditingPost(p)
    setFormContent(p.content); setFormTitle(p.title || '')
    setFormStatus(p.status); setFormPlatform(p.platform)
    setFormDate(p.scheduled_date || '')
    setShowPostForm(true)
  }

  const savePost = async () => {
    if (!user || !formContent.trim()) return
    setSaving(true)
    const payload = {
      user_id: user.id,
      title: formTitle || null,
      content: formContent,
      platform: formPlatform,
      status: formStatus,
      scheduled_date: formDate || null,
    }
    if (editingPost) {
      const { data } = await supabase.from('saved_posts').update(payload).eq('id', editingPost.id).select().single()
      if (data) setPosts(prev => prev.map(p => p.id === editingPost.id ? data as Post : p))
      showToast('Uppdaterad ✓')
    } else {
      const { data } = await supabase.from('saved_posts').insert(payload).select().single()
      if (data) setPosts(prev => [data as Post, ...prev])
      showToast('Sparad ✓')
    }
    setSaving(false); setShowPostForm(false); resetForm()
  }

  const deletePost = async (id: string) => {
    if (!confirm('Ta bort detta inlägg?')) return
    await supabase.from('saved_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
    showToast('Borttagen')
  }

  const updateStatus = async (id: string, status: Post['status']) => {
    await supabase.from('saved_posts').update({ status }).eq('id', id)
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    showToast(`Markerad som ${STATUS_META[status].label}`)
  }

  const quickCreatePost = async (status: Post['status'], content: string) => {
    if (!user || !content.trim()) return
    const payload = {
      user_id: user.id,
      title: null,
      content: content.trim(),
      platform: 'instagram',
      status,
      scheduled_date: null,
    }
    const { data } = await supabase.from('saved_posts').insert(payload).select().single()
    if (data) {
      setPosts(prev => [data as Post, ...prev])
      showToast(status === 'idea' ? 'Idé sparad ✓' : 'Utkast sparat ✓')
    }
  }

  const ideas = posts.filter(p => p.status === 'idea' && isMeaningfulPost(p))
  const drafts = posts.filter(p => p.status === 'draft')
  const published = posts.filter(p => p.status === 'published')
  const scheduled = posts.filter(p => p.status === 'scheduled')

  const filteredPosts = filterStatus === 'all' ? posts : posts.filter(p => p.status === filterStatus)
  const filteredTextPosts = filteredPosts.filter(p => p.status !== 'idea' && isMeaningfulPost(p))
  const textPosts = posts.filter(p => p.status !== 'idea' && isMeaningfulPost(p))

  // Calendar: posts keyed by date
  const postsByDate: Record<string, Post[]> = {}
  posts.filter(p => p.scheduled_date).forEach(p => {
    const key = p.scheduled_date!
    if (!postsByDate[key]) postsByDate[key] = []
    postsByDate[key].push(p)
  })

  return (
    <Layout>
      {/* Post form modal */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-0 md:px-6">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => { setShowPostForm(false); resetForm() }} />
          <div className="relative bg-background rounded-t-3xl md:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl z-10">
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="serif-headline text-2xl">{editingPost ? 'Redigera' : formStatus === 'idea' ? 'Ny idé' : 'Nytt inlägg'}</h3>
              <button onClick={() => { setShowPostForm(false); resetForm() }} className="material-symbols-outlined text-on-surface-variant">close</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex gap-2">
                {(['idea', 'draft', 'published', 'scheduled'] as Post['status'][]).map(s => (
                  <button key={s} onClick={() => setFormStatus(s)}
                    className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${formStatus === s ? 'bg-primary text-white' : 'border border-outline-variant/30 text-on-surface-variant'}`}>
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
              {/* Title */}
              <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)}
                placeholder="Rubrik (valfri)..."
                className="w-full border-b border-outline-variant/20 focus:border-primary/40 outline-none py-2 text-sm bg-transparent" />
              {/* Content */}
              <textarea value={formContent} onChange={e => setFormContent(e.target.value)}
                placeholder={formStatus === 'idea' ? 'Din idé, tanke eller inspo...' : 'Skriv ditt inlägg...'}
                className="w-full border border-outline-variant/20 rounded-xl p-4 text-sm leading-relaxed resize-none focus:outline-none focus:border-primary/40 bg-surface-container-lowest"
                rows={formStatus === 'idea' ? 5 : 10} />
              <div className="flex gap-2 text-[10px] text-on-surface-variant/40 -mt-3">
                <span>{formContent.length} tecken</span>
                <span>·</span>
                <span>{formContent.trim().split(/\s+/).filter(Boolean).length} ord</span>
              </div>
              {/* Platform */}
              <div>
                <p className="label-xs text-on-surface-variant/50 mb-3">Plattform</p>
                <div className="flex gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p.key} onClick={() => setFormPlatform(p.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${formPlatform === p.key ? 'bg-primary text-white' : 'border border-outline-variant/30 text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-sm">{p.icon}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Date for scheduled */}
              {(formStatus === 'scheduled' || formDate) && (
                <div>
                  <p className="label-xs text-on-surface-variant/50 mb-2">Publiceringsdatum</p>
                  <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)}
                    className="border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40" />
                </div>
              )}
              <button onClick={savePost} disabled={saving || !formContent.trim()} className="btn-primary w-full py-4 disabled:opacity-40">
                {saving ? 'Sparar...' : editingPost ? 'Spara ändringar' : 'Spara'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab nav ── */}
      <div className="sticky top-[73px] z-30 bg-background/95 backdrop-blur-md border-b border-outline-variant/10 px-6">
        <div className="max-w-4xl mx-auto flex gap-0 overflow-x-auto no-scrollbar">
          {([
            { key: 'oversikt', label: 'Översikt',  icon: 'home' },
            { key: 'kategorier', label: 'Kategorier', icon: 'category' },
            { key: 'texter',   label: 'Mina texter', icon: 'article' },
            { key: 'ideer',    label: 'Idéer',      icon: 'lightbulb' },
            { key: 'kalender', label: 'Kalender',   icon: 'calendar_month' },
            { key: 'anteckningar', label: 'Anteckningar', icon: 'edit_note' },
          ] as { key: Tab; label: string; icon: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-[11px] uppercase tracking-widest font-semibold border-b-2 transition-all whitespace-nowrap ${
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant/60 hover:text-on-surface-variant'
              }`}>
              <span className="material-symbols-outlined text-base" style={tab === t.key ? { fontVariationSettings: "'FILL' 1" } : {}}>{t.icon}</span>
              {t.label}
              {t.key === 'ideer' && ideas.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-white text-[8px] flex items-center justify-center">{ideas.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          TAB: ÖVERSIKT
      ══════════════════════════════════════ */}
      {tab === 'oversikt' && (
        <div className="no-scrollbar" style={{ scrollSnapType: 'y proximity', overflowY: 'auto', height: 'calc(100dvh - 137px)' }}>

          {/* SECTION 1 – Hero */}
          <section className="snap-section px-8 pt-4">
            <div className="max-w-md mx-auto text-center space-y-6">
              <p className="label-xs text-primary/80">Din strategi</p>
              <h2 className="serif-headline text-5xl md:text-6xl leading-[1.1] tracking-tight">
                Bibliotek för{' '}<span className="italic text-primary">Innehåll.</span>
              </h2>
              <p className="text-on-surface-variant leading-relaxed text-sm max-w-xs mx-auto">
                Din strategiska grund. Identitet, drömkund och innehållspelare — samlat på ett ställe.
              </p>
              <p className="text-xs text-on-surface-variant/70 leading-relaxed max-w-sm mx-auto">
                Scrolla ner genom minikursen och lär dig vad bra content är, varför du skapar det,
                och exakt hur varje del av Contista hjälper dig att bygga innehåll som leder till resultat.
              </p>
              <div className="pt-6 animate-bounce">
                <span className="material-symbols-outlined opacity-30 text-on-surface">keyboard_double_arrow_down</span>
              </div>
            </div>
          </section>

          {/* SECTION 2 – Vad Content Är */}
          <section className="snap-section px-6 py-12">
            <div className="max-w-lg mx-auto">
              <p className="label-xs text-on-surface-variant/50 mb-4">01 / Grunden</p>
              <div className="bg-surface-container-lowest rounded-card p-6 border border-black/5 space-y-4">
                <h3 className="serif-headline text-3xl">Vad är content?</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Content är kommunikation som hjälper din drömkund att gå från ett problem till ett önskat läge.
                  Bra content är användbart, relevant och kopplat till ett tydligt syfte.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Fångar uppmärksamhet med tydlig vinkel',
                    'Bygger förtroende med konkret värde',
                    'Visar expertis genom exempel',
                    'Leder vidare till handling',
                  ].map(point => (
                    <div key={point} className="rounded-xl border border-outline-variant/20 px-3 py-2 text-xs text-on-surface-variant bg-background">
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 – Syftet Med Bra Content */}
          <section className="snap-section px-6 py-12">
            <div className="max-w-lg mx-auto">
              <p className="label-xs text-on-surface-variant/50 mb-4">02 / Syfte</p>
              <div className="bg-surface-container-lowest rounded-card p-6 border border-black/5 space-y-4">
                <h3 className="serif-headline text-3xl">Vad gör content bra?</h3>
                <div className="space-y-3 text-sm text-on-surface-variant">
                  <p><span className="text-on-surface font-medium">Tydlighet:</span> Läsaren ska förstå poängen inom några sekunder.</p>
                  <p><span className="text-on-surface font-medium">Relevans:</span> Inlägget svarar på ett verkligt behov hos rätt person.</p>
                  <p><span className="text-on-surface font-medium">Djup:</span> Du förklarar varför det fungerar, inte bara vad man ska göra.</p>
                  <p><span className="text-on-surface font-medium">Riktning:</span> Inlägget leder till ett tydligt nästa steg.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-on-surface-variant">
                  <div className="rounded-xl border border-outline-variant/20 px-3 py-2 bg-background">
                    <p className="font-semibold text-on-surface mb-1">Före</p>
                    <p>Läsaren känner problem men saknar språk för det.</p>
                  </div>
                  <div className="rounded-xl border border-outline-variant/20 px-3 py-2 bg-background">
                    <p className="font-semibold text-on-surface mb-1">Under</p>
                    <p>Du sätter ord på problemet och visar en väg framåt.</p>
                  </div>
                  <div className="rounded-xl border border-outline-variant/20 px-3 py-2 bg-background">
                    <p className="font-semibold text-on-surface mb-1">Efter</p>
                    <p>Läsaren vet vad nästa steg är och varför det är rätt.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/skapa/1')}
                  className="w-full py-3 bg-primary text-white rounded-full label-xs tracking-[0.15em] hover:opacity-90 transition-opacity"
                >
                  Starta Contentskaparen
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4 – Appens Delar */}
          <section className="snap-section px-6 py-12">
            <div className="max-w-lg mx-auto">
              <p className="label-xs text-on-surface-variant/50 mb-4">03 / Appguide</p>
              <div className="space-y-3">
                {[
                  {
                    icon: 'edit_square',
                    title: 'Contentskaparen',
                    text: 'Din produktionsmotor. Här förvandlar du en idé till publicerbart content med tydlig struktur, riktning och CTA.',
                    action: () => navigate('/skapa/1'),
                    cta: 'Öppna Contentskaparen',
                  },
                  {
                    icon: 'strategy',
                    title: 'Contentstrategi',
                    text: 'Din riktning. Här bestämmer du vad du vill äga i marknaden och vilka pelare som ska bära allt content.',
                    action: () => navigate('/strategi'),
                    cta: 'Öppna Contentstrategi',
                  },
                  {
                    icon: 'person_search',
                    title: 'Drömkund',
                    text: 'Din precision. Här gör du målgruppen konkret så att ditt språk känns personligt och träffsäkert.',
                    action: () => navigate('/dreamcustomer'),
                    cta: 'Öppna Drömkund',
                  },
                  {
                    icon: 'calendar_month',
                    title: 'Kalender',
                    text: 'Din konsekvens. Här planerar du publicering så att strategin faktiskt blir genomförd vecka för vecka.',
                    action: () => setTab('kalender'),
                    cta: 'Till Kalender',
                  },
                  {
                    icon: 'library_books',
                    title: 'Bibliotek',
                    text: 'Din kunskapsbank. Här sparar du idéer, utkast, hooks, CTA:er och anteckningar som kan återanvändas i nya inlägg.',
                    action: () => setTab('kategorier'),
                    cta: 'Till Kategorier',
                  },
                ].map(item => (
                  <div key={item.title} className="p-5 rounded-card bg-surface-container-lowest border border-black/5">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="material-symbols-outlined text-primary">{item.icon}</span>
                      <h4 className="serif-headline text-2xl leading-tight">{item.title}</h4>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{item.text}</p>
                    <button
                      onClick={item.action}
                      className="px-4 py-2 rounded-full border border-outline-variant/30 label-xs tracking-[0.12em] text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all"
                    >
                      {item.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5 – Kvalitetscheck */}
          <section className="snap-section px-6 py-12">
            <div className="max-w-lg mx-auto">
              <p className="label-xs text-on-surface-variant/50 mb-4">04 / Checklista</p>
              <div className="bg-surface-container-lowest rounded-card p-6 border border-black/5">
                <h3 className="serif-headline text-3xl mb-4">Innan du publicerar</h3>
                <div className="space-y-2 text-sm text-on-surface-variant">
                  {[
                    'Vet jag exakt vem inlägget är till för?',
                    'Har inlägget ett tydligt syfte?',
                    'Finns en hook som fångar rätt person snabbt?',
                    'Är innehållet konkret och användbart?',
                    'Finns en tydlig CTA med ett nästa steg?',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-outline-variant/10">
                  {[
                    { n: posts.length, label: 'Texter' },
                    { n: ideas.length, label: 'Idéer' },
                    { n: scheduled.length, label: 'Planerade' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="serif-headline text-3xl italic text-primary">{s.n}</p>
                      <p className="label-xs text-on-surface-variant/50">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6 – Nästa Steg */}
          <section className="snap-section px-6 pb-8">
            <div className="max-w-lg mx-auto">
              <div className="bg-primary/10 rounded-card p-8 text-center mb-6 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                <h3 className="serif-headline text-3xl mb-2">Minikurs klar</h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  Nästa steg: skapa ett inlägg med tydligt syfte, en stark hook och en CTA som leder vidare.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={() => navigate('/skapa/1')} className="btn-primary px-8 py-3 text-[11px] uppercase tracking-[0.15em]">
                    Börja skapa
                  </button>
                  <button
                    onClick={() => setTab('ideer')}
                    className="px-8 py-3 text-[11px] uppercase tracking-[0.15em] rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all"
                  >
                    Gå till idéer
                  </button>
                </div>
                <button onClick={() => navigate('/ctas')} className="mt-4 text-[11px] uppercase tracking-[0.15em] text-primary hover:opacity-80 transition-opacity">
                  Utforska CTA-biblioteket
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === 'kategorier' && (
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="serif-headline text-4xl italic">Bibliotekskategorier</h2>
            <p className="text-on-surface-variant text-sm font-light mt-1">
              Samla innehåll under dina viktigaste mappar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
            {LIBRARY_CATEGORIES.map(cat => {
              const count = cat.id === 'anteckningsblock'
                ? (sharedNotes.trim() ? 1 : 0)
                : cat.id === 'texter'
                  ? textPosts.length
                  : libraryEntries[cat.id].length
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedCategory === cat.id
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-outline-variant/20 bg-surface-container-lowest hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-primary/80 mb-1 block">{cat.icon}</span>
                  <p className="text-xs font-semibold text-on-surface">{cat.label}</p>
                  <p className="text-[10px] text-on-surface-variant/50 mt-0.5">{cat.hint}</p>
                  <p className="text-[10px] text-primary/80 mt-1">{count} st</p>
                </button>
              )
            })}
          </div>

          {selectedCategory === 'anteckningsblock' ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5">
              <textarea
                value={sharedNotes}
                onChange={e => handleSharedNotes(e.target.value)}
                placeholder="Delat anteckningsblock (synkas med Dashboard)"
                className="w-full min-h-[220px] bg-transparent text-sm text-on-surface resize-none border-none focus:ring-0 placeholder:text-on-surface-variant/30 leading-relaxed"
              />
              <p className="text-[10px] text-on-surface-variant/30 text-right mt-1">{sharedNotes.length} tecken</p>
            </div>
          ) : selectedCategory === 'texter' ? (
            <div className="space-y-2">
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 mb-1">
                <textarea
                  value={quickTextDraft}
                  onChange={e => setQuickTextDraft(e.target.value)}
                  placeholder="Skriv ett nytt utkast..."
                  className="w-full min-h-[80px] bg-transparent text-sm text-on-surface resize-none border-none focus:ring-0 placeholder:text-on-surface-variant/30 leading-relaxed"
                />
                {quickTextDraft.trim() && (
                  <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-outline-variant/10">
                    <button onClick={() => setQuickTextDraft('')} className="text-xs px-3 py-1 rounded-xl border border-outline-variant/30 text-on-surface-variant">Rensa</button>
                    <button
                      onClick={async () => { await quickCreatePost('draft', quickTextDraft); setQuickTextDraft('') }}
                      className="px-3 py-1 rounded-xl bg-primary text-white text-xs uppercase tracking-widest font-semibold"
                    >
                      Spara
                    </button>
                  </div>
                )}
              </div>
              {textPosts.length === 0 ? (
                <p className="text-sm text-on-surface-variant/40 text-center py-6">Inga texter ännu.</p>
              ) : (
                textPosts.slice(0, 20).map(p => (
                  <div key={p.id} className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-on-surface line-clamp-2">{getPostDisplayText(p)}</p>
                      <p className="text-[10px] text-on-surface-variant/40 mt-1">{new Date(p.created_at).toLocaleDateString('sv-SE')}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(p)} className="p-1 text-on-surface-variant/40 hover:text-primary transition-colors" title="Redigera">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button onClick={() => deletePost(p.id)} className="p-1 text-on-surface-variant/40 hover:text-red-400 transition-colors" title="Ta bort">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  value={newCategoryText}
                  onChange={e => setNewCategoryText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addLibraryEntry()}
                  placeholder={selectedCategory === 'bilder' || selectedCategory === 'videos'
                    ? 'Lägg till filnamn, länk eller idé...'
                    : 'Lägg till nytt innehåll...'}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-outline-variant/20 bg-transparent focus:outline-none focus:border-primary/40"
                />
                <button onClick={addLibraryEntry} className="px-4 py-2 rounded-xl bg-primary text-white text-xs uppercase tracking-widest font-semibold">Spara</button>
              </div>

              {(selectedCategory === 'bilder' || selectedCategory === 'videos') && (
                <div className="p-3 rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-lowest">
                  <label className="text-xs text-on-surface-variant/60 block mb-2">Ladda upp {selectedCategory === 'bilder' ? 'bilder' : 'videos'}</label>
                  <input
                    type="file"
                    multiple
                    accept={selectedCategory === 'bilder' ? 'image/*' : 'video/*'}
                    onChange={e => addLibraryFiles(e.target.files)}
                    className="text-xs text-on-surface-variant file:mr-2 file:px-3 file:py-1.5 file:rounded-full file:border file:border-outline-variant/30 file:bg-background file:text-xs"
                  />
                  <p className="text-[10px] text-on-surface-variant/40 mt-2">Filer lagras som metadata-poster i biblioteket.</p>
                </div>
              )}

              {libraryEntries[selectedCategory].length === 0 ? (
                <p className="text-sm text-on-surface-variant/40 text-center py-8 bg-surface-container-lowest rounded-xl border border-outline-variant/20">Inget innehåll ännu i denna kategori.</p>
              ) : (
                <div className="space-y-2">
                  {libraryEntries[selectedCategory].map(entry => (
                    <div key={entry.id} className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-on-surface break-words">{entry.text}</p>
                        <p className="text-[10px] text-on-surface-variant/40 mt-1">{new Date(entry.created_at).toLocaleDateString('sv-SE')}</p>
                      </div>
                      <button onClick={() => deleteLibraryEntry(selectedCategory, entry.id)} className="text-on-surface-variant/40 hover:text-red-400">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: MINA TEXTER
      ══════════════════════════════════════ */}
      {tab === 'texter' && (
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="serif-headline text-4xl italic">Mina texter</h2>
            <p className="text-on-surface-variant text-sm font-light mt-1">Skriv och spara dina utkast och publicerade inlägg.</p>
          </div>

          {/* Always-visible note-style add form */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 mb-6">
            <textarea
              value={quickTextDraft}
              onChange={e => setQuickTextDraft(e.target.value)}
              placeholder="Skriv ett nytt utkast här... tryck Spara när du är klar."
              className="w-full min-h-[100px] bg-transparent text-sm text-on-surface resize-none border-none focus:ring-0 placeholder:text-on-surface-variant/30 leading-relaxed"
            />
            {quickTextDraft.trim() && (
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-outline-variant/10">
                <button onClick={() => setQuickTextDraft('')} className="text-xs px-3 py-1.5 rounded-xl border border-outline-variant/30 text-on-surface-variant">Rensa</button>
                <button
                  onClick={async () => { await quickCreatePost('draft', quickTextDraft); setQuickTextDraft('') }}
                  className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs uppercase tracking-widest font-semibold"
                >
                  Spara utkast
                </button>
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {[{ k: 'all', l: 'Alla' }, { k: 'draft', l: 'Utkast' }, { k: 'published', l: 'Publicerade' }, { k: 'scheduled', l: 'Schemalagda' }].map(f => (
              <button key={f.k} onClick={() => setFilterStatus(f.k)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${
                  filterStatus === f.k ? 'bg-primary text-white' : 'border border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
                }`}>
                {f.l}
                {f.k !== 'all' && <span className="ml-1.5 opacity-60">{posts.filter(p => p.status === f.k).length}</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-surface-container-low rounded-xl animate-pulse" />)}</div>
          ) : filteredTextPosts.length === 0 ? (
            <p className="text-sm text-on-surface-variant/40 text-center py-8">Inga texter ännu. Skriv ovan för att komma igång.</p>
          ) : (
            <div className="space-y-4">
              {filteredTextPosts.map(post => (
                <PostCard key={post.id} post={post} onEdit={openEdit} onDelete={deletePost} onCopy={copy} onStatus={updateStatus} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: IDÉER
      ══════════════════════════════════════ */}
      {tab === 'ideer' && (
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="serif-headline text-4xl italic">Idéer</h2>
              <p className="text-on-surface-variant text-sm font-light mt-1">Fånga tankar, insikter och inspiration.</p>
            </div>
            <button onClick={() => openNewPost('idea')} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Ny idé
            </button>
          </div>

          {/* Always-visible note-style add form */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 mb-6">
            <textarea
              value={quickIdeaText}
              onChange={e => setQuickIdeaText(e.target.value)}
              placeholder="Skriv en ny idé här... tryck Spara när du är klar."
              className="w-full min-h-[80px] bg-transparent text-sm text-on-surface resize-none border-none focus:ring-0 placeholder:text-on-surface-variant/30 leading-relaxed"
            />
            {quickIdeaText.trim() && (
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-outline-variant/10">
                <button onClick={() => setQuickIdeaText('')} className="text-xs px-3 py-1.5 rounded-xl border border-outline-variant/30 text-on-surface-variant">Rensa</button>
                <button
                  onClick={async () => { await quickCreatePost('idea', quickIdeaText); setQuickIdeaText('') }}
                  className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs uppercase tracking-widest font-semibold"
                >
                  Spara idé
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-surface-container-low rounded-xl animate-pulse" />)}</div>
          ) : ideas.length === 0 ? (
            <p className="text-sm text-on-surface-variant/40 text-center py-8">Inga idéer ännu. Skriv ovan för att komma igång.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {ideas.map(idea => (
                <div key={idea.id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5 hover:border-outline-variant/30 hover:shadow-card transition-all cursor-pointer"
                  onClick={() => openEdit(idea)}>
                  {idea.title && <p className="font-semibold text-sm mb-2">{idea.title}</p>}
                  <p className="text-sm text-on-surface leading-relaxed line-clamp-4">{getPostDisplayText(idea)}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/10">
                    <p className="label-xs text-on-surface-variant/40">{new Date(idea.created_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}</p>
                    <div className="flex gap-1">
                      <button onClick={e => { e.stopPropagation(); copy(getPostDisplayText(idea)) }}
                        className="p-1.5 text-on-surface-variant/50 hover:text-primary transition-colors" title="Kopiera">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                      <button onClick={e => { e.stopPropagation(); updateStatus(idea.id, 'draft') }}
                        className="p-1.5 text-on-surface-variant/50 hover:text-primary transition-colors" title="Gör till utkast">
                        <span className="material-symbols-outlined text-sm">upgrade</span>
                      </button>
                      <button onClick={e => { e.stopPropagation(); deletePost(idea.id) }}
                        className="p-1.5 text-on-surface-variant/50 hover:text-red-400 transition-colors" title="Ta bort">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: KALENDER
      ══════════════════════════════════════ */}
      {tab === 'kalender' && (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="serif-headline text-4xl italic">Innehållskalender</h2>
            <button onClick={() => openNewPost('scheduled')} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Schemalägg
            </button>
          </div>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}
              className="p-2 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h3 className="serif-headline text-2xl">{MONTHS_SV[calMonth]} {calYear}</h3>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}
              className="p-2 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_SV.map(d => (
              <div key={d} className="text-center label-xs text-on-surface-variant/40 py-2">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first day offset (Mon-based) */}
            {Array.from({ length: (getFirstDayOfMonth(calYear, calMonth) + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: getDaysInMonth(calYear, calMonth) }).map((_, i) => {
              const day = i + 1
              const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayPosts = postsByDate[dateKey] || []
              const isToday = dateKey === new Date().toISOString().split('T')[0]
              const isSelected = selectedDay === dateKey

              return (
                <div key={day}
                  onClick={() => setSelectedDay(isSelected ? null : dateKey)}
                  className={`relative min-h-[72px] p-2 rounded-xl cursor-pointer transition-all border ${
                    isSelected ? 'border-primary/40 bg-primary/5' :
                    isToday ? 'border-primary/20 bg-primary/3' :
                    'border-outline-variant/10 hover:border-outline-variant/30 bg-surface-container-lowest'
                  }`}>
                  <p className={`text-xs font-semibold mb-1 ${isToday ? 'text-primary' : 'text-on-surface'}`}>{day}</p>
                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 2).map(p => (
                      <div key={p.id}
                        onClick={e => { e.stopPropagation(); openEdit(p) }}
                        className="w-full text-left px-1.5 py-0.5 bg-primary/10 rounded text-[9px] text-primary font-medium truncate">
                        {p.title || p.content.substring(0, 20)}
                      </div>
                    ))}
                    {dayPosts.length > 2 && (
                      <p className="text-[9px] text-on-surface-variant/50 pl-1">+{dayPosts.length - 2} till</p>
                    )}
                  </div>
                  {/* Add button on hover */}
                  {dayPosts.length === 0 && (
                    <button
                      onClick={e => { e.stopPropagation(); setFormDate(dateKey); setFormStatus('scheduled'); openNewPost('scheduled', dateKey) }}
                      className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 group-hover:opacity-100 p-0.5 text-on-surface-variant/30 hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Selected day detail */}
          {selectedDay && (
            <div className="mt-6 p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="serif-headline text-xl">
                  {new Date(selectedDay + 'T12:00:00').toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h4>
                <button onClick={() => openNewPost('scheduled', selectedDay)} className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary font-semibold">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Lägg till
                </button>
              </div>
              {(postsByDate[selectedDay] || []).length === 0 ? (
                <p className="text-on-surface-variant/40 italic text-sm">Inget planerat denna dag.</p>
              ) : (
                <div className="space-y-3">
                  {(postsByDate[selectedDay] || []).map(p => (
                    <PostCard key={p.id} post={p} onEdit={openEdit} onDelete={deletePost} onCopy={copy} onStatus={updateStatus} compact />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'anteckningar' && (
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="serif-headline text-4xl italic">Anteckningar</h2>
            <p className="text-on-surface-variant text-sm font-light mt-1">
              Delas automatiskt med Dashboard.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5">
            <textarea
              value={sharedNotes}
              onChange={e => handleSharedNotes(e.target.value)}
              placeholder="Skriv dina anteckningar här..."
              className="w-full min-h-[300px] bg-transparent text-sm text-on-surface resize-none border-none focus:ring-0 placeholder:text-on-surface-variant/30 leading-relaxed"
            />
            <p className="text-[10px] text-on-surface-variant/30 text-right mt-1">{sharedNotes.length} tecken</p>
          </div>
        </div>
      )}
    </Layout>
  )
}

/* ─── Post Card Component ───────────────────────────────── */
function PostCard({
  post, onEdit, onDelete, onCopy, onStatus, compact = false
}: {
  post: Post
  onEdit: (p: Post) => void
  onDelete: (id: string) => void
  onCopy: (text: string) => void
  onStatus: (id: string, s: Post['status']) => void
  compact?: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const meta = STATUS_META[post.status]
  const platform = PLATFORMS.find(p => p.key === post.platform)

  return (
    <div className="group relative bg-surface-container-lowest rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-card transition-all">
      <div className={`p-${compact ? '4' : '6'}`} style={{ padding: compact ? '1rem' : '1.5rem' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest font-semibold ${meta.color}`}>
              {meta.label}
            </span>
            {platform && (
              <span className="flex items-center gap-1 text-[9px] text-on-surface-variant/50">
                <span className="material-symbols-outlined text-sm">{platform.icon}</span>
                {platform.label}
              </span>
            )}
            {post.scheduled_date && (
              <span className="text-[9px] text-on-surface-variant/50">{new Date(post.scheduled_date + 'T12:00:00').toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}</span>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <button onClick={() => setMenuOpen(m => !m)} className="p-1.5 text-on-surface-variant/40 hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-base">more_vert</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 bg-surface rounded-xl shadow-xl border border-outline-variant/10 py-1 w-44">
                  <button onClick={() => { onEdit(post); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">edit</span>Redigera
                  </button>
                  <button onClick={() => { onCopy(post.content); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">content_copy</span>Kopiera
                  </button>
                  {post.status !== 'published' && (
                    <button onClick={() => { onStatus(post.id, 'published'); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">check_circle</span>Markera publicerad
                    </button>
                  )}
                  {post.status !== 'draft' && (
                    <button onClick={() => { onStatus(post.id, 'draft'); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">article</span>Gör till utkast
                    </button>
                  )}
                  <div className="border-t border-outline-variant/10 my-1" />
                  <button onClick={() => { onDelete(post.id); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low text-red-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">delete</span>Ta bort
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {post.title && <p className="font-semibold text-sm mb-2">{post.title}</p>}
        <p className={`text-sm text-on-surface leading-relaxed ${compact ? 'line-clamp-2' : 'line-clamp-4'}`}>
          {post.content}
        </p>
        <p className="label-xs text-on-surface-variant/30 mt-3">
          {new Date(post.updated_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
