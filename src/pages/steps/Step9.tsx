import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'
import { useClipboard } from '../../hooks/useClipboard'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

const PLATFORM_OPTIONS = [
  { key: 'linkedin', label: 'LinkedIn', icon: 'work' },
  { key: 'instagram', label: 'Instagram', icon: 'photo_camera' },
  { key: 'facebook', label: 'Facebook', icon: 'thumb_up' },
  { key: 'twitter', label: 'X / Twitter', icon: 'tag' },
]

type Step9UndoSnapshot = {
  script: string
  caption: string
  mediaUrl: string
  scheduledDate: string
}

type Step9LocalDraft = {
  script?: string
  caption?: string
  mediaUrl?: string
  scheduledDate?: string
  platform?: string
  savedAt?: string
  undoHistory?: Step9UndoSnapshot[]
  redoHistory?: Step9UndoSnapshot[]
}

function sameSnapshot(a: Step9UndoSnapshot, b: Step9UndoSnapshot) {
  return a.script === b.script && a.caption === b.caption && a.mediaUrl === b.mediaUrl && a.scheduledDate === b.scheduledDate
}

function getStep9DraftKey(userId?: string) {
  return `contista.step9.draft.${userId || 'guest'}`
}

export default function Step9() {
  const { state, update, reset } = useCreator()
  const { user } = useAuth()
  const { copy } = useClipboard()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [script, setScript] = useState(state.draft || '')
  const [caption, setCaption] = useState(state.selectedCTA ? `\n\n${state.selectedCTA}` : '')
  const [mediaUrl, setMediaUrl] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null)
  const [isAutosaving, setIsAutosaving] = useState(false)
  const [undoHistory, setUndoHistory] = useState<Step9UndoSnapshot[]>([])
  const [redoHistory, setRedoHistory] = useState<Step9UndoSnapshot[]>([])
  const restoredOnceRef = useRef(false)

  const pushUndoSnapshot = (snapshot: Step9UndoSnapshot) => {
    setUndoHistory(prev => {
      const last = prev[prev.length - 1]
      if (last && sameSnapshot(last, snapshot)) return prev
      const next = [...prev, snapshot]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })
    setRedoHistory([])
  }

  useEffect(() => {
    if (restoredOnceRef.current) return
    const key = getStep9DraftKey(user?.id)
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const parsed = JSON.parse(raw) as Step9LocalDraft
      if (typeof parsed.script === 'string') setScript(parsed.script)
      if (typeof parsed.caption === 'string') setCaption(parsed.caption)
      if (typeof parsed.mediaUrl === 'string') setMediaUrl(parsed.mediaUrl)
      if (typeof parsed.scheduledDate === 'string') setScheduledDate(parsed.scheduledDate)
      if (typeof parsed.platform === 'string' && parsed.platform && !state.platform) {
        update({ platform: parsed.platform })
      }
      if (typeof parsed.savedAt === 'string') setLastAutoSavedAt(parsed.savedAt)
      if (Array.isArray(parsed.undoHistory)) setUndoHistory(parsed.undoHistory.slice(-3))
      if (Array.isArray(parsed.redoHistory)) setRedoHistory(parsed.redoHistory.slice(-3))
      showToast('Återställde ditt sparade slututkast')
      restoredOnceRef.current = true
    } catch {
      // Ignore broken local draft data.
    }
  }, [user?.id])

  useEffect(() => {
    const key = getStep9DraftKey(user?.id)
    setIsAutosaving(true)
    const timeoutId = window.setTimeout(() => {
      const savedAt = new Date().toISOString()
      const payload = {
        script,
        caption,
        mediaUrl,
        scheduledDate,
        platform: state.platform || '',
        savedAt,
        undoHistory,
        redoHistory,
      }
      try {
        localStorage.setItem(key, JSON.stringify(payload))
      } catch {
        // Ignore storage failures to keep editing flow alive.
      }
      setLastAutoSavedAt(savedAt)
      setIsAutosaving(false)
    }, 350)

    return () => {
      window.clearTimeout(timeoutId)
      setIsAutosaving(false)
    }
  }, [script, caption, mediaUrl, scheduledDate, state.platform, undoHistory, redoHistory, user?.id])

  const charCount = script.length + caption.length
  const wordCount = useMemo(
    () => `${script} ${caption}`.trim().split(/\s+/).filter(Boolean).length,
    [script, caption]
  )

  const combined = [
    script ? `SCRIPT:\n${script}` : '',
    caption ? `CAPTION:\n${caption}` : '',
    mediaUrl ? `MEDIA:\n${mediaUrl}` : '',
  ].filter(Boolean).join('\n\n────────────\n\n')

  const handleCopyAll = () => {
    if (!combined.trim()) return
    copy(combined).then(ok => {
      if (ok) showToast('Kopierat ✓')
      else showToast('Kunde inte kopiera texten')
    })
  }

  const handleCopyText = (text: string, label: string) => {
    if (!text.trim()) return
    copy(text).then(ok => {
      if (ok) showToast(`${label} kopierad ✓`)
      else showToast(`Kunde inte kopiera ${label.toLowerCase()}`)
    })
  }

  const handleDownload = () => {
    if (!combined.trim()) return
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contista-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Nedladdad ✓')
  }

  const savePost = async (status: 'draft' | 'scheduled' | 'published') => {
    if (!user) {
      showToast('Du måste vara inloggad')
      return
    }
    if (!script.trim() && !caption.trim()) {
      showToast('Skriv script eller caption först')
      return
    }

    setSaving(true)
    const payload = {
      user_id: user.id,
      title: caption.trim().split('\n')[0]?.slice(0, 100) || script.trim().split('\n')[0]?.slice(0, 100) || 'Nytt utkast',
      content: [script, caption].filter(Boolean).join('\n\n'),
      platform: state.platform || 'instagram',
      status,
      scheduled_date: status === 'scheduled' ? (scheduledDate || new Date().toISOString().slice(0, 10)) : null,
      purpose: state.purpose || null,
      audience: state.dreamCustomerName || null,
      tone: state.tone || null,
      tags: mediaUrl ? ['media-attached'] : [],
    }

    const { error } = await supabase.from('saved_posts').insert(payload)
    setSaving(false)

    if (error) {
      showToast('Kunde inte spara')
      return
    }

    if (status === 'draft') showToast('Sparad som utkast ✓')
    if (status === 'scheduled') showToast('Schemalagd i kalendern ✓')
    if (status === 'published') {
      try {
        localStorage.removeItem(getStep9DraftKey(user?.id))
      } catch {
        // Ignore storage failures.
      }
      showToast('Markerad som publicerad ✓')
    }
  }

  const clearAll = () => {
    pushUndoSnapshot({ script, caption, mediaUrl, scheduledDate })
    setScript('')
    setCaption('')
    setMediaUrl('')
    setScheduledDate('')
    try {
      localStorage.removeItem(getStep9DraftKey(user?.id))
    } catch {
      // Ignore storage failures.
    }
    update({ draft: '', selectedCTA: '' })
    showToast('Rensat')
  }

  const undoLastChange = () => {
    if (undoHistory.length === 0) return
    const previous = undoHistory[undoHistory.length - 1]
    setUndoHistory(prev => prev.slice(0, -1))
    setRedoHistory(prev => {
      const next = [...prev, { script, caption, mediaUrl, scheduledDate }]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })
    setScript(previous.script)
    setCaption(previous.caption)
    setMediaUrl(previous.mediaUrl)
    setScheduledDate(previous.scheduledDate)
    showToast('Ångrade senaste ändring')
  }

  const redoLastChange = () => {
    if (redoHistory.length === 0) return
    const nextSnapshot = redoHistory[redoHistory.length - 1]
    setRedoHistory(prev => prev.slice(0, -1))
    setUndoHistory(prev => {
      const next = [...prev, { script, caption, mediaUrl, scheduledDate }]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })
    setScript(nextSnapshot.script)
    setCaption(nextSnapshot.caption)
    setMediaUrl(nextSnapshot.mediaUrl)
    setScheduledDate(nextSnapshot.scheduledDate)
    showToast('Gjorde om senaste ändring')
  }

  const handleUndoShortcut = (event: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean; key: string; preventDefault: () => void }) => {
    const isUndo = (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z'
    const isRedo = ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'z') || (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'y')
    if (isUndo && undoHistory.length > 0) {
      event.preventDefault()
      undoLastChange()
      return
    }
    if (isRedo && redoHistory.length > 0) {
      event.preventDefault()
      redoLastChange()
    }
  }

  const handleFinish = () => {
    update({ draft: script })
    showToast('Slutresultatet är klart ✓')
    navigate('/bibliotek')
  }

  return (
    <StepLayout step={9} canContinue={!!script.trim() || !!caption.trim()} continueLabel="Slutför" onContinue={handleFinish}>
      <div className="max-w-2xl mx-auto">
        <h1 className="serif-headline text-5xl md:text-6xl mb-4 leading-[1.1] tracking-tight italic">
          Slutresultat
        </h1>
        <p className="text-on-surface-variant text-lg font-light mb-10 leading-relaxed">
          Gör dina sista justeringar och spara som utkast, pågående eller schemalagd.
        </p>
        {lastAutoSavedAt && (
          <p className="text-[11px] text-on-surface-variant/60 -mt-8 mb-8">
            Senast autosparad: {new Date(lastAutoSavedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
        {isAutosaving && (
          <p className="text-[11px] text-primary/70 -mt-8 mb-8">Autosparar...</p>
        )}

        <div className="mb-8">
          <p className="label-xs text-on-surface-variant/60 mb-4">Plattform</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORM_OPTIONS.map(p => (
              <button
                key={p.key}
                onClick={() => update({ platform: p.key })}
                className={`flex flex-col items-center p-4 rounded-card transition-all ${
                  state.platform === p.key
                    ? 'bg-primary/8 border-2 border-primary/40'
                    : 'bg-surface-container-lowest border border-black/5 hover:border-outline-variant/40'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl mb-2 ${state.platform === p.key ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {p.icon}
                </span>
                <span className="text-xs font-semibold">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="label-xs text-on-surface-variant/60">Script</p>
              <button
                onClick={() => handleCopyText(script, 'Script')}
                className="text-[10px] uppercase tracking-widest text-primary/80 hover:text-primary"
              >
                Kopiera script
              </button>
            </div>
            <textarea
              value={script}
              onChange={e => {
                const next = e.target.value
                if (next !== script) pushUndoSnapshot({ script, caption, mediaUrl, scheduledDate })
                setScript(next)
              }}
              onKeyDown={handleUndoShortcut}
              placeholder="Ditt script..."
              className="w-full border border-outline-variant/20 rounded-xl p-4 text-sm leading-relaxed resize-none focus:outline-none focus:border-primary/40 bg-surface-container-lowest"
              rows={10}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="label-xs text-on-surface-variant/60">Caption</p>
              <button
                onClick={() => handleCopyText(caption, 'Caption')}
                className="text-[10px] uppercase tracking-widest text-primary/80 hover:text-primary"
              >
                Kopiera caption
              </button>
            </div>
            <textarea
              value={caption}
              onChange={e => {
                const next = e.target.value
                if (next !== caption) pushUndoSnapshot({ script, caption, mediaUrl, scheduledDate })
                setCaption(next)
              }}
              onKeyDown={handleUndoShortcut}
              placeholder="Din caption..."
              className="w-full border border-outline-variant/20 rounded-xl p-4 text-sm leading-relaxed resize-none focus:outline-none focus:border-primary/40 bg-surface-container-lowest"
              rows={6}
            />
          </div>

          <div>
            <p className="label-xs text-on-surface-variant/60 mb-2">Bild/Video</p>
            <input
              type="text"
              value={mediaUrl}
              onChange={e => {
                const next = e.target.value
                if (next !== mediaUrl) pushUndoSnapshot({ script, caption, mediaUrl, scheduledDate })
                setMediaUrl(next)
              }}
              onKeyDown={handleUndoShortcut}
              placeholder="Länk eller filnamn för bild/video"
              className="w-full border border-outline-variant/20 rounded-xl p-3 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary/40"
            />
          </div>

          <div>
            <p className="label-xs text-on-surface-variant/60 mb-2">Schemaläggning</p>
            <input
              type="date"
              value={scheduledDate}
              onChange={e => {
                const next = e.target.value
                if (next !== scheduledDate) pushUndoSnapshot({ script, caption, mediaUrl, scheduledDate })
                setScheduledDate(next)
              }}
              onKeyDown={handleUndoShortcut}
              className="border border-outline-variant/20 rounded-xl px-3 py-2 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary/40"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={undoLastChange}
              disabled={undoHistory.length === 0}
              className="py-2.5 px-4 rounded-full border border-outline-variant/30 text-xs font-semibold text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/40 hover:text-primary transition-all"
            >
              ↩ Ångra senaste ändring ({undoHistory.length})
            </button>
            <button
              onClick={redoLastChange}
              disabled={redoHistory.length === 0}
              className="py-2.5 px-4 rounded-full border border-outline-variant/30 text-xs font-semibold text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/40 hover:text-primary transition-all"
            >
              ↪ Gör om ({redoHistory.length})
            </button>
          </div>
          <p className="text-[10px] text-on-surface-variant/50 mt-2">Tips: Ctrl/Cmd+Z och Ctrl/Cmd+Shift+Z fungerar i fälten</p>
        </div>

        <div className="bg-surface-container-low rounded-xl p-6 mb-8">
          <p className="label-xs text-on-surface-variant/60 mb-3">Sammanfattning</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-surface rounded-xl">
              <p className="serif-headline text-2xl italic text-primary">{charCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50">Tecken</p>
            </div>
            <div className="p-3 bg-surface rounded-xl">
              <p className="serif-headline text-2xl italic text-primary">{wordCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50">Ord</p>
            </div>
            <div className="p-3 bg-surface rounded-xl">
              <p className="serif-headline text-2xl italic text-primary">{state.platform || '-'}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50">Kanal</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <button
            onClick={handleCopyAll}
            className="py-3 rounded-full border border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all"
          >
            Kopiera allt
          </button>
          <button
            onClick={handleDownload}
            className="py-3 rounded-full border border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all"
          >
            Spara till telefon (txt)
          </button>
          <button
            onClick={() => savePost('draft')}
            disabled={saving}
            className="py-3 rounded-full bg-surface-container-high text-sm font-semibold text-on-surface hover:bg-surface-container-highest transition-all"
          >
            Spara som pågående
          </button>
          <button
            onClick={() => savePost('scheduled')}
            disabled={saving}
            className="py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            Skicka till kalender
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          <button
            onClick={() => savePost('published')}
            disabled={saving}
            className="py-3 rounded-full border border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all"
          >
            Markera som publicerad
          </button>
          <button
            onClick={clearAll}
            className="py-3 rounded-full border border-red-200 text-sm font-semibold text-red-400 hover:border-red-300 hover:text-red-500 transition-all"
          >
            Rensa allt
          </button>
        </div>

        <button
          onClick={() => { reset(); navigate('/skapa') }}
          className="w-full text-sm text-on-surface-variant/60 hover:text-on-surface transition-colors"
        >
          Starta om Contentskaparen
        </button>
      </div>
    </StepLayout>
  )
}
