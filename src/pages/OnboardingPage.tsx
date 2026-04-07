import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuidette } from '../contexts/GuidetteContext'

// ─── Guidettes samtal ─────────────────────────────────────────────────────────

const STEPS = [
  {
    step: 1,
    guidette: 'Hej! Jag är Guidette — din personliga guide genom Contista. Jag hjälper dig skapa content som faktiskt funkar. Vi börjar enkelt. Vad heter du?',
    field: 'display_name' as const,
    placeholder: 'Ditt namn...',
    label: 'Ditt namn',
    type: 'text',
  },
  {
    step: 2,
    guidette: 'Kul att träffas! Nu till det viktiga — vad säljer eller erbjuder du?',
    hint: 'Det kan vara en tjänst, kurs, produkt eller något du hjälper folk med.',
    field: 'what_you_sell' as const,
    placeholder: 'T.ex. personlig träning, webbdesign, hudvård...',
    label: 'Vad erbjuder du?',
    type: 'textarea',
  },
  {
    step: 3,
    guidette: 'Perfekt. Och vem är det du hjälper?',
    hint: 'Tänk på din typiska kund — vem är de och vad kämpar de med?',
    field: 'who_buys' as const,
    placeholder: 'T.ex. mammor som vill komma igång med träning, företagare utan hemsida...',
    label: 'Vem hjälper du?',
    type: 'textarea',
  },
  {
    step: 4,
    guidette: 'Sista frågan. Vilket är det viktigaste resultatet du ger din kund — vad förändras för dem?',
    hint: 'Tänk känsla + konkret förändring. Det är det här ditt content ska kretsa kring.',
    field: 'transformation' as const,
    placeholder: 'T.ex. de känner sig starka och får energi, de får en hemsida som säljer...',
    label: 'Vilket resultat ger du?',
    type: 'textarea',
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { saveProfile, generatePillars } = useGuidette()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    display_name: '',
    what_you_sell: '',
    who_buys: '',
    transformation: '',
  })
  const [saving, setSaving] = useState(false)
  const [pillarsPreview, setPillarsPreview] = useState(false)

  const current = STEPS[step]
  const value = answers[current.field]
  const isLast = step === STEPS.length - 1

  const handleNext = async () => {
    if (!value.trim()) return

    if (isLast) {
      // Generera pillars och spara
      setSaving(true)
      const pillars = generatePillars()
      await saveProfile({
        ...answers,
        content_pillars: pillars,
        onboarding_done: true,
      })
      setSaving(false)
      setPillarsPreview(true)
    } else {
      setStep(s => s + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && current.type === 'text') {
      e.preventDefault()
      handleNext()
    }
  }

  // ─── Pillars preview (sista steget) ────────────────────────────────────────

  if (pillarsPreview) {
    const pillars = generatePillars()
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Guidette */}
          <div className="flex items-start gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm">✨</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-sm text-on-surface leading-relaxed">
                Utmärkt, {answers.display_name}! Jag har skapat dina <strong>innehållspelare</strong> baserat på det du berättat. Dessa guidar ditt content framåt.
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="space-y-3 mb-8">
            {pillars.map((p, i) => (
              <div
                key={p.id}
                className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/15"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-2xl mt-0.5">{p.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Guidette avslut */}
          <div className="flex items-start gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm">✨</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-sm text-on-surface leading-relaxed">
                Nu är vi redo. Jag finns alltid med dig — tryck på ✨ när du behöver hjälp. Ska vi skapa ditt första inlägg?
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/skapa')}
              className="w-full btn-primary py-4 text-sm tracking-wide"
            >
              Skapa mitt första inlägg →
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Gå till dashboarden
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Samtalssteg ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-16 pb-12">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">

        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="serif-headline text-4xl italic text-on-surface">Contista</h1>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-10">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-primary' : 'bg-outline-variant/30'
              }`}
            />
          ))}
        </div>

        {/* Guidette-bubbla */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm">✨</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
            <p className="text-sm text-on-surface leading-relaxed">{current.guidette}</p>
            {current.hint && (
              <p className="text-xs text-on-surface-variant mt-2 italic">{current.hint}</p>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="flex-1">
          <label className="text-[11px] uppercase tracking-widest text-on-surface-variant/60 block mb-2">
            {current.label}
          </label>
          {current.type === 'textarea' ? (
            <textarea
              autoFocus
              value={value}
              onChange={e => setAnswers(prev => ({ ...prev, [current.field]: e.target.value }))}
              placeholder={current.placeholder}
              rows={4}
              className="w-full input-field resize-none text-sm leading-relaxed"
            />
          ) : (
            <input
              autoFocus
              type="text"
              value={value}
              onChange={e => setAnswers(prev => ({ ...prev, [current.field]: e.target.value }))}
              onKeyDown={handleKeyDown}
              placeholder={current.placeholder}
              className="w-full input-field text-sm"
            />
          )}
        </div>

        {/* Knapp */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={!value.trim() || saving}
            className="w-full btn-primary py-4 text-sm tracking-wide disabled:opacity-40"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                Skapar din profil...
              </span>
            ) : isLast ? 'Skapa mina innehållspelare →' : 'Fortsätt →'}
          </button>

          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="w-full mt-3 py-2 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
            >
              ← Tillbaka
            </button>
          )}
        </div>

        {/* Steg-räknare */}
        <p className="text-center text-[10px] text-on-surface-variant/40 mt-6">
          {step + 1} av {STEPS.length}
        </p>

      </div>
    </div>
  )
}
