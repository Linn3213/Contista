import { useState } from 'react'
import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'

const PURPOSES = [
  {
    key: 'salj', icon: 'payments', title: 'Sälj', desc: 'Driv konvertering genom strategisk övertalning.',
    subs: [
      { key: 'direkt', label: 'Direkt sälj', tag: 'Direkt', desc: 'Tydlig uppmaning, fokus på direkta fördelar.' },
      { key: 'mjukt', label: 'Mjukt sälj', tag: 'Subtil', desc: 'Lågt tryck, fokus på livsstil och känsla.' },
      { key: 'berattelse', label: 'Berättelsebaserat', tag: 'Narrativ', desc: 'Bygger begär genom mänsklig koppling.' },
    ]
  },
  {
    key: 'utbilda', icon: 'school', title: 'Utbilda', desc: 'Ge värde genom att lära ut något nytt.',
    subs: [
      { key: 'tutorial', label: 'Tutorial', tag: 'Steg-för-steg', desc: 'Praktisk guide med konkreta steg.' },
      { key: 'insikt', label: 'Insikt', tag: 'Perspektiv', desc: 'Dela en oväntat sanning eller insikt.' },
      { key: 'myt', label: 'Mytsläckning', tag: 'Konträr', desc: 'Utmana en vanlig missuppfattning.' },
    ]
  },
  {
    key: 'fortroende', icon: 'verified', title: 'Bygg förtroende', desc: 'Etablera auktoritet och vårda gemenskapen.',
    subs: [
      { key: 'bakom', label: 'Bakom kulisserna', tag: 'Autentisk', desc: 'Visa processen, inte bara resultatet.' },
      { key: 'bevis', label: 'Socialt bevis', tag: 'Resultat', desc: 'Kundcase, testimonials, siffror.' },
      { key: 'personlig', label: 'Personlig berättelse', tag: 'Story', desc: 'Din resa, dina misstag, din transformation.' },
    ]
  },
  {
    key: 'underhall', icon: 'theater_comedy', title: 'Underhåll', desc: 'Fånga uppmärksamhet genom glädje eller nyfikenhet.',
    subs: [
      { key: 'humor', label: 'Humor', tag: 'Lekfull', desc: 'Relaterbar, lätt och engagerande.' },
      { key: 'nyfiken', label: 'Nyfikenhet', tag: 'Mysterium', desc: 'Skapa ett kunskapsgap — de måste läsa vidare.' },
      { key: 'trend', label: 'Trendsättning', tag: 'Aktuell', desc: 'Koppla till något som händer just nu.' },
    ]
  },
]

export default function Step1() {
  const { state, update } = useCreator()
  const [expanded, setExpanded] = useState<string | null>('salj')
  const [showCustomPurpose, setShowCustomPurpose] = useState(false)

  const customPurpose = state.purpose === 'custom' ? state.purposeSub : ''
  const canContinue = state.purpose === 'custom' ? !!customPurpose?.trim() : !!state.purpose

  const selectSub = (purposeKey: string, subKey: string) => {
    update({ purpose: purposeKey, purposeSub: subKey })
    setShowCustomPurpose(false)
  }

  return (
    <StepLayout step={1} canContinue={canContinue}>
      <h1 className="serif-headline text-5xl md:text-6xl mb-6 leading-[1.1] tracking-tight">
        Vad är syftet med detta inlägg?
      </h1>
      <p className="text-on-surface-variant text-lg font-light mb-12 leading-relaxed max-w-lg">
        Varje skapelse börjar med ett syfte. Välj den huvudsakliga inriktningen för ditt innehåll.
      </p>

      <div className="space-y-4">
        {PURPOSES.map(p => (
          <div
            key={p.key}
            className={`rounded-3xl transition-all duration-500 overflow-hidden ${
              expanded === p.key
                ? 'bg-surface-container-lowest shadow-[0_20px_50px_rgba(42,38,36,0.05)] ring-1 ring-primary/10'
                : 'bg-surface-container-lowest hover:shadow-card cursor-pointer'
            }`}
          >
            <div
              className="flex justify-between items-center p-8 cursor-pointer"
              onClick={() => setExpanded(expanded === p.key ? null : p.key)}
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">{p.icon}</span>
                </div>
                <div>
                  <h3 className="serif-headline text-2xl text-on-surface">{p.title}</h3>
                  <p className="text-on-surface-variant text-sm mt-0.5">{p.desc}</p>
                </div>
              </div>
              <span
                className={`material-symbols-outlined text-outline-variant transition-transform duration-300 ${
                  expanded === p.key ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </div>

            {expanded === p.key && (
              <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                {p.subs.map(sub => (
                  <button
                    key={sub.key}
                    onClick={() => selectSub(p.key, sub.key)}
                    className={`flex flex-col p-5 rounded-2xl text-left transition-all ${
                      state.purpose === p.key && state.purposeSub === sub.key
                        ? 'border border-primary/40 bg-primary/8'
                        : 'border border-transparent bg-surface-container-low hover:border-outline-variant/30'
                    }`}
                  >
                    <span className="label-xs text-primary mb-2">{sub.tag}</span>
                    <span className="font-medium text-sm text-on-surface mb-1">{sub.label}</span>
                    <span className="text-on-surface-variant text-xs leading-relaxed">{sub.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            setShowCustomPurpose(v => !v)
            update({ purpose: 'custom', purposeSub: customPurpose || '' })
          }}
          className="flex items-center gap-3 py-3 px-8 rounded-full border border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all text-xs uppercase tracking-[0.2em]"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Skapa anpassat syfte
        </button>
      </div>

      {showCustomPurpose && (
        <div className="mt-6 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20 max-w-xl mx-auto">
          <label className="label-xs text-on-surface-variant/60 block mb-3">
            Beskriv syftet med egna ord
          </label>
          <input
            type="text"
            value={customPurpose || ''}
            onChange={e => update({ purpose: 'custom', purposeSub: e.target.value })}
            placeholder="Till exempel väcka intresse för ett nytt erbjudande"
            className="w-full px-4 py-3 text-sm rounded-xl border border-outline-variant/20 bg-transparent focus:outline-none focus:border-primary/40"
          />
        </div>
      )}
    </StepLayout>
  )
}
