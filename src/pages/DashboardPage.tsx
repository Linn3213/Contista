import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

type Post = {
  id: string
  status: 'draft' | 'idea' | 'published' | 'scheduled'
  platform: string
  scheduled_date: string | null
  title: string | null
  content: string
  created_at: string
}

type PlanItem = {
  id: string
  text: string
  priority: 'low' | 'medium' | 'high'
  done: boolean
  created_at: string
}

type CustomCard = {
  id: string
  title: string
  body: string
  emoji: string
}

type ViewSection = 'quicklinks' | 'stats' | 'schedule' | 'todayplan' | 'customcards' | 'notes'

const DAYS_SV = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör']

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-500',
  linkedin: 'bg-blue-600',
  facebook: 'bg-blue-500',
  tiktok: 'bg-black',
  email: 'bg-amber-500',
  twitter: 'bg-sky-500',
  blogg: 'bg-emerald-600',
}

const DEFAULT_ORDER: ViewSection[] = ['quicklinks', 'stats', 'schedule', 'todayplan', 'customcards', 'notes']

function getWeekDays(): Date[] {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((day + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function toYMD(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const [notes, setNotes] = useState('')
  const [notesTimer, setNotesTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const [hiddenSections, setHiddenSections] = useState<ViewSection[]>([])
  const [sectionOrder, setSectionOrder] = useState<ViewSection[]>(DEFAULT_ORDER)

  const [todayItems, setTodayItems] = useState<PlanItem[]>([])
  const [newPlanText, setNewPlanText] = useState('')
  const [newPlanPriority, setNewPlanPriority] = useState<PlanItem['priority']>('medium')

  const [customCards, setCustomCards] = useState<CustomCard[]>([])
  const [newCardTitle, setNewCardTitle] = useState('')
  const [newCardBody, setNewCardBody] = useState('')
  const [newCardEmoji, setNewCardEmoji] = useState('🗂️')

  const weekDays = useMemo(() => getWeekDays(), [])
  const today = toYMD(new Date())

  // Ladda dashboard-data
  useEffect(() => {
    if (!user) return

    supabase
      .from('saved_posts')
      .select('id, status, platform, scheduled_date, title, content, created_at')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setPosts(data as Post[])
        setLoading(false)
      })

    const savedNotes = localStorage.getItem(`contista.shared.notes.${user.id}`)
    if (savedNotes) setNotes(savedNotes)

    const savedOrder = localStorage.getItem(`contista.dashboard.order.${user.id}`)
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder) as ViewSection[]
        const sanitized = DEFAULT_ORDER.filter(s => parsed.includes(s))
        const missing = DEFAULT_ORDER.filter(s => !sanitized.includes(s))
        setSectionOrder([...sanitized, ...missing])
      } catch {
        setSectionOrder(DEFAULT_ORDER)
      }
    }

    const savedHidden = localStorage.getItem(`contista.dashboard.hidden.${user.id}`)
    if (savedHidden) {
      try { setHiddenSections(JSON.parse(savedHidden) as ViewSection[]) } catch { setHiddenSections([]) }
    }

    const savedToday = localStorage.getItem(`contista.todayplan.${user.id}`)
    if (savedToday) {
      try { setTodayItems(JSON.parse(savedToday) as PlanItem[]) } catch { setTodayItems([]) }
    }

    const savedCustomCards = localStorage.getItem(`contista.dashboard.customcards.${user.id}`)
    if (savedCustomCards) {
      try { setCustomCards(JSON.parse(savedCustomCards) as CustomCard[]) } catch { setCustomCards([]) }
    }
  }, [user])

  const persistOrder = (next: ViewSection[]) => {
    setSectionOrder(next)
    if (user) localStorage.setItem(`contista.dashboard.order.${user.id}`, JSON.stringify(next))
  }

  const persistHidden = (next: ViewSection[]) => {
    setHiddenSections(next)
    if (user) localStorage.setItem(`contista.dashboard.hidden.${user.id}`, JSON.stringify(next))
  }

  const toggleSection = (s: ViewSection) => {
    const next = hiddenSections.includes(s)
      ? hiddenSections.filter(x => x !== s)
      : [...hiddenSections, s]
    persistHidden(next)
  }

  const moveSection = (section: ViewSection, dir: 'up' | 'down') => {
    const idx = sectionOrder.indexOf(section)
    if (idx < 0) return
    const swapWith = dir === 'up' ? idx - 1 : idx + 1
    if (swapWith < 0 || swapWith >= sectionOrder.length) return
    const next = [...sectionOrder]
    ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
    persistOrder(next)
  }

  const handleNotes = (val: string) => {
    setNotes(val)
    if (notesTimer) clearTimeout(notesTimer)
    const timer = setTimeout(() => {
      if (user) localStorage.setItem(`contista.shared.notes.${user.id}`, val)
    }, 600)
    setNotesTimer(timer)
  }

  const persistTodayItems = (next: PlanItem[]) => {
    setTodayItems(next)
    if (user) localStorage.setItem(`contista.todayplan.${user.id}`, JSON.stringify(next))
  }

  const persistCustomCards = (next: CustomCard[]) => {
    setCustomCards(next)
    if (user) localStorage.setItem(`contista.dashboard.customcards.${user.id}`, JSON.stringify(next))
  }

  const addPlanItem = () => {
    const text = newPlanText.trim()
    if (!text) return
    const item: PlanItem = {
      id: crypto.randomUUID(),
      text,
      priority: newPlanPriority,
      done: false,
      created_at: new Date().toISOString(),
    }
    persistTodayItems([item, ...todayItems])
    setNewPlanText('')
    setNewPlanPriority('medium')
  }

  const togglePlanDone = (id: string) => {
    persistTodayItems(todayItems.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  const updatePlanText = (id: string, text: string) => {
    persistTodayItems(todayItems.map(i => i.id === id ? { ...i, text } : i))
  }

  const deletePlanItem = (id: string) => {
    persistTodayItems(todayItems.filter(i => i.id !== id))
  }

  const addCustomCard = () => {
    const title = newCardTitle.trim()
    const body = newCardBody.trim()
    if (!title || !body) return

    const card: CustomCard = {
      id: crypto.randomUUID(),
      title,
      body,
      emoji: newCardEmoji.trim() || '🗂️',
    }

    persistCustomCards([card, ...customCards])
    setNewCardTitle('')
    setNewCardBody('')
    setNewCardEmoji('🗂️')
    showToast('Kort tillagt ✓')
  }

  const updateCustomCard = (id: string, updates: Partial<Pick<CustomCard, 'title' | 'body' | 'emoji'>>) => {
    persistCustomCards(customCards.map(card => card.id === id ? { ...card, ...updates } : card))
  }

  const deleteCustomCard = (id: string) => {
    persistCustomCards(customCards.filter(card => card.id !== id))
  }

  const pushPlanToCalendar = async (item: PlanItem) => {
    if (!user) return
    const payload = {
      user_id: user.id,
      title: item.text.slice(0, 70),
      content: item.text,
      platform: 'instagram',
      status: 'scheduled',
      scheduled_date: today,
    }
    const { data, error } = await supabase.from('saved_posts').insert(payload).select().single()
    if (error) {
      showToast('Kunde inte lägga till i kalender')
      return
    }
    if (data) setPosts(prev => [data as Post, ...prev])
    showToast('Tillagd i kalendern ✓')
  }

  // Statistik enligt specifikationen
  const total = posts.length
  const published = posts.filter(p => p.status === 'published').length
  const ongoing = posts.filter(p => p.status === 'scheduled' || p.status === 'draft').length
  const notStarted = posts.filter(p => p.status === 'idea').length

  const platformCounts: Record<string, number> = {}
  posts.forEach(p => { platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1 })

  const weekPosts = posts.filter(p => p.scheduled_date && weekDays.some(d => toYMD(d) === p.scheduled_date))

  const renderSection = (section: ViewSection) => {
    if (hiddenSections.includes(section)) return null

    if (section === 'quicklinks') {
      return (
        <Section key={section} title="Snabbåtgärder" icon="bolt" section={section} onHide={toggleSection} onMove={moveSection}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Contentskaparen', icon: 'create', to: '/skapa' },
              { label: 'Bibliotek', icon: 'local_library', to: '/bibliotek' },
              { label: 'Kalender', icon: 'calendar_month', to: '/kalender' },
              { label: 'Drömkund', icon: 'person_search', to: '/dreamcustomer' },
              { label: 'Contentstrategi', icon: 'account_tree', to: '/strategi' },
              { label: 'Trendspaning', icon: 'trending_up', to: '/trender' },
            ].map(link => (
              <button
                key={link.to}
                onClick={() => navigate(link.to)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-outline-variant/20 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
              >
                <span className="material-symbols-outlined text-[20px] text-primary/70 group-hover:text-primary transition-colors">{link.icon}</span>
                <span className="text-sm text-on-surface">{link.label}</span>
              </button>
            ))}
          </div>
        </Section>
      )
    }

    if (section === 'stats') {
      return (
        <Section key={section} title="Inlägg per kanal" icon="bar_chart" section={section} onHide={toggleSection} onMove={moveSection}>
          {Object.keys(platformCounts).length === 0 ? (
            <p className="text-xs text-on-surface-variant/40 text-center">Inga inlägg ännu</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(platformCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([platform, count]) => (
                  <div key={platform} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[platform] || 'bg-on-surface-variant'}`} />
                    <span className="text-sm text-on-surface capitalize flex-1">{platform}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 rounded-full bg-outline-variant/30 w-24 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }} />
                      </div>
                      <span className="text-xs text-on-surface-variant w-4 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Section>
      )
    }

    if (section === 'schedule') {
      return (
        <Section key={section} title="Veckans schema" icon="calendar_month" section={section} onHide={toggleSection} onMove={moveSection}>
          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map(d => {
              const ymd = toYMD(d)
              const dayPosts = posts.filter(p => p.scheduled_date === ymd)
              const isToday = ymd === today
              return (
                <button
                  key={ymd}
                  onClick={() => navigate('/kalender')}
                  className={`rounded-xl p-2 text-center transition-all hover:bg-primary/10 border ${isToday ? 'border-primary bg-primary/10' : 'border-outline-variant/20 bg-surface'}`}
                >
                  <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/50">{DAYS_SV[d.getDay()]}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${isToday ? 'text-primary' : 'text-on-surface'}`}>{d.getDate()}</p>
                  {dayPosts.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1 flex-wrap">
                      {dayPosts.slice(0, 3).map(p => (
                        <div key={p.id} className={`w-1.5 h-1.5 rounded-full ${PLATFORM_COLORS[p.platform] || 'bg-primary'}`} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {weekPosts.length > 0 ? (
            <div className="mt-3 space-y-1.5">
              {weekPosts.map(p => (
                <div key={p.id} className="flex items-center gap-2.5 px-3 py-2 bg-surface rounded-xl border border-outline-variant/20">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${PLATFORM_COLORS[p.platform] || 'bg-primary'}`} />
                  <span className="text-xs text-on-surface-variant">{p.scheduled_date}</span>
                  <span className="text-xs text-on-surface truncate flex-1">{p.title || p.content.slice(0, 50)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/40 text-center pt-2">Inga inlägg schemalagda denna vecka</p>
          )}
        </Section>
      )
    }

    if (section === 'todayplan') {
      return (
        <Section key={section} title="Dagens plan" icon="fact_check" section={section} onHide={toggleSection} onMove={moveSection}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
              <input
                value={newPlanText}
                onChange={e => setNewPlanText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addPlanItem() }}
                placeholder="Vad behöver du göra idag?"
                className="w-full px-3 py-2 text-sm rounded-xl border border-outline-variant/20 bg-transparent focus:outline-none focus:border-primary/40"
              />
              <select
                value={newPlanPriority}
                onChange={e => setNewPlanPriority(e.target.value as PlanItem['priority'])}
                className="px-3 py-2 text-sm rounded-xl border border-outline-variant/20 bg-transparent focus:outline-none focus:border-primary/40"
              >
                <option value="low">Låg</option>
                <option value="medium">Medel</option>
                <option value="high">Hög</option>
              </select>
              <button onClick={addPlanItem} className="px-4 py-2 text-xs uppercase tracking-widest rounded-xl bg-primary text-white font-semibold">Lägg till</button>
            </div>

            {todayItems.length === 0 ? (
              <p className="text-xs text-on-surface-variant/40 text-center py-2">Inga punkter ännu</p>
            ) : (
              <div className="space-y-2">
                {todayItems.map(item => (
                  <PlanRow
                    key={item.id}
                    item={item}
                    onToggleDone={() => togglePlanDone(item.id)}
                    onDelete={() => deletePlanItem(item.id)}
                    onPush={() => pushPlanToCalendar(item)}
                    onSaveText={(text) => updatePlanText(item.id, text)}
                  />
                ))}
              </div>
            )}
          </div>
        </Section>
      )
    }

    if (section === 'customcards') {
      return (
        <Section key={section} title="Anpassade kort" icon="style" section={section} onHide={toggleSection} onMove={moveSection}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2">
              <input
                value={newCardEmoji}
                onChange={e => setNewCardEmoji(e.target.value)}
                maxLength={4}
                placeholder="🗂️"
                className="px-3 py-2 text-sm rounded-xl border border-outline-variant/20 bg-transparent focus:outline-none focus:border-primary/40 md:w-24"
              />
              <input
                value={newCardTitle}
                onChange={e => setNewCardTitle(e.target.value)}
                placeholder="Rubrik"
                className="px-3 py-2 text-sm rounded-xl border border-outline-variant/20 bg-transparent focus:outline-none focus:border-primary/40"
              />
            </div>

            <textarea
              value={newCardBody}
              onChange={e => setNewCardBody(e.target.value)}
              placeholder="Textinnehåll för kortet"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-xl border border-outline-variant/20 bg-transparent focus:outline-none focus:border-primary/40 resize-y"
            />

            <div className="flex justify-end">
              <button onClick={addCustomCard} className="px-4 py-2 text-xs uppercase tracking-widest rounded-xl bg-primary text-white font-semibold">
                Lägg till kort
              </button>
            </div>

            {customCards.length === 0 ? (
              <p className="text-xs text-on-surface-variant/50 text-center py-2">Inga anpassade kort ännu</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customCards.map(card => (
                  <CustomCardRow
                    key={card.id}
                    card={card}
                    onSave={(updates) => updateCustomCard(card.id, updates)}
                    onDelete={() => deleteCustomCard(card.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </Section>
      )
    }

    return (
      <Section key={section} title="Anteckningar" icon="edit_note" section={section} onHide={toggleSection} onMove={moveSection}>
        <textarea
          value={notes}
          onChange={e => handleNotes(e.target.value)}
          placeholder="Snabbanteckningar, idéer, tankar... Sparas automatiskt och synkas med Bibliotek."
          className="w-full min-h-[140px] bg-transparent text-sm text-on-surface resize-none border-none focus:ring-0 placeholder:text-on-surface-variant/30 leading-relaxed"
        />
        <p className="text-[10px] text-on-surface-variant/30 text-right mt-1">{notes.length} tecken</p>
      </Section>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-5 py-10 space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="label-xs text-on-surface-variant/50 mb-2">Contista</p>
            <h1 className="serif-headline text-5xl italic leading-[1.1]">Dashboard</h1>
            <p className="text-on-surface-variant text-base font-light mt-2 max-w-md">
              Din dagliga riktning. Fokusera på rätt uppgift, följ din plan och bygg content med tydligt syfte.
            </p>
          </div>
          <button
            onClick={() => navigate('/skapa')}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Contentskaparen
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Totalt inlägg', value: total, icon: 'article' },
            { label: 'Publicerade', value: published, icon: 'check_circle' },
            { label: 'Pågående', value: ongoing, icon: 'sync' },
            { label: 'Ej påbörjade', value: notStarted, icon: 'hourglass_empty' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface rounded-2xl px-3 py-4 text-center shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[20px] mb-1 block">{stat.icon}</span>
              <p className="text-2xl font-semibold text-on-surface">{loading ? '-' : stat.value}</p>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {sectionOrder.map(renderSection)}

        {hiddenSections.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hiddenSections.map(s => (
              <button
                key={s}
                onClick={() => toggleSection(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-outline-variant/40 text-on-surface-variant/60 hover:border-primary/40 hover:text-primary transition-all"
              >
                + Visa {s === 'quicklinks' ? 'snabbåtgärder' : s === 'stats' ? 'kanalstatistik' : s === 'schedule' ? 'veckans schema' : s === 'todayplan' ? 'dagens plan' : s === 'customcards' ? 'anpassade kort' : 'anteckningar'}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function CustomCardRow({
  card,
  onSave,
  onDelete,
}: {
  card: CustomCard
  onSave: (updates: Partial<Pick<CustomCard, 'title' | 'body' | 'emoji'>>) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [emoji, setEmoji] = useState(card.emoji)
  const [title, setTitle] = useState(card.title)
  const [body, setBody] = useState(card.body)

  const save = () => {
    const nextTitle = title.trim()
    const nextBody = body.trim()
    if (!nextTitle || !nextBody) return
    onSave({
      emoji: emoji.trim() || '🗂️',
      title: nextTitle,
      body: nextBody,
    })
    setEditing(false)
  }

  return (
    <div className="p-4 rounded-2xl border border-outline-variant/20 bg-surface">
      {editing ? (
        <div className="space-y-2">
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={4} className="px-2 py-1 text-sm rounded-lg border border-outline-variant/20 bg-transparent w-16" />
            <input value={title} onChange={e => setTitle(e.target.value)} className="px-2 py-1 text-sm rounded-lg border border-outline-variant/20 bg-transparent" />
          </div>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} className="w-full px-2 py-1 text-sm rounded-lg border border-outline-variant/20 bg-transparent resize-y" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditing(false)} className="text-xs px-2.5 py-1 rounded-lg border border-outline-variant/30 text-on-surface-variant">Avbryt</button>
            <button onClick={save} className="text-xs px-2.5 py-1 rounded-lg bg-primary text-white">Spara</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xl mb-1">{card.emoji || '🗂️'}</p>
              <h3 className="text-sm font-semibold text-on-surface truncate">{card.title}</h3>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing(true)} title="Redigera">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/60 hover:text-primary">edit</span>
              </button>
              <button onClick={onDelete} title="Ta bort">
                <span className="material-symbols-outlined text-[16px] text-red-400 hover:text-red-500">delete</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant mt-2 whitespace-pre-wrap leading-relaxed">{card.body}</p>
        </div>
      )}
    </div>
  )
}

function PlanRow({
  item,
  onToggleDone,
  onDelete,
  onPush,
  onSaveText,
}: {
  item: PlanItem
  onToggleDone: () => void
  onDelete: () => void
  onPush: () => void
  onSaveText: (text: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState(item.text)

  return (
    <div className="p-3 rounded-xl border border-outline-variant/20 bg-surface">
      <div className="flex items-start gap-2">
        <button onClick={onToggleDone} className="mt-0.5">
          <span className={`material-symbols-outlined text-[18px] ${item.done ? 'text-primary' : 'text-on-surface-variant/40'}`}>
            {item.done ? 'check_circle' : 'radio_button_unchecked'}
          </span>
        </button>

        <div className="flex-1">
          {editing ? (
            <div className="flex gap-2">
              <input
                value={temp}
                onChange={e => setTemp(e.target.value)}
                className="flex-1 px-2 py-1 text-sm rounded-lg border border-outline-variant/20 bg-transparent"
              />
              <button
                onClick={() => { onSaveText(temp.trim() || item.text); setEditing(false) }}
                className="text-xs px-2 py-1 rounded-lg bg-primary text-white"
              >
                Spara
              </button>
            </div>
          ) : (
            <p className={`text-sm ${item.done ? 'line-through text-on-surface-variant/40' : 'text-on-surface'}`}>{item.text}</p>
          )}
          <p className="text-[10px] text-on-surface-variant/40 mt-1">
            Prioritet: {item.priority === 'high' ? 'Hög' : item.priority === 'medium' ? 'Medel' : 'Låg'}
          </p>
        </div>

        <div className="flex gap-1">
          <button onClick={() => setEditing(v => !v)} title="Redigera">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50 hover:text-primary">edit</span>
          </button>
          <button onClick={onPush} title="Skicka till kalender">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50 hover:text-primary">calendar_add_on</span>
          </button>
          <button onClick={onDelete} title="Ta bort">
            <span className="material-symbols-outlined text-[16px] text-red-300 hover:text-red-500">delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
  section,
  onHide,
  onMove,
}: {
  title: string
  icon: string
  children: React.ReactNode
  section: ViewSection
  onHide: (s: ViewSection) => void
  onMove: (s: ViewSection, dir: 'up' | 'down') => void
}) {
  return (
    <div className="bg-surface rounded-3xl p-5 border border-outline-variant/20 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface">{title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(section, 'up')} className="text-on-surface-variant/40 hover:text-primary" title="Flytta upp">
            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
          </button>
          <button onClick={() => onMove(section, 'down')} className="text-on-surface-variant/40 hover:text-primary" title="Flytta ner">
            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
          </button>
          <button onClick={() => onHide(section)} className="text-on-surface-variant/30 hover:text-on-surface-variant/70" title="Dölj sektion">
            <span className="material-symbols-outlined text-[16px]">visibility_off</span>
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
