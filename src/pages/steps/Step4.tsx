import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'

export default function Step4() {
  const { state, update } = useCreator()

  return (
    <StepLayout step={4} canContinue={true}>
      <h1 className="serif-headline text-5xl md:text-6xl mb-6 leading-[1.1] tracking-tight">
        Research & Kontext
      </h1>
      <p className="text-on-surface-variant text-lg font-light mb-12 leading-relaxed max-w-lg">
        Vad vet du om ämnet? Klistra in fakta, citat, statistik eller anteckningar.
      </p>

      <div className="space-y-8">
        <div>
          <label className="label-xs text-on-surface-variant/60 block mb-4">
            Research & bakgrundsinformation
          </label>
          <textarea
            value={state.research}
            onChange={e => update({ research: e.target.value })}
            placeholder="Klistra in research, fakta, citat, statistik, URL:er eller egna anteckningar..."
            className="input-field resize-none h-40 leading-relaxed text-sm"
            rows={6}
          />
          <p className="text-[10px] text-on-surface-variant/40 mt-2">
            {state.research.length} tecken
          </p>
        </div>

        <div>
          <label className="label-xs text-on-surface-variant/60 block mb-4">
            Nyckelinsikt — vad är det viktigaste du vill förmedla?
          </label>
          <input
            type="text"
            value={state.insight}
            onChange={e => update({ insight: e.target.value })}
            placeholder="T.ex. 'De flesta misslyckas för att de skippar steg 3...'"
            className="input-field text-sm font-medium"
          />
        </div>

        <div className="bg-surface-container-low rounded-xl p-5">
          <p className="label-xs text-on-surface-variant/60 mb-3">Tips</p>
          <ul className="space-y-2 text-sm text-on-surface-variant leading-relaxed">
            <li className="flex gap-2">
              <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
              Ju mer kontext du ger, desto mer träffsäker blir din hook och struktur.
            </li>
            <li className="flex gap-2">
              <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
              Nyckelinsikten formar hela ditt innehålls vinkel.
            </li>
          </ul>
        </div>
      </div>
    </StepLayout>
  )
}
