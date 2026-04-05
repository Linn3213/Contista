import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import {
  addManualPillar,
  generatePillarsFromAnswers,
  loadPillars,
  removePillar,
  savePillars,
  type ContentPillar,
} from '../lib/contentStrategy'

type AnswerMap = Record<string, string>

type GuideSection = {
  id: string
  title: string
  icon: string
  questions: { id: string; text: string }[]
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'grunden',
    title: 'Grunden - Definiera din strategi',
    icon: 'foundation',
    questions: [
      { id: 'cs-1', text: 'Vad efterfrågar dina följare konkret just nu?' },
      { id: 'cs-2', text: 'Vilka återkommande frågor får du i DM eller kommentarer?' },
      { id: 'cs-3', text: 'Vilka teman engagerar mest i din nisch?' },
      { id: 'cs-4', text: 'Vad inspirerar din drömkund att fortsätta följa dig?' },
      { id: 'cs-5', text: 'Vilken kunskap sitter du på som de inte hittar någon annanstans?' },
    ],
  },
  {
    id: 'varumarke',
    title: 'Varumärke - Vad vill du bli förknippad med?',
    icon: 'verified',
    questions: [
      { id: 'cs-6', text: 'Vilket huvudområde ska du bli top-of-mind inom?' },
      { id: 'cs-7', text: 'Vilken känsla vill du att ditt varumärke ska förmedla?' },
      { id: 'cs-8', text: 'Vilka kärntemata vill du stå för långsiktigt?' },
      { id: 'cs-9', text: 'Vad är det första du vill att en ny kund tänker när de hör ditt namn?' },
      { id: 'cs-10', text: 'Vilket expertområde ska alltid vara centralt i ditt content?' },
    ],
  },
  {
    id: 'erbjudanden',
    title: 'Erbjudanden - Vad vill du sälja?',
    icon: 'sell',
    questions: [
      { id: 'cs-11', text: 'Vilka av dina produkter/tjänster ska du driva trafik till?' },
      { id: 'cs-12', text: 'Vilket innehål hjälper följaren att förstå värdet av dina erbjudanden?' },
      { id: 'cs-13', text: 'Vad behöver din kund veta för att känna sig redo att köpa?' },
      { id: 'cs-14', text: 'Vilka delar av din expertis stärker konverteringen?' },
      { id: 'cs-15', text: 'Vad måste du synliggöra för att skapa köplust?' },
    ],
  },
  {
    id: 'kunskap',
    title: 'Kunskap - Educational pillar',
    icon: 'school',
    questions: [
      { id: 'cs-16', text: 'Vilka tekniker, metoder, principer eller hemligheter kan du lära ut?' },
      { id: 'cs-17', text: 'Vilka vanliga misstag gör din kund och hur undviker de dem?' },
      { id: 'cs-18', text: 'Vad behöver de förstå för att lyckas bättre?' },
      { id: 'cs-19', text: 'Vilka steg-för-steg-metoder kan du bryta ned?' },
      { id: 'cs-20', text: 'Vad inom din expertis är tidlös kunskap som du kan återanvända ofta?' },
    ],
  },
  {
    id: 'community',
    title: 'Community & Social Proof',
    icon: 'groups',
    questions: [
      { id: 'cs-21', text: 'Vad kan du visa bakom kulisserna som bygger relation och förtroende?' },
      { id: 'cs-22', text: 'Vilka transformationshistorier, före/efter eller kundresor kan du dela?' },
      { id: 'cs-23', text: 'Hur kan du lyfta fram din community och visa tillhörighet?' },
      { id: 'cs-24', text: 'Vilka moment i din vardag (studio, process, skapande) stärker relationen?' },
      { id: 'cs-25', text: 'Vad skapar känslan av jag vill vara en del av hennes värld?' },
    ],
  },
  {
    id: 'konvertering',
    title: 'Konvertering - Från följare till kund',
    icon: 'redeem',
    questions: [
      { id: 'cs-26', text: 'Vilka konkreta erbjudanden behöver du förklara mer i detalj?' },
      { id: 'cs-27', text: 'Hur kan du skapa värde samtidigt som du naturligt leder mot köp?' },
      { id: 'cs-28', text: 'Vilka funktioner, moduler eller resultat i din kurs/produkt kan visas upp?' },
      { id: 'cs-29', text: 'Vad måste kunden se för att förstå varför priset är rimligt?' },
      { id: 'cs-30', text: 'Vilka invändningar kan du avslå direkt genom ditt content?' },
    ],
  },
  {
    id: 'avancerad',
    title: 'Avancerad strategi',
    icon: 'bolt',
    questions: [
      { id: 'cs-31', text: 'Vad är ditt huvudlöfte för året? Vilken transformation ska allt content peka mot?' },
      { id: 'cs-32', text: 'Vem är din drömkund idag, och vem vill hon utvecklas till?' },
      { id: 'cs-33', text: 'Vad vill hon känna? Vad vill hon slippa känna?' },
      { id: 'cs-34', text: 'Vad undervisar ingen tillräckligt bra i din nisch? Vilket perspektiv saknas?' },
      { id: 'cs-35', text: 'Vilka tre områden kan du ta absolut expertposition inom?' },
    ],
  },
  {
    id: 'dina-pelare',
    title: 'Dina Content Pillars',
    icon: 'account_tree',
    questions: [
      { id: 'cs-36', text: 'Kunskap: Vad behöver min drömkund förstå för att nå sin transformation?' },
      { id: 'cs-37', text: 'Förtroende & Community: Vad kan jag visa som bygger relation, social proof och identitet?' },
      { id: 'cs-38', text: 'Erbjudande & Konvertering: Vilket innehål leder naturligt till köp?' },
      { id: 'cs-39', text: 'Personlighet & Story: Vad gör mig mänsklig och relaterbar?' },
      { id: 'cs-40', text: 'Lifestyle & Vision: Vad representerar min värld, mina värderingar och framtidsvision?' },
      { id: 'cs-41', text: 'Transformationsresor: Vilka före/efter, processer eller kundcase kan jag dela?' },
    ],
  },
]

function localStrategyAnswersKey(userId?: string) {
  return userId
    ? `contista.strategy.answers.${userId}`
    : 'contista.strategy.answers.guest'
}

function loadLocalStrategyAnswers(userId?: string): AnswerMap {
  try {
    const raw = localStorage.getItem(localStrategyAnswersKey(userId))
    return raw ? (JSON.parse(raw) as AnswerMap) : {}
  } catch {
    return {}
  }
}

function saveLocalStrategyAnswers(answers: AnswerMap, userId?: string) {
  try {
    localStorage.setItem(localStrategyAnswersKey(userId), JSON.stringify(answers))
  } catch {
    // Keep UI responsive when storage fails.
  }
}

export default function StrategiPage() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [answers, setAnswers] = useState<AnswerMap>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(GUIDE_SECTIONS.map((s, i) => [s.id, i === 0]))
  )
  const [pillars, setPillars] = useState<ContentPillar[]>([])
  const [newPillar, setNewPillar] = useState('')
  const [balanceRecommendation, setBalanceRecommendation] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')

  useEffect(() => {
    setAnswers(loadLocalStrategyAnswers(user?.id))
    if (user) setPillars(loadPillars(user.id))
  }, [user])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveLocalStrategyAnswers(answers, user?.id)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [answers, user])

  const allQuestions = useMemo(() => GUIDE_SECTIONS.flatMap(s => s.questions), [])
  const totalCount = allQuestions.length
  const answeredCount = allQuestions.filter(q => (answers[q.id] || '').trim().length > 0).length

  const persistPillars = (next: ContentPillar[]) => {
    setPillars(next)
    if (user) savePillars(user.id, next)
  }

  const toggleSection = (sectionId: string) => {
    setExpanded(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const onMicClick = () => {
    showToast('Rostinmatning kommer snart')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="serif-headline text-5xl italic leading-[1.1]">Content Strategy Guide</h1>
          <p className="text-on-surface-variant mt-2 text-base">
            Bygg din strategiska grund - Besvara frågorna för att skapa kraftfulla content pillars
          </p>
        </div>

        <div className="mb-6 p-5 rounded-2xl bg-surface border border-outline-variant/20">
          <p className="text-sm font-semibold text-on-surface mb-1">Din framsteg:</p>
          <p className="text-on-surface-variant text-sm">{answeredCount}/{totalCount} frågor</p>
        </div>

        <div className="mb-8 p-5 rounded-2xl bg-surface border border-outline-variant/20">
          <p className="text-sm font-semibold text-on-surface mb-2">Så här använder du guiden:</p>
          <ul className="text-sm text-on-surface-variant space-y-1">
            <li>Klicka på varje sektion för att expandera frågorna</li>
            <li>Besvara frågorna med mikrofonen eller skriv</li>
            <li>Dina svar sparas automatiskt</li>
            <li>Återkom och uppdatera när din strategi utvecklas</li>
            <li>Använd svaren för att skapa ditt content</li>
          </ul>
        </div>

        <div className="space-y-4">
          {GUIDE_SECTIONS.map(section => {
            const sectionAnswered = section.questions.filter(q => (answers[q.id] || '').trim().length > 0).length
            const isOpen = expanded[section.id]

            return (
              <div key={section.id} className="rounded-2xl border border-outline-variant/20 bg-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">{section.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{section.title}</p>
                      <p className="text-xs text-on-surface-variant/60">({sectionAnswered}/{section.questions.length})</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-outline-variant/10">
                    {section.questions.map((q, index) => (
                      <div key={q.id} className="pt-4">
                        <label className="block text-sm text-on-surface mb-2">
                          {index + 1}. {q.text}
                        </label>
                        <div className="flex gap-2 items-start">
                          <textarea
                            value={answers[q.id] || ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Skriv ditt svar här eller använd mikrofonen..."
                            className="flex-1 min-h-[84px] text-sm text-on-surface bg-background rounded-xl border border-outline-variant/20 px-3 py-2 resize-y focus:border-primary/50 outline-none"
                          />
                          <button
                            type="button"
                            onClick={onMicClick}
                            className="w-10 h-10 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors shrink-0"
                            title="Röstinmatning"
                          >
                            <span className="material-symbols-outlined text-[18px]">mic</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-10 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-semibold text-on-surface">Generera pelare</p>
              <p className="text-xs text-on-surface-variant/60 mt-1">
                Bygger pelare utifrån dina svar och fördelar över funnel-faserna.
              </p>
            </div>
            <button
              onClick={() => {
                const result = generatePillarsFromAnswers(answers, pillars, allQuestions)
                persistPillars(result.pillars)
                setBalanceRecommendation(result.balanceRecommendation)
                setGeneratedPrompt(result.prompt)
                showToast('Pelare genererade')
              }}
              className="px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-widest"
            >
              Generera pelare
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {pillars.map(pillar => (
              <button
                key={pillar.id}
                onClick={() => persistPillars(removePillar(pillars, pillar.id))}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant/30 text-xs text-on-surface-variant hover:border-primary/40 hover:text-on-surface"
              >
                <span>{pillar.emoji}</span>
                <span>{pillar.name}</span>
                <span className="text-on-surface-variant/50">�</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPillar}
              onChange={e => setNewPillar(e.target.value)}
              placeholder="Lagg till pelare manuellt"
              className="flex-1 text-sm text-on-surface bg-transparent border border-outline-variant/20 rounded-xl px-3 py-2 focus:border-primary/50 outline-none"
            />
            <button
              onClick={() => {
                const next = addManualPillar(pillars, newPillar)
                persistPillars(next)
                setNewPillar('')
              }}
              className="px-4 py-2 rounded-xl bg-background border border-outline-variant/30 text-xs font-semibold uppercase tracking-widest"
            >
              Lagg till
            </button>
          </div>

          {balanceRecommendation && (
            <p className="text-xs text-on-surface-variant mb-3">
              <strong>Balansrekommendation:</strong> {balanceRecommendation}
            </p>
          )}

          <details>
            <summary className="text-xs text-primary cursor-pointer">Visa prompt for Claude-generering</summary>
            <pre className="mt-2 text-[10px] leading-relaxed whitespace-pre-wrap bg-surface rounded-xl border border-outline-variant/20 p-3 text-on-surface-variant">
              {generatedPrompt || 'Generera pelare for att se prompten.'}
            </pre>
          </details>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            to="/contentskaparen"
            className="p-5 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <p className="text-sm font-semibold text-on-surface">Oppna Contentskaparen</p>
            <p className="text-xs text-on-surface-variant/50 mt-1">Anvand pelarna direkt i ditt nasta inlagg</p>
          </Link>
          <Link
            to="/settings"
            className="p-5 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <p className="text-sm font-semibold text-on-surface">Installningar / Profil</p>
            <p className="text-xs text-on-surface-variant/50 mt-1">Hantera konto och profil</p>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
