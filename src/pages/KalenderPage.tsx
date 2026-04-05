import { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

type Post = {
  id: string
  user_id?: string
  title: string | null
  content: string
  platform: string
  status: 'draft' | 'idea' | 'published' | 'scheduled'
  tags?: string[]
  scheduled_date: string | null
  created_at: string
  updated_at: string
}

type CalendarViewMode = 'day' | 'week' | 'month'
type GetDoneType = 'content' | 'admin' | 'sales' | 'planning' | 'personal' | 'other'

const MONTHS_SV = ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December']
const DAYS_SV   = ['Mån','Tis','Ons','Tor','Fre','Lör','Sön']

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-400',
  linkedin:  'bg-blue-500',
  facebook:  'bg-blue-400',
  tiktok:    'bg-neutral-800',
  email:     'bg-amber-400',
  twitter:   'bg-sky-400',
  blogg:     'bg-emerald-500',
}

const PLATFORM_OPTIONS = ['instagram','linkedin','facebook','tiktok','email','twitter','blogg']
const GET_DONE_TYPES: GetDoneType[] = ['content', 'admin', 'sales', 'planning', 'personal', 'other']
const GET_DONE_LABELS: Record<GetDoneType, string> = {
  content: 'Content',
  admin: 'Admin',
  sales: 'Sälj',
  planning: 'Planering',
  personal: 'Personligt',
  other: 'Annat',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  // 0=Mon ... 6=Sun
  const raw = new Date(year, month, 1).getDay()
  return raw === 0 ? 6 : raw - 1
}
function toYMD(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseYMD(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

function startOfWeek(date: Date) {
  const base = new Date(date)
  const day = base.getDay()
  const diff = day === 0 ? -6 : 1 - day
  base.setDate(base.getDate() + diff)
  return base
}

function taskTypeFromTags(tags?: string[]): GetDoneType {
  const tag = (tags || []).find(t => t.startsWith('todo:'))
  const key = tag?.slice(5) as GetDoneType | undefined
  return key && GET_DONE_TYPES.includes(key) ? key : 'content'
}

function tagsWithTaskType(tags: string[] | undefined, taskType: GetDoneType) {
  const clean = (tags || []).filter(t => !t.startsWith('todo:'))
  return [...clean, `todo:${taskType}`]
}

function localCalendarKey(userId?: string) {
  return userId ? `contista.calendar.posts.${userId}` : 'contista.calendar.posts.guest'
}

function loadLocalCalendarPosts(userId?: string): Post[] {
  try {
    const raw = localStorage.getItem(localCalendarKey(userId))
    return raw ? (JSON.parse(raw) as Post[]) : []
  } catch {
    return []
  }
}

function saveLocalCalendarPosts(posts: Post[], userId?: string) {
  try {
    localStorage.setItem(localCalendarKey(userId), JSON.stringify(posts))
  } catch {
    // Ignore storage failures to keep the UI responsive.
  }
}

function isPreviewBypassed() {
  if (!import.meta.env.DEV) return false
  try {
    return sessionStorage.getItem('contista.auth.preview_bypass') === '1'
  } catch {
    return false
  }
}

export default function KalenderPage() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(toYMD(today.getFullYear(), today.getMonth(), today.getDate()))
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [saving, setSaving] = useState(false)
  const [localMode, setLocalMode] = useState(false)
  const [previewBypass, setPreviewBypass] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Formulärdata
  const [formContent, setFormContent]   = useState('')
  const [formTitle, setFormTitle]       = useState('')
  const [formPlatform, setFormPlatform] = useState('instagram')
  const [formTaskType, setFormTaskType] = useState<GetDoneType>('content')
  const [formStatus, setFormStatus]     = useState<Post['status']>('scheduled')

  useEffect(() => {
    setPreviewBypass(isPreviewBypassed())
  }, [])

  useEffect(() => {
    if (!user) {
      setLocalMode(true)
      setPosts(loadLocalCalendarPosts())
      return
    }

    supabase
      .from('saved_posts')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (error) {
          setLocalMode(true)
          setPosts(loadLocalCalendarPosts(user.id))
          return
        }
        setLocalMode(false)
        if (data) setPosts(data as Post[])
      })
  }, [user])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)
  const todayYMD    = toYMD(today.getFullYear(), today.getMonth(), today.getDate())
  const selectedYMD = selectedDay || todayYMD
  const selectedDate = parseYMD(selectedYMD)
  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const openDay = (ymd: string) => {
    setSelectedDay(ymd)
    setEditingPost(null)
    setShowForm(false)
    resetForm()
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  const shiftSelectedDay = (delta: number) => {
    const d = parseYMD(selectedYMD)
    d.setDate(d.getDate() + delta)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
    setSelectedDay(toYMD(d.getFullYear(), d.getMonth(), d.getDate()))
  }

  const prevPeriod = () => {
    if (viewMode === 'month') {
      prevMonth()
      return
    }
    shiftSelectedDay(viewMode === 'week' ? -7 : -1)
  }

  const nextPeriod = () => {
    if (viewMode === 'month') {
      nextMonth()
      return
    }
    shiftSelectedDay(viewMode === 'week' ? 7 : 1)
  }

  const resetForm = () => {
    setFormContent('')
    setFormTitle('')
    setFormPlatform('instagram')
    setFormTaskType('content')
    setFormStatus('scheduled')
  }

  const openEdit = (post: Post) => {
    setEditingPost(post)
    setFormTitle(post.title || '')
    setFormContent(post.content)
    setFormPlatform(post.platform)
    setFormTaskType(taskTypeFromTags(post.tags))
    setFormStatus(post.status)
    setShowForm(true)
  }

  const savePost = async () => {
    if (!formContent.trim()) {
      showToast('Skriv innehåll först')
      return
    }
    if (!selectedDay) {
      showToast('Välj en dag först')
      return
    }

    setSaving(true)

    if (!user || localMode) {
      if (editingPost) {
        const updated = posts.map(p => p.id === editingPost.id
          ? {
              ...p,
              title: formTitle || null,
              content: formContent,
              platform: formPlatform,
              tags: tagsWithTaskType(p.tags, formTaskType),
              status: formStatus,
              updated_at: new Date().toISOString(),
            }
          : p)
        setPosts(updated)
        saveLocalCalendarPosts(updated, user?.id)
        showToast('Sparat lokalt ✓')
        setEditingPost(null)
        setShowForm(false)
        resetForm()
        setSaving(false)
        return
      }

      const created: Post = {
        id: crypto.randomUUID(),
        user_id: user?.id,
        title: formTitle || null,
        content: formContent,
        platform: formPlatform,
        tags: tagsWithTaskType([], formTaskType),
        status: formStatus,
        scheduled_date: selectedDay,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const updated = [created, ...posts]
      setPosts(updated)
      saveLocalCalendarPosts(updated, user?.id)
      showToast('Inlägg sparat lokalt ✓')
      resetForm()
      setShowForm(false)
      setSaving(false)
      return
    }

    if (editingPost) {
      const { error } = await supabase
        .from('saved_posts')
        .update({
          title: formTitle || null,
          content: formContent,
          platform: formPlatform,
          tags: tagsWithTaskType(editingPost.tags, formTaskType),
          status: formStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingPost.id)
      if (!error) {
        setPosts(prev => prev.map(p =>
          p.id === editingPost.id
            ? { ...p, title: formTitle || null, content: formContent, platform: formPlatform, tags: tagsWithTaskType(p.tags, formTaskType), status: formStatus }
            : p
        ))
        showToast('Sparat ✓')
        setEditingPost(null)
        setShowForm(false)
        resetForm()
      } else {
        showToast('Kunde inte spara i molnet, testar lokalt')
        setLocalMode(true)
        const updated = posts.map(p => p.id === editingPost.id
          ? {
              ...p,
              title: formTitle || null,
              content: formContent,
              platform: formPlatform,
              tags: tagsWithTaskType(p.tags, formTaskType),
              status: formStatus,
              updated_at: new Date().toISOString(),
            }
          : p)
        setPosts(updated)
        saveLocalCalendarPosts(updated, user.id)
      }
    } else {
      const { data, error } = await supabase
        .from('saved_posts')
        .insert({
          user_id: user.id,
          title: formTitle || null,
          content: formContent,
          platform: formPlatform,
          status: formStatus,
          scheduled_date: selectedDay,
          tags: tagsWithTaskType([], formTaskType),
        })
        .select()
        .single()
      if (!error && data) {
        setPosts(prev => [data as Post, ...prev])
        showToast('Inlägg tillagt ✓')
        resetForm()
        setShowForm(false)
      } else {
        showToast('Kunde inte spara i molnet, sparar lokalt')
        setLocalMode(true)
        const created: Post = {
          id: crypto.randomUUID(),
          user_id: user.id,
          title: formTitle || null,
          content: formContent,
          platform: formPlatform,
          tags: tagsWithTaskType([], formTaskType),
          status: formStatus,
          scheduled_date: selectedDay,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const updated = [created, ...posts]
        setPosts(updated)
        saveLocalCalendarPosts(updated, user.id)
        resetForm()
        setShowForm(false)
      }
    }
    setSaving(false)
  }

  const deletePost = async (id: string) => {
    if (!confirm('Ta bort detta inlägg?')) return
    if (!user || localMode) {
      const updated = posts.filter(p => p.id !== id)
      setPosts(updated)
      saveLocalCalendarPosts(updated, user?.id)
      showToast('Inlägg borttaget')
      return
    }
    await supabase.from('saved_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
    showToast('Inlägg borttaget')
  }

  const moveToDay = async (postId: string, ymd: string) => {
    if (!user || localMode) {
      const updated = posts.map(p => p.id === postId ? { ...p, scheduled_date: ymd } : p)
      setPosts(updated)
      saveLocalCalendarPosts(updated, user?.id)
      showToast('Datum uppdaterat ✓')
      return
    }
    await supabase.from('saved_posts').update({ scheduled_date: ymd }).eq('id', postId)
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, scheduled_date: ymd } : p))
    showToast('Datum uppdaterat ✓')
  }

  const dayPosts = (ymd: string) => posts.filter(p => p.scheduled_date === ymd)
  const selectedDayPosts = selectedDay ? dayPosts(selectedDay) : []

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-5 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="label-xs text-on-surface-variant/50 mb-2">Contista</p>
          <h1 className="serif-headline text-5xl italic leading-[1.1]">Kalender</h1>
          <p className="text-on-surface-variant text-base font-light mt-2">
            Planera publicering med tydlig rytm. Klicka på en dag och ge varje inlägg ett syfte.
          </p>
          {previewBypass && (
            <p className="text-xs text-amber-700 mt-3">
              Preview utan inloggning är aktivt. Kalenderinlägg sparas lokalt på den här enheten.
            </p>
          )}
          {!previewBypass && localMode && (
            <p className="text-xs text-amber-700 mt-3">
              Lokalt läge är aktivt. Dina kalenderinlägg sparas på den här enheten.
            </p>
          )}
        </div>

        {/* ── Vyval ── */}
        <div className="mb-5 rounded-2xl border border-outline-variant/20 bg-surface p-1 grid grid-cols-3 gap-1">
          {([
            { key: 'day', label: 'Dag' },
            { key: 'week', label: 'Vecka' },
            { key: 'month', label: 'Månad' },
          ] as { key: CalendarViewMode; label: string }[]).map(view => (
            <button
              key={view.key}
              onClick={() => setViewMode(view.key)}
              className={`rounded-xl py-2 text-sm transition-all ${
                viewMode === view.key
                  ? 'bg-background border border-outline-variant/20 text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* ── Periodnavigation ── */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevPeriod} className="w-9 h-9 rounded-full border border-outline-variant/40 flex items-center justify-center hover:bg-surface hover:border-primary/40 transition-all">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <h2 className="serif-headline text-2xl italic">
            {viewMode === 'month' && `${MONTHS_SV[month]} ${year}`}
            {viewMode === 'week' && `${weekDays[0].toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} - ${weekDays[6].toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            {viewMode === 'day' && selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextPeriod} className="w-9 h-9 rounded-full border border-outline-variant/40 flex items-center justify-center hover:bg-surface hover:border-primary/40 transition-all">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {viewMode === 'month' && (
          <>
            {/* ── Veckodagar ── */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_SV.map(d => (
                <div key={d} className="text-center text-[9px] uppercase tracking-widest text-on-surface-variant/40 py-1">{d}</div>
              ))}
            </div>

            {/* ── Kalender-grid ── */}
            <div className="grid grid-cols-7 gap-1 mb-8">
              {/* Tomma platser */}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}

              {/* Dagar */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const ymd = toYMD(year, month, day)
                const dayP = dayPosts(ymd)
                const isToday = ymd === todayYMD
                const isSelected = ymd === selectedDay
                return (
                  <button
                    key={ymd}
                    onClick={() => openDay(ymd)}
                    className={`relative rounded-xl pt-2 pb-2.5 min-h-[56px] flex flex-col items-center transition-all border
                      ${isSelected
                        ? 'border-primary bg-primary/10'
                        : isToday
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-outline-variant/20 bg-surface hover:border-primary/30 hover:bg-primary/5'
                      }`}
                  >
                    <span className={`text-sm font-semibold ${isToday || isSelected ? 'text-primary' : 'text-on-surface'}`}>
                      {day}
                    </span>
                    {/* Inlägg-prickar */}
                    {dayP.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-0.5 mt-1 px-1">
                        {dayP.slice(0, 4).map(p => (
                          <div
                            key={p.id}
                            className={`w-1.5 h-1.5 rounded-full ${PLATFORM_COLORS[p.platform] || 'bg-primary'}`}
                            title={p.platform}
                          />
                        ))}
                        {dayP.length > 4 && (
                          <span className="text-[8px] text-on-surface-variant/50">+{dayP.length - 4}</span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {viewMode === 'week' && (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-8">
            {weekDays.map(d => {
              const ymd = toYMD(d.getFullYear(), d.getMonth(), d.getDate())
              const dayP = dayPosts(ymd)
              const isToday = ymd === todayYMD
              const isSelected = ymd === selectedDay
              return (
                <button
                  key={ymd}
                  onClick={() => openDay(ymd)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : isToday
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-outline-variant/20 bg-surface hover:border-primary/30'
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">{DAYS_SV[(d.getDay() + 6) % 7]}</p>
                  <p className="text-lg font-semibold text-on-surface mt-1">{d.getDate()}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">{dayP.length} uppgifter</p>
                </button>
              )
            })}
          </div>
        )}

        {viewMode === 'day' && (
          <div className="mb-8 rounded-2xl border border-outline-variant/20 bg-surface p-4">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">Vald dag</p>
            <p className="text-lg font-semibold text-on-surface mt-1">
              {selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-sm text-on-surface-variant mt-1">{dayPosts(selectedYMD).length} uppgifter planerade</p>
          </div>
        )}

        {/* ── Vald dag – detaljer ── */}
        {selectedDay && (
          <div ref={bottomRef} className="bg-surface rounded-3xl border border-outline-variant/20 shadow-sm overflow-hidden">
            {/* Rubrik */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
              <div>
                <p className="label-xs text-on-surface-variant/50">Vald dag</p>
                <h3 className="serif-headline text-xl italic mt-0.5">
                  {new Date(selectedDay + 'T00:00:00').toLocaleDateString('sv-SE', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })}
                </h3>
              </div>
              <button
                onClick={() => setShowForm(v => !v)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                Lägg till
              </button>
            </div>

            {/* Formulär */}
            {showForm && (
              <div className="px-5 py-4 border-b border-outline-variant/20 bg-background/40 space-y-3">
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Titel (valfri)"
                  className="w-full text-sm border-b border-outline-variant/30 pb-2 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30"
                />
                <textarea
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  placeholder="Skriv ditt inlägg här..."
                  className="w-full min-h-[120px] text-sm text-on-surface resize-none placeholder:text-on-surface-variant/30 leading-relaxed border-b border-outline-variant/30 pb-2 focus:border-primary"
                />
                {/* Platform-chips */}
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
                      <div className={`w-1.5 h-1.5 rounded-full ${PLATFORM_COLORS[p] || 'bg-primary'}`} />
                      {p}
                    </button>
                  ))}
                </div>
                {/* Get Done-typ */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-2">Typ av uppgift</p>
                  <div className="flex flex-wrap gap-2">
                    {GET_DONE_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormTaskType(type)}
                        className={`px-3 py-1 rounded-full border text-xs transition-all ${
                          formTaskType === type
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
                        }`}
                      >
                        {GET_DONE_LABELS[type]}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Status */}
                <div className="flex gap-2">
                  {(['scheduled', 'draft', 'idea'] as Post['status'][]).map(s => (
                    <button
                      key={s}
                      onClick={() => setFormStatus(s)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all
                        ${formStatus === s
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-outline-variant/30 text-on-surface-variant'
                        }`}
                    >
                      {s === 'scheduled' ? 'Schemalagd' : s === 'draft' ? 'Utkast' : 'Idé'}
                    </button>
                  ))}
                </div>
                {/* Knappar */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={savePost}
                    disabled={saving || !formContent.trim()}
                    className="flex-1 py-2.5 bg-primary text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-40 transition-all"
                  >
                    {saving ? 'Sparar...' : editingPost ? 'Uppdatera' : 'Spara inlägg'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setEditingPost(null); resetForm() }}
                    className="px-4 py-2.5 border border-outline-variant/40 rounded-full text-xs font-semibold text-on-surface-variant hover:border-primary/40 transition-all"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            )}

            {/* Inlägg för vald dag */}
            {selectedDayPosts.length === 0 && !showForm && (
              <p className="text-sm text-on-surface-variant/40 text-center py-8">
                Inga inlägg på denna dag.
              </p>
            )}
            <div className="divide-y divide-outline-variant/10">
              {selectedDayPosts.map(post => {
                const taskType = taskTypeFromTags(post.tags)
                return (
                  <div key={post.id} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${PLATFORM_COLORS[post.platform] || 'bg-primary'}`} />
                      <div className="flex-1 min-w-0">
                        {post.title && (
                          <p className="text-xs font-semibold text-on-surface mb-1">{post.title}</p>
                        )}
                        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 capitalize">{post.platform}</span>
                          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {GET_DONE_LABELS[taskType]}
                          </span>
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full
                            ${post.status === 'published' ? 'bg-green-100 text-green-700'
                              : post.status === 'scheduled' ? 'bg-purple-100 text-purple-700'
                              : post.status === 'draft' ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'}`}
                          >
                            {post.status === 'published' ? 'Publicerad'
                              : post.status === 'scheduled' ? 'Schemalagd'
                              : post.status === 'draft' ? 'Utkast' : 'Idé'}
                          </span>
                        </div>
                      </div>
                      {/* Åtgärder */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(post)}
                          className="w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors"
                          title="Redigera"
                        >
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">edit</span>
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                          title="Ta bort"
                        >
                          <span className="material-symbols-outlined text-[16px] text-red-400">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
