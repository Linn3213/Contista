import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

const STEP_NAMES = [
  '', 'Välj Syfte', 'Välj Målgrupp', 'Tonläge', 'Research',
  'Hook-utveckling', 'Struktur', 'Utkast', 'Finjustering', 'Publicera',
]

type Props = {
  step: number
  children: ReactNode
  onNext?: () => void
  onContinue?: () => void
  nextLabel?: string
  continueLabel?: string
  canContinue?: boolean
  fullWidth?: boolean
}

export default function StepLayout({ step, children, onNext, onContinue, nextLabel, continueLabel, canContinue = true, fullWidth = false }: Props) {
  const navigate = useNavigate()
  const progress = (step / 9) * 100
  const buttonLabel = continueLabel || nextLabel || 'Fortsätt'

  const handleNext = () => {
    if (onContinue) { onContinue(); return }
    if (onNext) onNext()
    if (step < 9) navigate(`/skapa/${step + 1}`)
    else navigate('/bibliotek')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Progress header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => step > 1 ? navigate(`/skapa/${step - 1}`) : navigate('/skapa')}
                className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
              >
                arrow_back
              </button>
              <span className="label-xs text-on-surface-variant/60">Steg {step} av 9</span>
            </div>
            <span className="label-xs text-primary">{STEP_NAMES[step]}</span>
          </div>
          <div className="w-full h-[1px] bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className={`flex-1 w-full relative z-10 ${fullWidth ? 'px-6 py-10' : 'max-w-2xl mx-auto px-6 py-10'}`}>
        {children}
      </main>

      {/* Footer CTA */}
      <footer className="sticky bottom-0 bg-background/90 backdrop-blur-md px-6 py-6 border-t border-black/5">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="btn-primary px-16 py-4 text-sm tracking-[0.12em] uppercase disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center gap-3">
              {buttonLabel}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </span>
          </button>
          <p className="label-xs text-on-surface-variant/40 italic">
            Genomtänkt strategi ger organisk respons.
          </p>
        </div>
      </footer>
    </div>
  )
}
