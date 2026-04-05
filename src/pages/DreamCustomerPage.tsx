import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import type { DreamCustomer } from '../lib/supabase'

type Question = { id: string; text: string; category: string; sort_order: number }
type AnswerMap = Record<string, string>
type View = 'list' | 'edit'

function countAnsweredAnswers(map: AnswerMap | null | undefined) {
  if (!map) return 0
  return Object.entries(map).filter(([key, value]) => !key.startsWith('__') && value?.trim()).length
}

const FALLBACK_DREAMCUSTOMER_QUESTIONS: Question[] = [
  { id: 'fb-1', text: 'Vad heter din drömkund?', category: 'demographics', sort_order: 1 },
  { id: 'fb-2', text: 'Hur gammal är hen?', category: 'demographics', sort_order: 2 },
  { id: 'fb-3', text: 'Var bor hen?', category: 'demographics', sort_order: 3 },
  { id: 'fb-4', text: 'Vad jobbar hen med?', category: 'demographics', sort_order: 4 },
  { id: 'fb-5', text: 'Hur ser en vanlig vardag ut?', category: 'demographics', sort_order: 5 },
  { id: 'fb-6', text: 'Vilken livssituation befinner hen sig i?', category: 'demographics', sort_order: 6 },

  { id: 'fb-7', text: 'Vad drömmer hen om att uppnå?', category: 'goals', sort_order: 7 },
  { id: 'fb-8', text: 'Vad vill hen känna i sitt liv eller företag?', category: 'goals', sort_order: 8 },
  { id: 'fb-9', text: 'Vad betyder framgång för hen?', category: 'goals', sort_order: 9 },
  { id: 'fb-10', text: 'Vad skulle vara ett drömscenario inom 12 månader?', category: 'goals', sort_order: 10 },
  { id: 'fb-11', text: 'Vilka delmål behöver hen nå först?', category: 'goals', sort_order: 11 },

  { id: 'fb-12', text: 'Vilka är hens största smärtpunkter just nu?', category: 'pain_points', sort_order: 12 },
  { id: 'fb-13', text: 'Vad frustrerar hen mest med nuvarande lösningar?', category: 'pain_points', sort_order: 13 },
  { id: 'fb-14', text: 'Vad har hen redan testat som inte fungerat?', category: 'pain_points', sort_order: 14 },
  { id: 'fb-15', text: 'Vad kostar problemet hen idag (tid, pengar, energi)?', category: 'pain_points', sort_order: 15 },
  { id: 'fb-16', text: 'Vad är hen rädd för ska hända om inget förändras?', category: 'pain_points', sort_order: 16 },

  { id: 'fb-17', text: 'Vilka värderingar styr hens beslut?', category: 'psychographics', sort_order: 17 },
  { id: 'fb-18', text: 'Vad motiverar hen mest?', category: 'psychographics', sort_order: 18 },
  { id: 'fb-19', text: 'Vad gör hen när hen tvivlar?', category: 'psychographics', sort_order: 19 },
  { id: 'fb-20', text: 'Hur beskriver hen sig själv?', category: 'psychographics', sort_order: 20 },
  { id: 'fb-21', text: 'Vilken identitet vill hen växa in i?', category: 'psychographics', sort_order: 21 },

  { id: 'fb-22', text: 'Var konsumerar hen content idag?', category: 'content', sort_order: 22 },
  { id: 'fb-23', text: 'Vilket format föredrar hen (video, text, live, mail)?', category: 'content', sort_order: 23 },
  { id: 'fb-24', text: 'Vilken tonalitet svarar hen bäst på?', category: 'content', sort_order: 24 },
  { id: 'fb-25', text: 'Vad får hen att stanna kvar och läsa vidare?', category: 'content', sort_order: 25 },
  { id: 'fb-26', text: 'Vilken typ av CTA reagerar hen bäst på?', category: 'content', sort_order: 26 },

  { id: 'fb-27', text: 'Vilka invändningar brukar hen ha innan köp?', category: 'behavior', sort_order: 27 },
  { id: 'fb-28', text: 'Vad behöver hen se för att känna förtroende?', category: 'behavior', sort_order: 28 },
  { id: 'fb-29', text: 'Vad blir hens nästa naturliga steg efter ditt content?', category: 'behavior', sort_order: 29 },
]

const AVATAR_EMOJIS = ['🧑', '👩', '👨', '👩‍💻', '👨‍💼', '🧕', '👩‍🎨', '🧠', '✨', '🔥']
const AVATAR_STYLES = [
  { id: 'rose', cls: 'bg-accent-rose/15 text-accent-rose' },
  { id: 'sage', cls: 'bg-accent-sage/20 text-accent-sage' },
  { id: 'green', cls: 'bg-accent-green/20 text-accent-green' },
  { id: 'primary', cls: 'bg-primary/10 text-primary' },
]

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  demographics:  { label: 'Demografi',            icon: 'person',              color: 'text-accent-rose' },
  psychographics:{ label: 'Psykografi',            icon: 'psychology',          color: 'text-accent-green' },
  pain_points:   { label: 'Smärtpunkter',          icon: 'healing',             color: 'text-accent-sage' },
  goals:         { label: 'Mål & Drömmar',         icon: 'emoji_events',        color: 'text-primary' },
  behavior:      { label: 'Beteende',              icon: 'insights',            color: 'text-secondary' },
  content:       { label: 'Innehållspreferenser',  icon: 'article',             color: 'text-tertiary' },
}

export default function DreamCustomerPage() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [questions, setQuestions] = useState<Question[]>([])
  const [profiles, setProfiles] = useState<DreamCustomer[]>([])
  const [view, setView] = useState<View>('list')
  const [activeProfile, setActiveProfile] = useState<DreamCustomer | null>(null)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [profileName, setProfileName] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [avatarEmoji, setAvatarEmoji] = useState('🧑')
  const [avatarStyle, setAvatarStyle] = useState('primary')

  useEffect(() => {
    const load = async () => {
      const [{ data: qs }, { data: ps }] = await Promise.all([
        supabase.from('questions').select('*').eq('type', 'dreamcustomer').order('sort_order'),
        user ? supabase.from('dream_customers').select('*').eq('user_id', user.id).order('created_at') : { data: [] },
      ])
      if (qs && qs.length > 0) setQuestions(qs)
      else setQuestions(FALLBACK_DREAMCUSTOMER_QUESTIONS)
      if (ps) setProfiles(ps as DreamCustomer[])
      setLoading(false)
    }
    load()
  }, [user])

  const openProfile = (profile: DreamCustomer) => {
    setActiveProfile(profile)
    setAnswers(profile.answers || {})
    setProfileName(profile.name)
    setAvatarEmoji((profile.answers?.__avatar_emoji as string) || '🧑')
    setAvatarStyle((profile.answers?.__avatar_style as string) || 'primary')
    setActiveCategory('all')
    setView('edit')
  }

  const createProfile = async () => {
    if (!newName.trim() || !user) return
    setSaving(true)
    const { data, error } = await supabase
      .from('dream_customers')
      .insert({ user_id: user.id, name: newName.trim(), answers: { __avatar_emoji: '🧑', __avatar_style: 'primary' } })
      .select()
      .single()
    setSaving(false)
    if (error) { showToast('Kunde inte skapa profil'); return }
    const created = data as DreamCustomer
    setProfiles(prev => [...prev, created])
    setNewName('')
    setShowNewForm(false)
    openProfile(created)
    showToast(`"${created.name}" skapad ✓`)
  }

  const saveProfile = useCallback(async () => {
    if (!activeProfile || !user) return
    setSaving(true)
    const payloadAnswers = {
      ...answers,
      __avatar_emoji: avatarEmoji,
      __avatar_style: avatarStyle,
    }
    const { error } = await supabase
      .from('dream_customers')
      .update({ name: profileName, answers: payloadAnswers })
      .eq('id', activeProfile.id)
    setSaving(false)
    if (error) { showToast('Sparningsfel'); return }
    setProfiles(prev => prev.map(p => p.id === activeProfile.id ? { ...p, name: profileName, answers: payloadAnswers } : p))
    setActiveProfile(prev => prev ? { ...prev, name: profileName, answers: payloadAnswers } : prev)
    showToast('Sparat ✓')
  }, [activeProfile, profileName, answers, avatarEmoji, avatarStyle, user, showToast])

  const deleteProfile = async (id: string) => {
    if (!confirm('Ta bort denna drömkund?')) return
    await supabase.from('dream_customers').delete().eq('id', id)
    setProfiles(prev => prev.filter(p => p.id !== id))
    if (activeProfile?.id === id) setView('list')
    showToast('Profil borttagen')
  }

  const handleChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }))
  }

  const categories = ['all', ...Array.from(new Set(questions.map(q => q.category)))]
  const filteredQuestions = activeCategory === 'all' ? questions : questions.filter(q => q.category === activeCategory)
  const answeredCount = countAnsweredAnswers(answers)

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-20 flex items-center justify-center">
          <span className="serif-headline text-2xl italic text-on-surface-variant/40 animate-pulse">Laddar...</span>
        </div>
      </Layout>
    )
  }

  /* ─── LIST VIEW ─────────────────────────────────────── */
  if (view === 'list') {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-12">
            <p className="label-xs text-on-surface-variant/50 mb-3">Innehållsstrategi</p>
            <h1 className="serif-headline text-5xl md:text-6xl italic leading-[1.1] mb-4">Drömkund</h1>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed max-w-xl">
              Skapa tydliga drömkundsprofiler. När du vet exakt vem du talar till blir varje inlägg mer relevant, träffsäkert och lätt att agera på.
            </p>
          </div>

          {/* Profiles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {profiles.map(p => {
              const count = countAnsweredAnswers((p.answers || {}) as AnswerMap)
              const style = AVATAR_STYLES.find(s => s.id === (p.answers?.__avatar_style as string)) || AVATAR_STYLES[3]
              const emoji = (p.answers?.__avatar_emoji as string) || p.name.charAt(0).toUpperCase()
              return (
                <div
                  key={p.id}
                  className="group relative bg-surface-container-lowest rounded-card border border-outline-variant/10 p-6 hover:border-outline-variant/30 hover:shadow-editorial transition-all cursor-pointer"
                  onClick={() => openProfile(p)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${style.cls}`}>
                      <span className="text-xl">{emoji}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteProfile(p.id) }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 transition-all"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                  <h3 className="serif-headline text-2xl mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-grow h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full"
                        style={{ width: `${Math.round((count / Math.max(questions.length, 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant/50 whitespace-nowrap">{count}/{questions.length}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/40 mt-2 uppercase tracking-widest">
                    {count === 0 ? 'Inte påbörjad' : count < questions.length ? 'Under arbete' : 'Färdig'}
                  </p>
                </div>
              )
            })}

            {/* Add new card */}
            <button
              onClick={() => setShowNewForm(true)}
              className="flex flex-col items-center justify-center gap-3 bg-surface-container-lowest rounded-card border border-dashed border-outline-variant/30 p-6 hover:border-primary/40 hover:text-primary transition-all text-on-surface-variant/50 min-h-[160px]"
            >
              <span className="material-symbols-outlined text-3xl">add_circle</span>
              <span className="text-sm font-medium">Ny drömkund</span>
            </button>
          </div>

          {/* New profile form */}
          {showNewForm && (
            <div className="bg-surface-container-low rounded-xl p-6 border border-primary/20 mb-8">
              <p className="label-xs text-on-surface-variant/60 mb-4">Vad heter din drömkund?</p>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createProfile()}
                placeholder='T.ex. "Stina", "Företagaren Erik", "Solopreneur"'
                className="w-full border-b border-outline-variant/30 focus:border-primary/50 outline-none py-3 text-lg font-medium mb-6 bg-transparent placeholder-on-surface-variant/30"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={createProfile} disabled={saving || !newName.trim()} className="btn-primary px-8 py-3 text-sm">
                  {saving ? 'Skapar...' : 'Skapa profil'}
                </button>
                <button onClick={() => { setShowNewForm(false); setNewName('') }} className="px-8 py-3 border border-outline-variant/30 rounded-full text-sm">
                  Avbryt
                </button>
              </div>
            </div>
          )}

          {profiles.length === 0 && !showNewForm && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block">person_search</span>
              <p className="text-on-surface-variant/50 italic">Skapa din första drömkund för att ge allt innehåll en tydligare riktning.</p>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  /* ─── EDIT VIEW ─────────────────────────────────────── */
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-grow">
            <input
              type="text"
              value={profileName}
              onChange={e => setProfileName(e.target.value)}
              className="serif-headline text-4xl italic bg-transparent outline-none border-b border-transparent focus:border-outline-variant/30 w-full transition-colors"
            />
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-[10px] uppercase tracking-widest font-semibold disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            {saving ? 'Sparar...' : 'Spara'}
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-surface-container-low rounded-xl">
          <div className="flex-grow h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${Math.round((answeredCount / Math.max(questions.length, 1)) * 100)}%` }}
            />
          </div>
          <span className="label-xs text-on-surface-variant/60 whitespace-nowrap">
            {answeredCount} / {questions.length} svar
          </span>
          <span className="label-xs text-on-surface-variant/40">
            {Math.round((answeredCount / Math.max(questions.length, 1)) * 100)}%
          </span>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => {
            const meta = CATEGORY_META[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'border border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
                }`}
              >
                {cat === 'all' ? 'Alla' : meta?.label || cat}
              </button>
            )
          })}
        </div>

        {/* Questions grouped by category */}
        <div className="space-y-10">
          {(activeCategory === 'all'
            ? Array.from(new Set(questions.map(q => q.category)))
            : [activeCategory]
          ).map(cat => {
            const catQs = filteredQuestions.filter(q => q.category === cat)
            if (catQs.length === 0) return null
            const meta = CATEGORY_META[cat] || { label: cat, icon: 'help', color: 'text-primary' }
            return (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-5">
                  <span className={`material-symbols-outlined ${meta.color}`}>{meta.icon}</span>
                  <h2 className={`serif-headline text-2xl ${meta.color}`}>{meta.label}</h2>
                </div>
                <div className="space-y-4">
                  {catQs.map((q, i) => (
                    <div
                      key={q.id}
                      className={`rounded-xl p-6 border transition-all ${
                        answers[q.id]?.trim()
                          ? 'bg-surface-container-lowest border-outline-variant/10'
                          : 'bg-surface-container-lowest border-outline-variant/10 hover:border-outline-variant/30'
                      }`}
                    >
                      <label className="block text-sm font-medium mb-3 leading-relaxed">
                        <span className="text-on-surface-variant/30 mr-2 label-xs">{String(i + 1).padStart(2, '0')}</span>
                        {q.text}
                      </label>
                      <textarea
                        value={answers[q.id] || ''}
                        onChange={e => handleChange(q.id, e.target.value)}
                        onBlur={saveProfile}
                        placeholder="Ditt svar..."
                        className="w-full text-sm bg-transparent border-b border-outline-variant/20 focus:border-primary/50 outline-none resize-none py-2 leading-relaxed transition-colors placeholder-on-surface-variant/25"
                        rows={2}
                      />
                      {answers[q.id]?.trim() && (
                        <div className="mt-1 flex justify-end">
                          <span className="material-symbols-outlined text-sm text-accent-green" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Avatar as final step */}
        <div className="mt-12 p-5 bg-surface-container-low rounded-xl border border-outline-variant/15">
          <p className="label-xs text-on-surface-variant/60 mb-2">Sista steg</p>
          <h3 className="serif-headline text-2xl italic mb-4">Skapa avatar</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${AVATAR_STYLES.find(s => s.id === avatarStyle)?.cls || AVATAR_STYLES[3].cls}`}>
              <span className="text-2xl">{avatarEmoji}</span>
            </div>
            <p className="text-xs text-on-surface-variant/60">Välj en enkel symbol som hjälper dig känna igen profilen direkt</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {AVATAR_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setAvatarEmoji(e)}
                className={`w-9 h-9 rounded-full border text-lg ${avatarEmoji === e ? 'border-primary bg-primary/10' : 'border-outline-variant/30'}`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {AVATAR_STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setAvatarStyle(s.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest border ${avatarStyle === s.id ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant/30 text-on-surface-variant/60'}`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom save */}
        <div className="mt-12 flex justify-center">
          <button onClick={saveProfile} disabled={saving} className="btn-primary px-12 py-4">
            {saving ? 'Sparar...' : 'Spara alla svar'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
