import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'

const TONES = [
  { key: 'inspirerande', label: 'Inspirerande', icon: 'bolt', desc: 'Lyfter, motiverar, sätter igång känslan av möjlighet.' },
  { key: 'educerande', label: 'Educerande', icon: 'school', desc: 'Klar, strukturerad, fokuserar på lärande.' },
  { key: 'utmanande', label: 'Utmanande', icon: 'psychology_alt', desc: 'Provocerar tanken, ifrågasätter status quo.' },
  { key: 'personlig', label: 'Personlig', icon: 'favorite', desc: 'Varm, nära, delar sårbarhet och äkthet.' },
  { key: 'lekfull', label: 'Lekfull', icon: 'sentiment_very_satisfied', desc: 'Lätt, humoristisk, tar sig inte för seriöst.' },
  { key: 'empatisk', label: 'Empatisk', icon: 'self_improvement', desc: 'Förstår smärtan, bekräftar upplevelsen.' },
  { key: 'auktoritativ', label: 'Auktoritativ', icon: 'workspace_premium', desc: 'Expertbaserad, faktadriven, trovärdigt.' },
  { key: 'kontroversiell', label: 'Kontroversiell', icon: 'warning', desc: 'Djärv, polariserande — skapar reaktioner.' },
]

export default function Step3() {
  const { state, update } = useCreator()

  return (
    <StepLayout step={3} canContinue={!!state.tone}>
      <h1 className="serif-headline text-5xl md:text-6xl mb-6 leading-[1.1] tracking-tight">
        Vilket tonläge?
      </h1>
      <p className="text-on-surface-variant text-lg font-light mb-12 leading-relaxed max-w-lg">
        Tonläget är hur du säger det. Samma budskap kan levereras på åtta olika sätt — välj rätt känsla.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TONES.map(t => (
          <button
            key={t.key}
            onClick={() => update({ tone: t.key })}
            className={`flex flex-col p-5 rounded-card text-left transition-all ${
              state.tone === t.key
                ? 'bg-primary/8 border-2 border-primary/40'
                : 'bg-surface-container-lowest border border-black/5 hover:border-outline-variant/40 hover:shadow-card'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl mb-3 ${state.tone === t.key ? 'text-primary' : 'text-on-surface-variant/50'}`}>
              {t.icon}
            </span>
            <span className="serif-headline text-lg leading-tight mb-1">{t.label}</span>
            <span className="text-[11px] text-on-surface-variant leading-snug opacity-70">{t.desc}</span>
          </button>
        ))}
      </div>
    </StepLayout>
  )
}
