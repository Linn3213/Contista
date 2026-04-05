import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepLayout from '../../components/StepLayout'
import { useCreator } from '../../contexts/CreatorContext'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { DreamCustomer } from '../../lib/supabase'

const AUDIENCE_CARDS = [
  { key: 'beginner',      icon: 'emoji_nature',   title: 'Nybörjaren',      desc: 'Ny till ämnet, söker grundläggande förståelse och snabba vinster.' },
  { key: 'intermediate',  icon: 'trending_up',    title: 'Den motiverade',  desc: 'Vet grunderna, vill ta nästa steg och se konkreta resultat.' },
  { key: 'expert',        icon: 'psychology',     title: 'Experten',        desc: 'Söker djup, nuanserad information och nya perspektiv.' },
]

export default function Step2() {
  const { state, update } = useCreator()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dreamCustomers, setDreamCustomers] = useState<DreamCustomer[]>([])
  const [loadingDCs, setLoadingDCs] = useState(true)

  useEffect(() => {
    if (!user) { setLoadingDCs(false); return }
    supabase
      .from('dream_customers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at')
      .then(({ data }) => {
        if (data) setDreamCustomers(data as DreamCustomer[])
        setLoadingDCs(false)
      })
  }, [user])

  const selectDreamCustomer = (dc: DreamCustomer) => {
    update({
      audience: `dreamcustomer:${dc.id}`,
      dreamCustomerId: dc.id,
      dreamCustomerName: dc.name,
      dreamCustomerAnswers: dc.answers || {},
    })
  }

  const isSelected = (key: string) => state.audience === key
  const isDreamCustomerSelected = (id: string) => state.dreamCustomerId === id

  const canContinue = !!state.audience

  return (
    <StepLayout step={2} canContinue={canContinue}>
      <h1 className="serif-headline text-5xl md:text-6xl mb-6 leading-[1.1] tracking-tight">
        Vem pratar du med?
      </h1>
      <p className="text-on-surface-variant text-lg font-light mb-10 leading-relaxed max-w-lg">
        Innehåll som resonerar är riktat innehåll. Välj din primära målgrupp för detta inlägg.
      </p>

      {/* Generic audience cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {AUDIENCE_CARDS.map(a => (
          <button
            key={a.key}
            onClick={() => update({ audience: a.key, dreamCustomerId: '', dreamCustomerName: '', dreamCustomerAnswers: {} })}
            className={`flex flex-col p-6 rounded-card text-left transition-all ${
              isSelected(a.key)
                ? 'bg-primary/8 border-2 border-primary/40 shadow-sm'
                : 'bg-surface-container-lowest border border-black/5 hover:border-outline-variant/40 hover:shadow-card'
            }`}
          >
            <span className={`material-symbols-outlined mb-4 ${isSelected(a.key) ? 'text-primary' : 'text-on-surface-variant/60'}`}>
              {a.icon}
            </span>
            <h3 className="serif-headline text-xl mb-2">{a.title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{a.desc}</p>
          </button>
        ))}
      </div>

      {/* Dream customers */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="label-xs text-on-surface-variant/60">Mina drömkunder</p>
          <button
            onClick={() => navigate('/dreamcustomer')}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface-variant/50 hover:text-primary transition-colors font-semibold"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Hantera
          </button>
        </div>

        {loadingDCs ? (
          <div className="flex gap-3">
            {[1, 2].map(i => <div key={i} className="h-24 flex-1 bg-surface-container-low rounded-card animate-pulse" />)}
          </div>
        ) : dreamCustomers.length === 0 ? (
          <button
            onClick={() => navigate('/dreamcustomer')}
            className="w-full flex items-center gap-3 p-5 rounded-card border border-dashed border-outline-variant/30 text-on-surface-variant/50 hover:border-primary/40 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined">person_add</span>
            <span className="text-sm">Skapa din första drömkundsprofil</span>
          </button>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dreamCustomers.map(dc => {
              const answerCount = Object.entries(dc.answers || {}).filter(([key, value]) => !key.startsWith('__') && value?.trim()).length
              const selected = isDreamCustomerSelected(dc.id)
              return (
                <button
                  key={dc.id}
                  onClick={() => selectDreamCustomer(dc)}
                  className={`flex items-center gap-4 p-5 rounded-card text-left transition-all ${
                    selected
                      ? 'bg-primary/8 border-2 border-primary/40 shadow-sm'
                      : 'bg-surface-container-lowest border border-black/5 hover:border-outline-variant/40 hover:shadow-card'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selected ? 'bg-primary/20' : 'bg-surface-container-high'
                  }`}>
                    <span className={`serif-headline text-xl italic ${selected ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {dc.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm mb-0.5">{dc.name}</p>
                    <p className="text-[10px] text-on-surface-variant/50">
                      {answerCount} av {/* questions count from parent */ 29} svar ifyllda
                    </p>
                  </div>
                  {selected && (
                    <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Custom text fallback */}
      <div className="bg-surface-container-low rounded-xl p-6">
        <label className="label-xs text-on-surface-variant/60 block mb-3">
          Eller beskriv med egna ord
        </label>
        <textarea
          value={state.audience.startsWith('custom:') ? state.audience.replace('custom:', '') : ''}
          onChange={e => update({ audience: `custom:${e.target.value}`, dreamCustomerId: '', dreamCustomerName: '', dreamCustomerAnswers: {} })}
          placeholder="T.ex. Kvinnliga soloprenörer 30–45 år som vill växa på Instagram..."
          className="input-field resize-none h-24 leading-relaxed"
          rows={3}
        />
      </div>
    </StepLayout>
  )
}
