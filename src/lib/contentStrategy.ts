export type ContentPillar = {
  id: string
  name: string
  emoji: string
  source: 'generated' | 'manual'
  description?: string
  funnelPhase?: 'VACK' | 'VARM' | 'AG' | 'BJUD_IN'
  formats?: string[]
  exampleTopics?: string[]
  purpose?: 'utbilda' | 'inspirera' | 'sälja' | 'bygga relation' | 'underhålla'
  frequency?: string
}

type QuestionEntry = { id: string; text: string }

export type PillarGenerationResult = {
  pillars: ContentPillar[]
  balanceRecommendation: string
  prompt: string
}

const DEFAULT_PILLARS: ContentPillar[] = [
  {
    id: 'pillar-educational',
    name: 'Utbildande guider',
    emoji: '📚',
    source: 'generated',
    description: 'Skapar tydlighet och bygger expertstatus i din nisch.',
    funnelPhase: 'VARM',
    formats: ['Reel', 'Karusell'],
    exampleTopics: ['Vanliga misstag', 'Steg-for-steg', 'Checklista'],
    purpose: 'utbilda',
    frequency: '2x/vecka',
  },
  {
    id: 'pillar-storytelling',
    name: 'Personliga stories',
    emoji: '📖',
    source: 'generated',
    description: 'Bygger relation genom erfarenheter, insikter och vardagsnara exempel.',
    funnelPhase: 'VARM',
    formats: ['Story', 'Caption'],
    exampleTopics: ['Bakom kulisserna', 'Larande', 'Vardag'],
    purpose: 'bygga relation',
    frequency: '1x/vecka',
  },
  {
    id: 'pillar-trust',
    name: 'Resultat & bevis',
    emoji: '🏆',
    source: 'generated',
    description: 'Visar social proof och gor det enklare att ta nasta steg med dig.',
    funnelPhase: 'AG',
    formats: ['Case', 'Testimonials'],
    exampleTopics: ['Fore efter', 'Kundresultat', 'Process'],
    purpose: 'sälja',
    frequency: '1x/vecka',
  },
  {
    id: 'pillar-reach',
    name: 'Räckviddsinnehåll',
    emoji: '🚀',
    source: 'generated',
    description: 'Attraherar nya personer med tydlig krok och igenkannbara problem.',
    funnelPhase: 'VACK',
    formats: ['Hook reel', 'Kort video'],
    exampleTopics: ['Mytkross', 'Snabba tips', 'Kontraster'],
    purpose: 'inspirera',
    frequency: '2x/vecka',
  },
  {
    id: 'pillar-cta',
    name: 'CTA-fokuserat',
    emoji: '🎯',
    source: 'generated',
    description: 'Driver direkt mot ditt viktigaste erbjudande eller nasta handling.',
    funnelPhase: 'BJUD_IN',
    formats: ['Story CTA', 'Säljinlägg'],
    exampleTopics: ['Inbjudan', 'Erbjudande', 'Deadline'],
    purpose: 'sälja',
    frequency: '1x/vecka',
  },
]

function keyFor(userId: string) {
  return `contista.contentstrategy.pillars.${userId}`
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u00C0-\u024F\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

export function loadPillars(userId: string): ContentPillar[] {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    if (!raw) return DEFAULT_PILLARS
    const parsed = JSON.parse(raw) as ContentPillar[]
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PILLARS
    return parsed
  } catch {
    return DEFAULT_PILLARS
  }
}

export function savePillars(userId: string, pillars: ContentPillar[]) {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(pillars))
  } catch {
    // Keep app functional even when storage is unavailable.
  }
}

export function addManualPillar(existing: ContentPillar[], name: string, emoji = '✨'): ContentPillar[] {
  const trimmed = name.trim()
  if (!trimmed) return existing
  const normalized = trimmed.toLowerCase()
  if (existing.some(p => p.name.toLowerCase() === normalized)) return existing

  return [
    ...existing,
    {
      id: `pillar-${slugify(trimmed)}-${Date.now()}`,
      name: trimmed,
      emoji,
      source: 'manual',
      description: 'Manuellt tillagd contentpelare.',
      funnelPhase: 'VARM',
      formats: ['Valfritt'],
      exampleTopics: ['Exempel 1', 'Exempel 2', 'Exempel 3'],
      purpose: 'utbilda',
      frequency: '1x/vecka',
    },
  ]
}

export function removePillar(existing: ContentPillar[], pillarId: string): ContentPillar[] {
  const next = existing.filter(p => p.id !== pillarId)
  return next.length > 0 ? next : DEFAULT_PILLARS
}

function pickAnswer(
  answers: Record<string, string>,
  questions: QuestionEntry[] | undefined,
  keyHints: string[]
): string {
  if (questions && questions.length > 0) {
    const hit = questions.find(q => keyHints.some(h => q.text.toLowerCase().includes(h)))
    if (hit) return (answers[hit.id] || '').trim()
  }

  const direct = Object.entries(answers).find(([key]) => keyHints.some(h => key.toLowerCase().includes(h)))
  return direct ? (direct[1] || '').trim() : ''
}

function asList(input: string): string[] {
  return input
    .split(/,|\n|;|\//g)
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 6)
}

function toPhase(goal: string): 'VACK' | 'VARM' | 'AG' | 'BJUD_IN' {
  const g = goal.toLowerCase()
  if (g.includes('växa') || g.includes('vaxa') || g.includes('organisk') || g.includes('reach')) return 'VACK'
  if (g.includes('relation') || g.includes('förtroende') || g.includes('fortroende')) return 'VARM'
  if (g.includes('försälj') || g.includes('forsalj') || g.includes('sälj') || g.includes('salj')) return 'AG'
  if (g.includes('inspir')) return 'BJUD_IN'
  return 'VARM'
}

function phaseLabel(phase: 'VACK' | 'VARM' | 'AG' | 'BJUD_IN') {
  if (phase === 'VACK') return 'VÄCK'
  if (phase === 'VARM') return 'VÄRM'
  if (phase === 'AG') return 'ÄG'
  return 'BJUD IN'
}

export function buildClaudePillarPrompt(
  profile: Record<string, string>
): string {
  return `Du är en expert på content-strategi för personliga varumärken och online-utbildning.

Baserat på följande svar från användaren, generera 5 skräddarsydda content-pelare.

--- ANVÄNDARENS SVAR ---
Kärnbudskap: ${profile.karnbudskap || ''}
Förändring du vill skapa: ${profile.forandring || ''}
Tre ord som beskriver varumärket: ${profile.treOrd || ''}
Primärt mål med content: ${profile.mal || ''}
Delmål per månad: ${profile.delmål || ''}
Vanligaste CTA: ${profile.cta || ''}
Ton: ${profile.ton || ''}
Hur personlig: ${profile.personlighetsnivå || ''}
Ord att använda / undvika: ${profile.ordlista || ''}
Veckoflöde för produktion: ${profile.veckoflöde || ''}
Prioriterade format per kanal: ${profile.format || ''}
Hur du återanvänder content: ${profile.återanvändning || ''}
Nyckeltal: ${profile.kpi || ''}
Uppföljningsfrekvens: ${profile.uppföljning || ''}
Content att göra mer av: ${profile.merAv || ''}
--- SLUT PÅ SVAR ---

Returnera exakt följande JSON-struktur, inget annat:

{
  "pelare": [
    {
      "namn": "Kortfattat pelarnamn (2–4 ord)",
      "emoji": "En passande emoji",
      "beskrivning": "En mening om vad pelaren handlar om och varför den finns",
      "funnel_fas": "VÄCK | VÄRM | ÄG | BJUD IN",
      "format": ["format1", "format2"],
      "exempelämnen": ["ämne 1", "ämne 2", "ämne 3"],
      "syfte": "utbilda | inspirera | sälja | bygga relation | underhålla",
      "frekvens": "t.ex. 2x/vecka"
    }
  ],
  "balans_rekommendation": "En mening om hur pelarna bör roteras för att täcka hela funneln."
}

Regler:
- Pelarna ska täcka ALLA fyra funnel-faser kollektivt
- Minst en pelare ska vara räckvidds-driven (VÄCK)
- Minst en pelare ska driva direkt mot primär CTA
- Varje pelare ska kännas distinkt — ingen överlappning
- Anpassa språk och ton exakt efter användarens svar`
}

export function generatePillarsFromAnswers(
  answers: Record<string, string>,
  existing: ContentPillar[],
  questions?: QuestionEntry[]
): PillarGenerationResult {
  const karnbudskap = pickAnswer(answers, questions, ['kärnbudskap', 'karnbudskap'])
  const forandring = pickAnswer(answers, questions, ['förändring', 'forandring'])
  const treOrd = pickAnswer(answers, questions, ['tre ord'])
  const mal = pickAnswer(answers, questions, ['mål med ditt content', 'primärt mål', 'primart mal'])
  const delmal = pickAnswer(answers, questions, ['delmål', 'delmal'])
  const cta = pickAnswer(answers, questions, ['cta'])
  const ton = pickAnswer(answers, questions, ['ton'])
  const personlighetsnivå = pickAnswer(answers, questions, ['personlig'])
  const ordlista = pickAnswer(answers, questions, ['ord/uttryck', 'ord att använda', 'ord att anvanda'])
  const veckoflöde = pickAnswer(answers, questions, ['veckoflöde', 'veckoflode'])
  const format = pickAnswer(answers, questions, ['format'])
  const återanvändning = pickAnswer(answers, questions, ['återanvänder', 'ateranvander'])
  const kpi = pickAnswer(answers, questions, ['nyckeltal'])
  const uppföljning = pickAnswer(answers, questions, ['uppfölj'])
  const merAv = pickAnswer(answers, questions, ['göra mer av', 'gora mer av'])
  const topicsRaw = pickAnswer(answers, questions, ['ämnen', 'amnen', 'pillars', 'pelare'])

  const derivedTopics = asList(topicsRaw)
  const topics = derivedTopics.length > 0 ? derivedTopics : ['Problem', 'Lösning', 'Resultat', 'Relation', 'Erbjudande']
  const formats = asList(format)
  const formatList = formats.length > 0 ? formats : ['Reel', 'Karusell']
  const ctaText = cta || 'Nästa steg'
  const dominantPhase = toPhase(mal || '')

  const base: ContentPillar[] = [
    {
      id: `pillar-${slugify(`${topics[0] || 'reach'} mytbrytare`)}`,
      name: `${topics[0] || 'Reach'} mytbrytare`,
      emoji: '🚀',
      source: 'generated',
      description: `Skapar räckvidd genom att bryta vanliga missuppfattningar hos ${pickAnswer(answers, questions, ['målgrupp']) || 'målgruppen'}.`,
      funnelPhase: 'VACK',
      formats: formatList.slice(0, 2),
      exampleTopics: [
        `Myt om ${topics[0] || 'din nisch'}`,
        `Vanligt misstag inom ${topics[1] || 'området'}`,
        `Snabb insikt: ${topics[2] || 'resultat'}`,
      ],
      purpose: 'inspirera',
      frequency: '2x/vecka',
    },
    {
      id: `pillar-${slugify(`${topics[1] || 'guide'} steg för steg`)}`,
      name: `${topics[1] || 'Guide'} steg för steg`,
      emoji: '📚',
      source: 'generated',
      description: `Utbildar i ${topics[1] || 'nyckelområdet'} med tydlig progression och praktiska exempel.`,
      funnelPhase: 'VARM',
      formats: formatList.slice(0, 2),
      exampleTopics: [
        `${topics[1] || 'Ämne'} på 3 nivåer`,
        `Checklista för ${topics[2] || 'resultat'}`,
        `Så undviker du fel i ${topics[0] || 'nischen'}`,
      ],
      purpose: 'utbilda',
      frequency: '2x/vecka',
    },
    {
      id: `pillar-${slugify(`${topics[2] || 'story'} bakom kulisserna`)}`,
      name: `${topics[2] || 'Story'} bakom kulisserna`,
      emoji: '💬',
      source: 'generated',
      description: `Bygger relation med personlig ton (${ton || 'personlig'}) och vardagsnära berättelser.`,
      funnelPhase: 'VARM',
      formats: ['Story', 'Caption'],
      exampleTopics: [
        'Före och efter ett beslut',
        'Lärdom från veckan',
        `Värdering: ${treOrd || 'dina kärnord'}`,
      ],
      purpose: 'bygga relation',
      frequency: '1x/vecka',
    },
    {
      id: `pillar-${slugify(`${topics[3] || 'case'} resultat`)}`,
      name: `${topics[3] || 'Case'} resultat`,
      emoji: '🏆',
      source: 'generated',
      description: `Visar konkreta resultat kopplat till målet "${mal || 'tillväxt'}" och stärker beslut att agera.`,
      funnelPhase: 'AG',
      formats: ['Case', ...formatList.slice(0, 1)],
      exampleTopics: [
        'Före efter kundresa',
        'Vad vi ändrade och varför',
        'Resultat i siffror',
      ],
      purpose: 'sälja',
      frequency: '1x/vecka',
    },
    {
      id: `pillar-${slugify(`${ctaText} fokus`)}`,
      name: `${ctaText} fokus`,
      emoji: '🎯',
      source: 'generated',
      description: `Driver direkt mot din primära CTA (${ctaText}) med tydlig handling och låg friktion.`,
      funnelPhase: dominantPhase === 'AG' ? 'AG' : 'BJUD_IN',
      formats: ['Story CTA', ...formatList.slice(0, 1)],
      exampleTopics: [
        'Inbjudan till nästa steg',
        'Vanlig invändning och svar',
        'Tydlig CTA med tidsram',
      ],
      purpose: 'sälja',
      frequency: '1x/vecka',
    },
  ]

  const manual = existing.filter(p => p.source === 'manual')
  const prompt = buildClaudePillarPrompt({
    karnbudskap,
    forandring,
    treOrd,
    mal,
    delmål: delmal,
    cta,
    ton,
    personlighetsnivå,
    ordlista,
    veckoflöde,
    format,
    återanvändning,
    kpi,
    uppföljning,
    merAv,
  })

  return {
    pillars: [...base, ...manual],
    balanceRecommendation: `Rotera VÄCK -> VÄRM -> ÄG -> BJUD IN varje vecka och låt ${ctaText} vara CTA-spåret 1-2 gånger/vecka för jämn funnel-täckning.`,
    prompt,
  }
}