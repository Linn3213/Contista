import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'

export default function Step6() {
  const { state, update } = useCreator()

  const sections = [
    {
      key: 'krok', label: 'Sektion 01: Krok', color: 'text-accent-rose',
      mainKey: 'structureKrok', pointsKey: 'structureKrokPoints',
      mainVal: state.structureKrok, pointsVal: state.structureKrokPoints,
      placeholder: 'T.ex. Utmana myten om produktivitet med ett konträrt perspektiv.',
      pointsPlaceholder: '• Myten om det 8-timmars fokusfönstret.\n• Personlig anekdot.\n• Statistik.',
    },
    {
      key: 'kontext', label: 'Sektion 02: Kontext', color: 'text-accent-green',
      mainKey: 'structureKontext', pointsKey: 'structureKontextPoints',
      mainVal: state.structureKontext, pointsVal: state.structureKontextPoints,
      placeholder: 'T.ex. Etablera ramverket för djupt arbete kontra ytligt utförande.',
      pointsPlaceholder: '• Definiera ditt kärnbegrepp.\n• Varför miljö är viktigare än viljestyrka.',
    },
    {
      key: 'karna', label: 'Sektion 03: Kärnvärde', color: 'text-accent-sage',
      mainKey: 'structureKarnavarde', pointsKey: null,
      mainVal: state.structureKarnavarde, pointsVal: '',
      placeholder: 'T.ex. 3 konkreta steg för att återta din kreativa suveränitet.',
      pointsPlaceholder: '',
    },
  ]

  return (
    <StepLayout step={6} canContinue={!!state.structureKrok} fullWidth>
      {/* Desktop: 3-col layout */}
      <div className="hidden md:grid grid-cols-12 gap-0 -mx-6 min-h-[70vh]">
        {/* Left nav */}
        <aside className="col-span-2 px-4 pt-2 border-r border-outline-variant/10">
          <p className="label-xs text-on-surface-variant/50 mb-6">Framsteg</p>
          <div className="h-[2px] bg-outline-variant mb-8">
            <div className="h-full bg-accent-green w-[66%]" />
          </div>
          <nav className="space-y-5">
            {['Koncept','Målgrupp','Tonläge','Research','Narrativ','Struktur','Utkast','Finjustering','Publicera'].map((name, i) => (
              <div key={name} className={`flex items-center gap-3 ${i === 5 ? 'text-accent-rose' : i < 5 ? 'opacity-30' : 'opacity-50'}`}>
                <span className="serif-headline text-base italic">{String(i+1).padStart(2,'0')}</span>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${i === 5 ? 'border-b border-accent-rose/30 pb-0.5 font-bold' : ''}`}>{name}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Center editor */}
        <section className="col-span-7 px-8 overflow-y-auto">
          <h2 className="serif-headline text-4xl mb-3">Strukturering</h2>
          <p className="text-on-surface-variant text-sm italic font-light mb-10">Förfina de arkitektoniska linjerna i din berättelse.</p>
          <StructureSections sections={sections} update={update} />
        </section>

        {/* Right preview */}
        <aside className="col-span-3 border-l border-outline-variant/10 px-6 pt-6">
          <p className="label-xs text-on-surface-variant/50 mb-6">Live förhandsvisning</p>
          <div className="bg-surface shadow-editorial p-8 rounded-xl text-sm space-y-4">
            {state.selectedHook && (
              <p className="serif-headline text-lg italic leading-snug text-on-surface">"{state.draft || state.selectedHook}"</p>
            )}
            {state.structureKrok && <p className="text-on-surface-variant text-xs leading-relaxed">{state.structureKrok}</p>}
            {state.structureKontext && <p className="text-on-surface-variant text-xs leading-relaxed">{state.structureKontext}</p>}
            {!state.structureKrok && (
              <p className="text-on-surface-variant/40 text-xs italic">Fyll i strukturen för att se förhandsgranskning...</p>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile: single column */}
      <div className="md:hidden">
        <h1 className="serif-headline text-4xl mb-3">Strukturering</h1>
        <p className="text-on-surface-variant text-sm italic font-light mb-8">Förfina din berättelsestruktur.</p>
        <StructureSections sections={sections} update={update} />
      </div>
    </StepLayout>
  )
}

function StructureSections({ sections, update }: { sections: any[], update: (p: any) => void }) {
  return (
    <div className="space-y-10">
      {sections.map(s => (
        <div key={s.key} className="group">
          <div className="flex justify-between items-center mb-5">
            <span className={`label-xs font-bold ${s.color}`}>{s.label}</span>
          </div>
          <div className="space-y-5">
            <div>
              <label className="label-xs text-on-surface-variant/50 block mb-2">Huvudmål</label>
              <input
                type="text"
                value={s.mainVal}
                onChange={e => update({ [s.mainKey]: e.target.value })}
                placeholder={s.placeholder}
                className="w-full py-3 border-b border-outline-variant/30 focus:border-accent-rose text-sm outline-none transition-colors font-medium placeholder-on-surface-variant/30"
              />
            </div>
            {s.pointsKey && (
              <div>
                <label className="label-xs text-on-surface-variant/50 block mb-2">Viktiga Poänger</label>
                <textarea
                  value={s.pointsVal}
                  onChange={e => update({ [s.pointsKey]: e.target.value })}
                  placeholder={s.pointsPlaceholder}
                  className="w-full py-3 border-b border-outline-variant/30 focus:border-accent-rose text-sm outline-none leading-loose resize-none h-28 transition-colors placeholder-on-surface-variant/30"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
