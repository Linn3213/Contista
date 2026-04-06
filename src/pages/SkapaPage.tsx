import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Layout from '../components/Layout'
import { loadPillars, type ContentPillar } from '../lib/contentStrategy'

// ─── Konfiguration (matchar HTML-filen) ───────────────────────────────────────

const KATEGORIER = [
  { id: 'self-help', name: 'Self-Help', emoji: '🧠' },
  { id: 'self-care', name: 'Self-Care', emoji: '💆‍♀️' },
  { id: 'self-growth', name: 'Self-Growth', emoji: '🌱' },
  { id: 'story', name: 'Story / Personlig', emoji: '📖' },
  { id: 'education', name: 'Education', emoji: '📚' },
  { id: 'bts', name: 'Behind the Scenes', emoji: '🎬' },
  { id: 'inspiration', name: 'Inspiration', emoji: '✨' },
]

const SYFTEN = [
  { id: 'sell', name: 'Säljande', emoji: '💰' },
  { id: 'inspire', name: 'Inspirerande', emoji: '✨' },
  { id: 'educate', name: 'Utbildande', emoji: '📚' },
  { id: 'story', name: 'Storytelling', emoji: '📖' },
  { id: 'trust', name: 'Relation / Förtroende', emoji: '💙' },
  { id: 'objection', name: 'Invändningshantering', emoji: '🛡️' },
  { id: 'awareness', name: 'Awareness', emoji: '👀' },
  { id: 'value', name: 'Värdeskapande', emoji: '💎' },
]

const KANALER = [
  { id: 'ig-post', name: 'Instagram Inlägg', emoji: '📷' },
  { id: 'ig-reel', name: 'Instagram Reel', emoji: '🎬' },
  { id: 'ig-story', name: 'Instagram Story', emoji: '📱' },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵' },
  { id: 'newsletter', name: 'Nyhetsbrev', emoji: '📧' },
  { id: 'blog', name: 'Blogg', emoji: '✍️' },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼' },
  { id: 'sales', name: 'Säljsida', emoji: '💫' },
]

const FORMAT = [
  { id: 'talking-head', name: 'Talking Head', emoji: '🗣️' },
  { id: 'day-in-life', name: 'Day in the Life', emoji: '📅' },
  { id: 'before-after', name: 'Before / After', emoji: '⚡' },
  { id: 'tips', name: 'Tipslista', emoji: '📝' },
  { id: 'qa', name: 'Q&A', emoji: '❓' },
  { id: 'tutorial', name: 'Tutorial', emoji: '🎓' },
  { id: 'bts', name: 'Behind the Scenes', emoji: '🎬' },
  { id: 'transformation', name: 'Transformation Story', emoji: '✨' },
]

const TONER = [
  { id: 'professional', name: 'Professionell', emoji: '👔' },
  { id: 'personal', name: 'Personlig', emoji: '💭' },
  { id: 'vulnerable', name: 'Sårbar', emoji: '💔' },
  { id: 'inspiring', name: 'Inspirerande', emoji: '🌟' },
  { id: 'direct', name: 'Direkt', emoji: '🎯' },
  { id: 'luxury', name: 'Lyxig', emoji: '✨' },
  { id: 'friendly', name: 'Vänlig', emoji: '😊' },
  { id: 'empowering', name: 'Empowering', emoji: '💪' },
]

// ─── Script-templates ─────────────────────────────────────────────────────────

type ScriptStep = { title: string; question: string; placeholder: string; example: string }
type ScriptTemplate = { name: string; description: string; steps: ScriptStep[] }

const SCRIPT_TEMPLATES: Record<string, ScriptTemplate> = {
  linnartistry: {
    name: '🌟 LinnArtistry Framework',
    description: 'Problem → Konflikt → Insikt → Transformation → Resultat → CTA',
    steps: [
      { title: '1. Hook: Vad är problemet?', question: 'Vilket problem har din drömkund? Hur känns det?', placeholder: 'Om du [problem] och inget du gör funkar, lyssna nu.', example: 'Om din bas alltid ser torr ut även när du gör exakt som på TikTok, då måste du höra det här.' },
      { title: '2. Konflikt: Vad har de försökt?', question: 'Lista 2 till 3 saker de gjort fel (visa att du förstår dem)', placeholder: 'Du har redan försökt [A], [B], [C], ändå ser du ingen skillnad.', example: 'Du har bytt foundation fem gånger. Testat nya primers. Viral hack, och ändå funkar det inte.' },
      { title: '3. Twist: Sanningen som ändrar allt', question: 'Vad är "Aha"-ögonblicket?', placeholder: 'Problemet är inte du. Det är att ingen lärt dig grunderna.', example: 'Problemet är inte du. Problemet är att ingen lärt dig grunderna för ditt ansikte.' },
      { title: '4. Story: Transformation Moment', question: 'Berätta om en kund eller elev. Före till efter.', placeholder: 'Jag hjälpte en [person] som [problem]. När vi [lösning] hände: [resultat].', example: 'Jag hade en elev som trodde hon behövde dyr makeup tills vi bytte underton.' },
      { title: '5. Demo: Visa en konkret lösning', question: 'Ge en konkret teknik som funkar', placeholder: 'Testa det här: [en konkret teknik]. Det förändrar allt.', example: 'Om du börjar lägga foundation där du har mest täckning och jobbar utåt...' },
      { title: '6. Outcome: Vad får de?', question: 'Beskriv resultatet i känslor och visuella effekter', placeholder: 'När du gör så här får du [resultat], [känsla] och [visuell effekt].', example: 'Du får en bas som alltid sitter, ser fräschare ut och du slipper tänka på sminket.' },
      { title: '7. CTA: Bjud in till nästa steg', question: 'Mjuk, trygg, guidande uppmaning', placeholder: 'Om du vill lära dig hela metoden, [länk/webinar/kurs].', example: 'Vill du att jag visar dig hela systemet? Kolla webinaret så kommer du förstå ditt ansikte bättre.' },
    ],
  },
  hypothetical: {
    name: '💭 Hypotetisk Berättelse',
    description: 'Fiktivt men kraftfullt scenario för att engagera',
    steps: [
      { title: '1. Sätt scenen', question: 'Skapa ett hypotetiskt scenario din målgrupp känner igen', placeholder: 'Föreställ dig att...', example: 'Föreställ dig att du vaknar imorgon och alla dina makeup-problem är lösta...' },
      { title: '2. Bygg upp spänning', question: 'Vad händer i scenariot? Vad är utmaningen?', placeholder: 'Men plötsligt...', example: 'Men plötsligt inser du att det inte är produkterna, det är tekniken.' },
      { title: '3. Visa möjligheten', question: 'Hur skulle deras liv se ut om detta var sant?', placeholder: 'Tänk om du kunde...', example: 'Tänk om du kunde sminka dig på 5 minuter och känna dig helt säker hela dagen.' },
      { title: '4. Koppla till verkligheten', question: 'Hur kan de göra detta verkligt?', placeholder: 'Det här är faktiskt möjligt när...', example: 'Det här är faktiskt möjligt när du lär dig rätt teknik för just ditt ansikte.' },
    ],
  },
  heros_journey: {
    name: '🦸 Hjältens Resa',
    description: 'Klassisk transformationsberättelse',
    steps: [
      { title: '1. Vanliga världen', question: 'Var befinner sig kunden nu? Vad är deras normaltillstånd?', placeholder: 'Möt [namn] som...', example: 'Möt Sara som varje morgon kämpar med sin makeup i 45 minuter.' },
      { title: '2. Kallelse till äventyr', question: 'Vad får dem att vilja förändras?', placeholder: 'En dag insåg hon att...', example: 'En dag insåg hon att hon missade frukost med barnen varje morgon bara för smink.' },
      { title: '3. Möta mentorn', question: 'Vem eller vad hjälper dem? (Hint: du!)', placeholder: 'Hon hittade...', example: 'Hon hittade min 5-minuters makeup-metod.' },
      { title: '4. Utmaningar och tester', question: 'Vilka utmaningar möter de på vägen?', placeholder: 'Det var inte lätt från början...', example: 'Det var inte lätt från början, gammal vana dör svårt.' },
      { title: '5. Transformation', question: 'Vad är det stora genombrottet?', placeholder: 'Men när hon äntligen...', example: 'Men när hon äntligen lärde sig sina rätta undertoner förändrades allt.' },
      { title: '6. Nya världen', question: 'Hur ser deras liv ut nu?', placeholder: 'Idag...', example: 'Idag sminkar hon sig på 5 minuter och hinner frukost med barnen.' },
    ],
  },
  chronological: {
    name: '📅 Kronologisk Berättelse',
    description: 'Från början till slut, steg för steg',
    steps: [
      { title: '1. Sätt scenen', question: 'Var började historien?', placeholder: 'För [X tid] sedan...', example: 'För 3 år sedan startade jag min makeup-journey helt lost.' },
      { title: '2. Uppbyggnad', question: 'Vad hände sedan?', placeholder: 'Jag försökte..., sedan..., och till slut...', example: 'Jag försökte varje tutorial på YouTube. Köpte "must-haves". Ingenting funkade.' },
      { title: '3. Vändpunkt', question: 'Vad var det stora ögonblicket?', placeholder: 'Tills en dag...', example: 'Tills en dag en makeup artist sa: "Du har fel underton. Därför funkar inget."' },
      { title: '4. Efter vändpunkten', question: 'Vad hände efter insikten?', placeholder: 'Efter det började jag...', example: 'Efter det började jag lära mig grunderna på rätt sätt.' },
      { title: '5. Resultat idag', question: 'Var är du nu?', placeholder: 'Nu, [X tid] senare...', example: 'Nu, 3 år senare, hjälper jag andra undvika samma misstag.' },
    ],
  },
  before_after: {
    name: '🌉 Före, efter och bryggan',
    description: 'Visa transformation först, förklara sedan hur',
    steps: [
      { title: '1. Före: Problemsituationen', question: 'Hur såg det ut innan?', placeholder: 'Tidigare...', example: 'Tidigare spenderade jag 1000 kr i månaden på makeup som aldrig såg bra ut.' },
      { title: '2. Efter: Drömresultatet', question: 'Hur ser det ut nu? (Bygg nyfikenhet)', placeholder: 'Idag...', example: 'Idag sminkar jag mig på fem minuter, ser fräsch hela dagen och sparar pengar.' },
      { title: '3. Bryggan: Hur kom du dit?', question: 'Vad var hemligheten?', placeholder: 'Så här gick jag från A till B:', example: 'Jag slutade följa TikTok-trender och lärde mig i stället grunderna för mitt ansikte.' },
      { title: '4. Applicering', question: 'Hur kan din publik göra samma resa?', placeholder: 'Du kan göra samma sak genom att...', example: 'Du kan göra samma sak genom att lära dig dina undertoner och rätt teknik.' },
    ],
  },
  metaphorical: {
    name: '🎭 Metaforisk Berättelse',
    description: 'Använd liknelser för att förklara koncept',
    steps: [
      { title: '1. Välj metafor', question: 'Vad är din metafor?', placeholder: 'Tänk på [ämne] som...', example: 'Tänk på makeup som att bygga ett hus.' },
      { title: '2. Utveckla liknelsen', question: 'Hur fungerar metaforen?', placeholder: 'Precis som när du...', example: 'Precis som när du bygger ett hus behöver du en stark grund.' },
      { title: '3. Koppla till problemet', question: 'Hur relaterar metaforen till kundens problem?', placeholder: 'Samma sak gäller för...', example: 'Samma sak gäller för din makeup. Om fundamentet är fel funkar inget.' },
      { title: '4. Ge lösningen', question: 'Vad är "rätt sätt" i din metafor?', placeholder: 'Så istället för att..., gör så här...', example: 'Så istället för att köpa dyrare foundation, fixa ditt fundament först.' },
      { title: '5. Avsluta med insikt', question: 'Vad ska de komma ihåg?', placeholder: 'Kom ihåg:', example: 'Kom ihåg: En stark grund håller allt på plats. I huset. Och på ditt ansikte.' },
    ],
  },
  heros_journey_detailed: {
    name: '🦸 Hero\'s Journey (Detaljerad)',
    description: 'Klassisk hjälteresa med alla steg',
    steps: [
      { title: '1. Intro: Var började det?', question: 'X dagar/år sedan upplevde jag vilket problem?', placeholder: 'För [X tid] sedan upplevde jag [problem]...', example: 'För 5 år sedan upplevde jag konstant osäkerhet med min makeup.' },
      { title: '2. Inflection Point: Smärtpunkten', question: 'Vad var konsekvensen?', placeholder: 'På grund av detta var jag [smärta/resultat]...', example: 'På grund av detta var jag osäker varje dag och undvek kameran.' },
      { title: '3. Rising Action: Misslyckade försök', question: 'Vad försökte du som inte funkade?', placeholder: 'Jag försökte [misslyckade försök]...', example: 'Jag testade varje hack och köpte dyra produkter utan resultat.' },
      { title: '4. Climax: Lösningen', question: 'Vad var vändpunkten?', placeholder: 'Till slut hittade jag [lösningen]...', example: 'Till slut hittade jag att underton och placering var nyckeln.' },
      { title: '5. Falling Action: Resultaten', question: 'Vad hände när du gjorde rätt?', placeholder: 'När jag började göra det här fick jag [resultat]...', example: 'När jag jobbade med rätt teknik blev resultatet professionellt på minuter.' },
      { title: '6. Resolution: Varför du gör det här', question: 'Vem hjälper du nu?', placeholder: 'På grund av detta startade jag [tjänst/verksamhet]...', example: 'På grund av detta startade jag ett system för att hjälpa andra undvika samma frustration.' },
    ],
  },
  about_me: {
    name: '👋 About Me',
    description: 'Personlig introduktion och din resa',
    steps: [
      { title: '1. Introduktion', question: 'Vem är du och var var du tidigare?', placeholder: 'Hej, jag är [namn], och för X år sedan var jag [startpunkt]...', example: 'Hej, jag är Linn, och för några år sedan fick jag aldrig basen att funka.' },
      { title: '2. Vändpunkten', question: 'Vad förändrade allt?', placeholder: 'Allt förändrades när [livshändelse]...', example: 'Allt förändrades när jag lärde mig hur undertoner faktiskt fungerar.' },
      { title: '3. Insikten', question: 'Vad blev ditt aha?', placeholder: 'Det fick mig att inse [insikt]...', example: 'Jag insåg att generella tutorials inte var gjorda för mitt ansikte.' },
      { title: '4. Förändringen', question: 'Vad började du göra annorlunda?', placeholder: 'Så jag började [förändring], vilket gav [resultat]...', example: 'Jag började följa en metod, och resultaten kom snabbt.' },
      { title: '5. Missionen', question: 'Vem hjälper du nu?', placeholder: 'Nu hjälper jag [målgruppen] att gå från [smärta] till [resultat].', example: 'Nu hjälper jag kvinnor gå från osäkerhet till enkel, säker vardagsmakeup.' },
    ],
  },
  the_lesson: {
    name: '📚 The Lesson',
    description: 'Från motgång till läxa',
    steps: [
      { title: '1. Setback: Motgången', question: 'Vad gick fel?', placeholder: 'Jag misslyckades med [situation]...', example: 'Jag fick aldrig foundation att hålla hela dagen.' },
      { title: '2. Pain Points: Smärtan', question: 'Hur påverkade det dig?', placeholder: 'Det fick mig att känna [känsla]...', example: 'Det gjorde mig frustrerad och osäker varje morgon.' },
      { title: '3. Resolution: Lösningen', question: 'Hur löste du det?', placeholder: 'Jag insåg att [lösning]...', example: 'Jag insåg att tekniken var viktigare än fler produkter.' },
      { title: '4. Lesson: Läxan', question: 'Vad är lärdomen?', placeholder: 'Läxan är: [key takeaway]...', example: 'Läxan är att rätt grund slår trendiga hacks varje gång.' },
    ],
  },
  the_big_dream: {
    name: '💫 The Big Dream',
    description: 'Från dröm till verklighet',
    steps: [
      { title: '1. Introducera drömmen', question: 'Vad var din stora dröm?', placeholder: 'Min dröm var att [mål]...', example: 'Min dröm var att hjälpa fler känna sig trygga i sin makeup.' },
      { title: '2. Action', question: 'Vilket första steg tog du?', placeholder: 'Jag började med [första action]...', example: 'Jag började lära ut min metod till små grupper.' },
      { title: '3. Idag', question: 'Var är du nu?', placeholder: 'Idag har jag [nuvarande status]...', example: 'Idag har hundratals personer använt metoden med resultat.' },
      { title: '4. CTA', question: 'Hur kan de följa med?', placeholder: 'Vill du följa resan? [CTA]...', example: 'Vill du följa resan? Följ mig för dagliga tips.' },
    ],
  },
  challenge_victory: {
    name: '🏆 Challenge → Victory',
    description: 'Från tvivel till triumf',
    steps: [
      { title: '1. Doubt: Tvivlet', question: 'Vad tvivlade du på?', placeholder: 'Jag tvivlade på att [rädsla]...', example: 'Jag tvivlade på att jag någonsin skulle få snabb och snygg makeup.' },
      { title: '2. Initial Struggle: Kampen', question: 'Hur såg kampen ut?', placeholder: 'I början var det [svårigheter]...', example: 'I början var det kaos med fel färger och ojämnt resultat.' },
      { title: '3. Turning Point: Vändpunkten', question: 'Vad förändrades?', placeholder: 'Men när jag [förändring]...', example: 'Men när jag justerade underton och teknik ändrades allt.' },
      { title: '4. The Solution: Lösningen', question: 'Vad funkade till slut?', placeholder: 'Lösningen var [metod]...', example: 'Lösningen var en enkel metod anpassad till mitt ansikte.' },
      { title: '5. The Transformation: Resultatet', question: 'Hur ser det ut nu?', placeholder: 'Nu kan jag [resultat]...', example: 'Nu kan jag få ett bra resultat på fem minuter.' },
      { title: '6. Myth Bust: Avliva myten', question: 'Vilken myt vill du krossa?', placeholder: 'Myten att [falsk tro] är inte sann...', example: 'Myten att dyr makeup alltid ger bättre resultat stämmer inte.' },
    ],
  },
  the_breakthrough: {
    name: '💡 The Breakthrough',
    description: 'Snabb transformation story',
    steps: [
      { title: '1. Problem: Utgångsläget', question: 'Vad var problemet?', placeholder: 'Problemet var att [situation]...', example: 'Problemet var att min foundation alltid såg fläckig ut.' },
      { title: '2. Breakthrough: Genombrott', question: 'Vad var aha-ögonblicket?', placeholder: 'Genombrottet kom när jag [insikt]...', example: 'Genombrottet kom när jag förstod min underton.' },
      { title: '3. Result: Resultatet', question: 'Vad blev resultatet?', placeholder: 'Nu [resultat/CTA]...', example: 'Nu får jag jämnt resultat snabbt. Vill du lära dig samma sak?' },
    ],
  },
}

// ─── Hook-kategorier (engelska) ───────────────────────────────────────────────

const VIRAL_HOOK_CATEGORIES = [
  { id: 'all', name: 'Alla (949)', category: null },
  { id: 'educational', name: 'Educational (472)', category: 'educational' },
  { id: 'storytelling', name: 'Storytelling (368)', category: 'storytelling' },
  { id: 'myth_busting', name: 'Myth Busting (58)', category: 'myth_busting' },
  { id: 'comparison', name: 'Comparison (31)', category: 'comparison' },
  { id: 'authority', name: 'Authority (9)', category: 'authority' },
  { id: 'random', name: 'Random (11)', category: 'random' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type DreamCustomer = { id: string; name: string; answers: Record<string, string> }
type HookRow = { id: string; text: string; category: string; language: string }
type StoryRow = { id: string; content: string; category: string }
type CtaRow = { id: string; content: string; category: string }
type MetaItem = { id: string; name: string; emoji: string; custom?: boolean }
type SavedPostRow = {
  id: string
  title: string | null
  content: string
  platform: string | null
  status: 'draft' | 'idea' | 'published' | 'scheduled'
  purpose: string | null
  tone: string | null
  audience: string | null
  dream_customer_id?: string | null
  created_at: string
}

type SkapaSessionState = {
  kategori: string
  syfte: string
  kanal: string
  format: string
  ton: string
  freeThoughts: string
  selectedTemplate: string
  scriptSteps: Record<number, string>
  hookTab: 'sv' | 'viral'
  viralCategory: string
  hookSearch: string
  ctaTab: 'sv' | 'sales'
  draft: string
  selectedDCId: string | null
  undoDraftHistory: string[]
  redoDraftHistory: string[]
  savedAt: string
}

const AVATAR_STYLE_CLASS: Record<string, string> = {
  rose: 'bg-accent-rose/15 text-accent-rose',
  sage: 'bg-accent-sage/20 text-accent-sage',
  green: 'bg-accent-green/20 text-accent-green',
  primary: 'bg-primary/10 text-primary',
}

function loadCustomMeta(userId: string, key: string): MetaItem[] {
  try {
    const raw = localStorage.getItem(`contista.skapa.custom.${key}.${userId}`)
    if (!raw) return []
    return JSON.parse(raw) as MetaItem[]
  } catch {
    return []
  }
}

function saveCustomMeta(userId: string, key: string, items: MetaItem[]) {
  try {
    localStorage.setItem(`contista.skapa.custom.${key}.${userId}`, JSON.stringify(items))
  } catch {
    // Ignore storage failures to keep UI responsive.
  }
}

function getSkapaSessionKey(userId: string) {
  return `contista.skapa.session.${userId}`
}

function loadSkapaSession(userId: string): SkapaSessionState | null {
  try {
    const raw = localStorage.getItem(getSkapaSessionKey(userId))
    if (!raw) return null
    return JSON.parse(raw) as SkapaSessionState
  } catch {
    return null
  }
}

function saveSkapaSession(userId: string, data: SkapaSessionState) {
  try {
    localStorage.setItem(getSkapaSessionKey(userId), JSON.stringify(data))
  } catch {
    // Ignore storage failures to avoid breaking editing flow.
  }
}

// ─── Chip-komponent ───────────────────────────────────────────────────────────

function ChipGrid({ items, selected, onSelect }: {
  items: { id: string; name: string; emoji: string }[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(selected === item.id ? '' : item.id)}
          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
            selected === item.id
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-background border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
          }`}
        >
          {item.emoji} {item.name}
        </button>
      ))}
    </div>
  )
}

// ─── Section-wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [showInfo, setShowInfo] = useState(false)
  const normalizedTitle = title.replace(/^[^\p{L}\p{N}]+/u, '').trim()
  const sectionKey = normalizedTitle.replace(/^Välj\s+/, '')
  const aiTips: Record<string, string> = {
    'Pågående inlägg': 'Syfte: Fortsätt där du slutade. Här hittar du dina senaste utkast så att du kan redigera, förbättra och publicera utan att tappa fart.',
    'Drömkund': 'Syfte: Skriv för en person, inte för alla. När du väljer drömkund blir hela inlägget mer relevant och lättare att agera på.',
    'Fritänkande': 'Syfte: Töm huvudet innan du strukturerar. Här fångar du råa idéer, problem och insikter som senare blir tydlig storytelling.',
    'Script Template Builder': 'Syfte: Ge innehållet en tydlig röd tråd. En bra struktur hjälper läsaren att förstå, känna och agera.',
    'Kategori': 'Syfte: Knyt inlägget till rätt innehållspelare så att ditt content bygger varumärke strategiskt över tid.',
    'Syfte': 'Syfte: Bestäm vad inlägget ska göra. Ett inlägg bör ha ett huvudmål: attrahera, utbilda, bygga förtroende eller konvertera.',
    'Kanal': 'Syfte: Anpassa budskapet till var det publiceras. Samma idé behöver olika längd, tempo och vinkel beroende på kanal.',
    'Format': 'Syfte: Välj form som matchar budskapet. Rätt format gör innehållet lättare att ta till sig och ökar retention.',
    'Ton': 'Syfte: Skapa igenkänning. En konsekvent ton bygger relation, varumärkesminne och förtroende hos målgruppen.',
    'Hooks': 'Syfte: Fånga uppmärksamheten snabbt. En stark hook ska vara tydlig, relevant och öppna ett nyfikenhetsgap.',
    'Storytelling': 'Syfte: Flytta läsaren från problem till lösning. Berättelser gör kunskap konkret och skapar emotionell förankring.',
    'CTA': 'Syfte: Förvandla konsumtion till handling. En tydlig CTA visar nästa steg och ökar sannolikheten för konvertering.',
    'Slututkast': 'Syfte: Kvalitetssäkra innan publicering. Kontrollera tydlighet, flyt, relevans och att CTA matchar inläggets mål.',
  }

  const infoText = aiTips[sectionKey] || aiTips[normalizedTitle] || 'Syfte: Välj vad du vill uppnå i det här steget innan du går vidare.'

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-black/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
        <button
          onClick={() => setShowInfo(v => !v)}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary/80 hover:text-primary transition-colors"
          title="Information"
        >
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-semibold leading-none">i</span>
          Guide
        </button>
      </div>
      {showInfo && (
        <div className="mb-4 p-3 rounded-xl bg-primary/8 border border-primary/20">
          <p className="text-xs leading-relaxed text-on-surface-variant">{infoText}</p>
        </div>
      )}
      {children}
    </div>
  )
}

// ─── Huvud-komponent ──────────────────────────────────────────────────────────

export default function SkapaPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const draftRef = useRef<HTMLTextAreaElement>(null)

  // Metadata-val
  const [kategori, setKategori] = useState('')
  const [syfte, setSyfte] = useState('')
  const [kanal, setKanal] = useState('')
  const [format, setFormat] = useState('')
  const [ton, setTon] = useState('')
  const [customSyften, setCustomSyften] = useState<MetaItem[]>([])
  const [customKanaler, setCustomKanaler] = useState<MetaItem[]>([])
  const [customFormat, setCustomFormat] = useState<MetaItem[]>([])
  const [customToner, setCustomToner] = useState<MetaItem[]>([])

  const [newSyfte, setNewSyfte] = useState('')
  const [newKanal, setNewKanal] = useState('')
  const [newFormat, setNewFormat] = useState('')
  const [newTon, setNewTon] = useState('')
  const [strategyPillars, setStrategyPillars] = useState<ContentPillar[]>([])

  // Drömkund
  const [dreamCustomers, setDreamCustomers] = useState<DreamCustomer[]>([])
  const [selectedDC, setSelectedDC] = useState<DreamCustomer | null>(null)

  // Fritänkande
  const [freeThoughts, setFreeThoughts] = useState('')

  // Script-builder
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [scriptSteps, setScriptSteps] = useState<Record<number, string>>({})

  // Hooks
  const [hookTab, setHookTab] = useState<'sv' | 'viral'>('sv')
  const [svHooks, setSvHooks] = useState<HookRow[]>([])
  const [viralHooks, setViralHooks] = useState<HookRow[]>([])
  const [viralCategory, setViralCategory] = useState('')
  const [hookSearch, setHookSearch] = useState('')
  const [loadingHooks, setLoadingHooks] = useState(false)

  // Storytelling
  const [stories, setStories] = useState<StoryRow[]>([])

  // CTAs
  const [ctas, setCtas] = useState<CtaRow[]>([])
  const [ctaTab, setCtaTab] = useState<'sv' | 'sales'>('sv')

  // Draft
  const [draft, setDraft] = useState('')
  const [charCount, setCharCount] = useState(0)

  // Spara
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [savedDrafts, setSavedDrafts] = useState<SavedPostRow[]>([])
  const [loadingSavedDrafts, setLoadingSavedDrafts] = useState(false)
  const [sessionRestored, setSessionRestored] = useState(false)
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null)
  const [isAutosaving, setIsAutosaving] = useState(false)
  const [undoDraftHistory, setUndoDraftHistory] = useState<string[]>([])
  const [redoDraftHistory, setRedoDraftHistory] = useState<string[]>([])

  const pushUndoDraft = useCallback((value: string) => {
    setUndoDraftHistory(prev => {
      if (prev[prev.length - 1] === value) return prev
      const next = [...prev, value]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })
    setRedoDraftHistory([])
  }, [])

  // ─── Ladda data ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return
    const session = loadSkapaSession(user.id)

    if (session) {
      setKategori(session.kategori || '')
      setSyfte(session.syfte || '')
      setKanal(session.kanal || '')
      setFormat(session.format || '')
      setTon(session.ton || '')
      setFreeThoughts(session.freeThoughts || '')
      setSelectedTemplate(session.selectedTemplate || '')
      setScriptSteps(session.scriptSteps || {})
      setHookTab(session.hookTab || 'sv')
      setViralCategory(session.viralCategory || '')
      setHookSearch(session.hookSearch || '')
      setCtaTab(session.ctaTab || 'sv')
      setDraft(session.draft || '')
      setCharCount((session.draft || '').length)
      setUndoDraftHistory(Array.isArray(session.undoDraftHistory) ? session.undoDraftHistory.slice(-3) : [])
      setRedoDraftHistory(Array.isArray(session.redoDraftHistory) ? session.redoDraftHistory.slice(-3) : [])
      if (session.savedAt) setLastAutoSavedAt(session.savedAt)
      setSessionRestored(true)
    }

    // Drömkunder
    supabase.from('dream_customers').select('id, name, answers').eq('user_id', user.id).then(({ data }) => {
      if (data) {
        setDreamCustomers(data)
        if (session?.selectedDCId) {
          const found = data.find(dc => dc.id === session.selectedDCId)
          if (found) setSelectedDC(found)
        }
      }
    })
    // Svenska hooks (begränsa till 200 för prestanda)
    setLoadingHooks(true)
    supabase.from('hooks').select('id, text, category, language').eq('language', 'sv').limit(200).then(({ data }) => {
      if (data) setSvHooks(data)
      setLoadingHooks(false)
    })
    // Storytelling
    supabase.from('storytelling_structures').select('id, content, category').limit(50).then(({ data }) => {
      if (data) setStories(data)
    })
    // CTAs
    supabase.from('ctas').select('id, content, category').limit(60).then(({ data }) => {
      if (data) setCtas(data)
    })

    setLoadingSavedDrafts(true)
    supabase
      .from('saved_posts')
      .select('id, title, content, platform, status, purpose, tone, audience, dream_customer_id, created_at')
      .eq('user_id', user.id)
      .in('status', ['draft', 'scheduled'])
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) setSavedDrafts(data as SavedPostRow[])
        setLoadingSavedDrafts(false)
      })

    setCustomSyften(loadCustomMeta(user.id, 'syften'))
    setCustomKanaler(loadCustomMeta(user.id, 'kanaler'))
    setCustomFormat(loadCustomMeta(user.id, 'format'))
    setCustomToner(loadCustomMeta(user.id, 'toner'))
    setStrategyPillars(loadPillars(user.id))

    const prefill = localStorage.getItem(`contista.prefill.freeThoughts.${user.id}`)
    if (prefill) {
      setFreeThoughts(prefill)
      setDraft(prefill)
      setCharCount(prefill.length)
      try {
        localStorage.removeItem(`contista.prefill.freeThoughts.${user.id}`)
      } catch {
        // Ignore storage failures.
      }
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    const syncPillars = () => setStrategyPillars(loadPillars(user.id))
    window.addEventListener('focus', syncPillars)
    return () => window.removeEventListener('focus', syncPillars)
  }, [user])

  useEffect(() => {
    if (!user) return
    setIsAutosaving(true)
    const timeoutId = window.setTimeout(() => {
      const now = new Date().toISOString()
      saveSkapaSession(user.id, {
        kategori,
        syfte,
        kanal,
        format,
        ton,
        freeThoughts,
        selectedTemplate,
        scriptSteps,
        hookTab,
        viralCategory,
        hookSearch,
        ctaTab,
        draft,
        selectedDCId: selectedDC?.id || null,
        undoDraftHistory,
        redoDraftHistory,
        savedAt: now,
      })
      setLastAutoSavedAt(now)
      setIsAutosaving(false)
    }, 350)

    return () => {
      window.clearTimeout(timeoutId)
      setIsAutosaving(false)
    }
  }, [
    user,
    kategori,
    syfte,
    kanal,
    format,
    ton,
    freeThoughts,
    selectedTemplate,
    scriptSteps,
    hookTab,
    viralCategory,
    hookSearch,
    ctaTab,
    draft,
    selectedDC,
    undoDraftHistory,
    redoDraftHistory,
  ])

  // Ladda viral hooks när kategori ändras
  useEffect(() => {
    let query = supabase.from('hooks').select('id, text, category, language').eq('language', 'en').limit(50)
    if (viralCategory) query = query.eq('category', viralCategory)
    query.then(({ data }) => { if (data) setViralHooks(data) })
  }, [viralCategory])

  // ─── Inject-funktioner ───────────────────────────────────────────────────────

  const prependToDraft = useCallback((text: string) => {
    setDraft(prev => {
      const next = text + (prev ? '\n\n' + prev : '')
      if (next !== prev) pushUndoDraft(prev)
      setCharCount(next.length)
      return next
    })
    draftRef.current?.focus()
  }, [pushUndoDraft])

  const appendToDraft = useCallback((text: string) => {
    setDraft(prev => {
      const next = (prev ? prev + '\n\n' : '') + text
      if (next !== prev) pushUndoDraft(prev)
      setCharCount(next.length)
      return next
    })
    draftRef.current?.focus()
  }, [pushUndoDraft])

  const generateScript = () => {
    if (!selectedTemplate) return
    const tmpl = SCRIPT_TEMPLATES[selectedTemplate]
    const lines = tmpl.steps
      .map((step, i) => scriptSteps[i] ? `${step.title}\n${scriptSteps[i]}` : null)
      .filter(Boolean)
      .join('\n\n')
    if (lines) {
      pushUndoDraft(draft)
      setDraft(lines)
      setCharCount(lines.length)
    }
  }

  // ─── Spara post ─────────────────────────────────────────────────────────────

  const savePost = async () => {
    if (!user || !draft.trim()) return
    setSaving(true)
    const title = draft.split('\n')[0].slice(0, 60) || 'Utan titel'
    const { error } = await supabase.from('saved_posts').insert({
      user_id: user.id,
      title,
      content: draft,
      platform: kanal || null,
      status: 'draft',
      purpose: syfte || null,
      audience: selectedDC?.name || null,
      tone: ton || null,
      dream_customer_id: selectedDC?.id || null,
    })
    setSaving(false)
    if (error) {
      showToast('Kunde inte spara utkastet')
      return
    }

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
    showToast('Utkast sparat ✓')
  }

  const copyDraft = async () => {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showToast('Kopierat ✓')
    } catch {
      showToast('Kunde inte kopiera texten')
    }
  }

  const loadSavedDraft = (post: SavedPostRow) => {
    pushUndoDraft(draft)
    setDraft(post.content || '')
    setCharCount((post.content || '').length)
    if (post.purpose) setSyfte(post.purpose)
    if (post.platform) setKanal(post.platform)
    if (post.tone) setTon(post.tone)

    if (post.dream_customer_id) {
      const found = dreamCustomers.find(dc => dc.id === post.dream_customer_id)
      if (found) setSelectedDC(found)
    } else if (post.audience) {
      const byName = dreamCustomers.find(dc => dc.name === post.audience)
      if (byName) setSelectedDC(byName)
    }

    draftRef.current?.focus()
  }

  const deleteSavedDraft = async (id: string) => {
    if (!confirm('Ta bort detta pågående inlägg?')) return
    await supabase.from('saved_posts').delete().eq('id', id)
    setSavedDrafts(prev => prev.filter(p => p.id !== id))
  }

  const clearAll = () => {
    pushUndoDraft(draft)
    setDraft('')
    setCharCount(0)
    setFreeThoughts('')
    setScriptSteps({})
    setSelectedTemplate('')
    setKategori('')
    setSyfte('')
    setKanal('')
    setFormat('')
    setTon('')
    setSelectedDC(null)
    if (user) {
      try {
        localStorage.removeItem(getSkapaSessionKey(user.id))
      } catch {
        // Ignore storage failures.
      }
    }
  }

  const undoLastDraftChange = () => {
    if (undoDraftHistory.length === 0) return
    const previous = undoDraftHistory[undoDraftHistory.length - 1]
    setUndoDraftHistory(prev => prev.slice(0, -1))
    setRedoDraftHistory(prev => {
      const next = [...prev, draft]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })
    setDraft(previous)
    setCharCount(previous.length)
    draftRef.current?.focus()
    showToast('Ångrade senaste ändring')
  }

  const redoLastDraftChange = () => {
    if (redoDraftHistory.length === 0) return
    const nextValue = redoDraftHistory[redoDraftHistory.length - 1]
    setRedoDraftHistory(prev => prev.slice(0, -1))
    setUndoDraftHistory(prev => {
      const next = [...prev, draft]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })
    setDraft(nextValue)
    setCharCount(nextValue.length)
    draftRef.current?.focus()
    showToast('Gjorde om senaste ändring')
  }

  const handleUndoShortcut = (event: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean; key: string; preventDefault: () => void }) => {
    const isUndo = (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z'
    const isRedo = ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'z') || (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'y')
    if (isUndo && undoDraftHistory.length > 0) {
      event.preventDefault()
      undoLastDraftChange()
      return
    }
    if (isRedo && redoDraftHistory.length > 0) {
      event.preventDefault()
      redoLastDraftChange()
    }
  }

  const addCustomMeta = (
    key: 'kategorier' | 'syften' | 'kanaler' | 'format' | 'toner',
    value: string,
    setter: (items: MetaItem[]) => void,
    current: MetaItem[],
    emoji: string
  ) => {
    if (!user) return
    const text = value.trim()
    if (!text) return
    const item: MetaItem = { id: `custom-${Date.now()}`, name: text, emoji, custom: true }
    const next = [...current, item]
    setter(next)
    saveCustomMeta(user.id, key, next)
  }

  const removeCustomMeta = (
    key: 'kategorier' | 'syften' | 'kanaler' | 'format' | 'toner',
    id: string,
    setter: (items: MetaItem[]) => void,
    current: MetaItem[]
  ) => {
    if (!user) return
    const next = current.filter(i => i.id !== id)
    setter(next)
    saveCustomMeta(user.id, key, next)
  }

  // ─── Gefiltrade hooks ────────────────────────────────────────────────────────

  const filteredSvHooks = hookSearch
    ? svHooks.filter(h => h.text.toLowerCase().includes(hookSearch.toLowerCase()))
    : svHooks

  const filteredViralHooks = hookSearch
    ? viralHooks.filter(h => h.text.toLowerCase().includes(hookSearch.toLowerCase()))
    : viralHooks

  const currentHooks = hookTab === 'sv' ? filteredSvHooks : filteredViralHooks
  const svCtas = ctas.filter(c => c.category === 'cta')
  const salesCtas = ctas.filter(c => c.category === 'sales')
  const currentCtas = ctaTab === 'sv' ? svCtas : salesCtas

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-16">

        {/* Rubrik */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="label-xs text-primary/70 mb-1">Contentskaparen</p>
            <h1 className="serif-headline text-3xl md:text-4xl">Contentskaparen</h1>
            {sessionRestored && (
              <p className="text-[11px] text-primary/70 mt-1">Tidigare session återställd</p>
            )}
            {lastAutoSavedAt && (
              <p className="text-[11px] text-on-surface-variant/60 mt-1">
                Senast autosparad: {new Date(lastAutoSavedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            {isAutosaving && (
              <p className="text-[11px] text-primary/70 mt-1">Autosparar...</p>
            )}
          </div>
          <button
            onClick={() => navigate('/bibliotek')}
            className="text-xs text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Bibliotek
          </button>
        </div>

        {/* Huvud-grid: vänster col + sticky sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

          {/* ── Vänster kolumn ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* 0. Pågående inlägg */}
            <Section title="📂 Pågående inlägg">
              {loadingSavedDrafts ? (
                <p className="text-xs text-on-surface-variant/50">Laddar...</p>
              ) : savedDrafts.length === 0 ? (
                <p className="text-xs text-on-surface-variant/50">Inga pågående inlägg ännu.</p>
              ) : (
                <div className="space-y-2">
                  {savedDrafts.map(post => (
                    <div key={post.id} className="p-3 rounded-xl border border-outline-variant/20 bg-background">
                      <div className="flex items-start justify-between gap-3">
                        <button onClick={() => loadSavedDraft(post)} className="text-left flex-1 min-w-0">
                          <p className="text-xs font-semibold text-on-surface truncate">{post.title || 'Utan titel'}</p>
                          <p className="text-[11px] text-on-surface-variant/70 mt-1 line-clamp-2">{post.content}</p>
                          <p className="text-[10px] text-on-surface-variant/40 mt-1">{new Date(post.created_at).toLocaleDateString('sv-SE')}</p>
                        </button>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => loadSavedDraft(post)} className="text-[10px] px-2 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant/70 hover:text-primary hover:border-primary/40">
                            Ladda
                          </button>
                          <button onClick={() => deleteSavedDraft(post.id)} className="text-[10px] px-2 py-1 rounded-full border border-red-100 text-red-400 hover:border-red-200">
                            Ta bort
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* 1. Drömkund */}
            <Section title="🎯 Välj Drömkund">
              {dreamCustomers.length === 0 ? (
                <div className="flex items-center gap-3">
                  <p className="text-xs text-on-surface-variant flex-1">
                    Inga sparade drömkunder ännu.
                  </p>
                  <button
                    onClick={() => navigate('/dreamcustomer')}
                    className="text-xs text-primary underline underline-offset-2"
                  >
                    Skapa drömkund →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {dreamCustomers.map(dc => (
                    (() => {
                      const avatarEmoji = dc.answers?.__avatar_emoji || '👤'
                      const avatarStyle = dc.answers?.__avatar_style || 'primary'
                      const avatarClass = AVATAR_STYLE_CLASS[avatarStyle] || AVATAR_STYLE_CLASS.primary
                      return (
                    <button
                      key={dc.id}
                      onClick={() => setSelectedDC(selectedDC?.id === dc.id ? null : dc)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedDC?.id === dc.id
                          ? 'border-primary bg-primary/8 text-on-surface'
                          : 'border-outline-variant/20 bg-background hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base mb-1 ${avatarClass}`}>
                        {avatarEmoji}
                      </div>
                      <p className="text-xs font-semibold text-on-surface truncate">{dc.name}</p>
                      {selectedDC?.id === dc.id && (
                        <p className="text-[10px] text-primary mt-0.5">Vald</p>
                      )}
                    </button>
                      )
                    })()
                  ))}
                </div>
              )}

              {selectedDC && (
                <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <p className="text-[10px] uppercase tracking-widest text-primary/70 mb-1">Aktiv persona</p>
                  <p className="text-xs text-on-surface font-semibold">{selectedDC.name}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                    {Object.entries(selectedDC.answers || {})
                      .filter(([k, v]) => !k.startsWith('__') && !!String(v).trim())
                      .slice(0, 2)
                      .map(([, v]) => String(v))
                      .join(' · ') || 'Ingen persona-text ännu'}
                  </p>
                </div>
              )}
            </Section>

            {/* 2. Fritänkande */}
            <Section title="💭 Fritänkande">
              <p className="text-xs text-on-surface-variant mb-3">
                Dumpa dina tankar, idéer och koncept fritt. Ingen struktur behövs här.
              </p>
              <textarea
                value={freeThoughts}
                onChange={e => setFreeThoughts(e.target.value)}
                rows={5}
                placeholder="Skriv allt som kommer upp. Associationer, känslor, nyckelord och minnen."
                className="w-full input-field resize-y text-sm leading-relaxed"
              />
              {freeThoughts && (
                <button
                  onClick={() => appendToDraft(freeThoughts)}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  → Skicka till utkast
                </button>
              )}
            </Section>

            {/* 3. Script Template Builder */}
            <Section title="📝 Script Template Builder">
              <p className="text-xs text-on-surface-variant mb-3">
                Välj ett storytelling-ramverk och fyll i delarna. Klicka "Generera" för att skapa ditt utkast.
              </p>
              <p className="text-[11px] text-on-surface-variant/70 mb-3">
                Antal templates: <strong>{Object.keys(SCRIPT_TEMPLATES).length}</strong>
              </p>
              <select
                value={selectedTemplate}
                onChange={e => { setSelectedTemplate(e.target.value); setScriptSteps({}) }}
                className="input-field text-sm mb-4"
              >
                <option value="">Välj template</option>
                {Object.entries(SCRIPT_TEMPLATES).map(([key, tmpl]) => (
                  <option key={key} value={key}>{tmpl.name}</option>
                ))}
              </select>

              {selectedTemplate && (() => {
                const tmpl = SCRIPT_TEMPLATES[selectedTemplate]
                return (
                  <div className="space-y-4">
                    <div className="bg-primary/5 rounded-xl p-3">
                      <p className="text-xs font-semibold text-on-surface">{tmpl.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{tmpl.description}</p>
                    </div>
                    {tmpl.steps.map((step, i) => (
                      <div key={i} className="border-l-2 border-primary/30 pl-4">
                        <p className="text-xs font-semibold text-on-surface mb-1">{step.title}</p>
                        <p className="text-[11px] text-on-surface-variant mb-2">{step.question}</p>
                        <textarea
                          rows={3}
                          value={scriptSteps[i] || ''}
                          onChange={e => setScriptSteps(prev => ({ ...prev, [i]: e.target.value }))}
                          placeholder={step.placeholder}
                          className="w-full input-field text-sm resize-y"
                        />
                        <p className="text-[10px] text-on-surface-variant/60 italic mt-1">
                          Exempel: {step.example}
                        </p>
                      </div>
                    ))}
                    <button
                      onClick={generateScript}
                      className="w-full btn-primary py-3.5 text-sm"
                    >
                      ✨ Generera script → Utkast
                    </button>
                  </div>
                )
              })()}
            </Section>

            {/* 4. Pelare */}
            <Section title="🎯 Välj Pelare">
              <ChipGrid
                items={[
                  ...strategyPillars.map(p => ({ id: p.id, name: p.name, emoji: p.emoji })),
                  ...KATEGORIER,
                ]}
                selected={kategori}
                onSelect={setKategori}
              />
              <p className="mt-3 text-[11px] text-on-surface-variant/70">
                Pelare hämtas från Contentstrategi. Generera eller lägg till nya pelare där för att använda dem här.
              </p>
              <button
                onClick={() => navigate('/contentstrategi')}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Öppna Contentstrategi →
              </button>
            </Section>

            {/* 5. Syfte */}
            <Section title="🎯 Välj Syfte">
              <ChipGrid items={[...SYFTEN, ...customSyften]} selected={syfte} onSelect={setSyfte} />
              <div className="mt-3 flex flex-wrap gap-2">
                {customSyften.map(c => (
                  <button
                    key={c.id}
                    onClick={() => removeCustomMeta('syften', c.id, setCustomSyften, customSyften)}
                    className="text-[10px] px-2 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant/70 hover:text-red-400 hover:border-red-200"
                  >
                    Ta bort {c.name}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input value={newSyfte} onChange={e => setNewSyfte(e.target.value)} placeholder="Lägg till eget syfte" className="input-field text-xs" />
                <button onClick={() => { addCustomMeta('syften', newSyfte, setCustomSyften, customSyften, '🎯'); setNewSyfte('') }} className="px-3 py-2 rounded-xl bg-primary text-white text-xs">Lägg till</button>
              </div>
            </Section>

            {/* 6. Kanal */}
            <Section title="📱 Välj Kanal">
              <ChipGrid items={[...KANALER, ...customKanaler]} selected={kanal} onSelect={setKanal} />
              <div className="mt-3 flex flex-wrap gap-2">
                {customKanaler.map(c => (
                  <button
                    key={c.id}
                    onClick={() => removeCustomMeta('kanaler', c.id, setCustomKanaler, customKanaler)}
                    className="text-[10px] px-2 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant/70 hover:text-red-400 hover:border-red-200"
                  >
                    Ta bort {c.name}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input value={newKanal} onChange={e => setNewKanal(e.target.value)} placeholder="Lägg till egen kanal" className="input-field text-xs" />
                <button onClick={() => { addCustomMeta('kanaler', newKanal, setCustomKanaler, customKanaler, '📱'); setNewKanal('') }} className="px-3 py-2 rounded-xl bg-primary text-white text-xs">Lägg till</button>
              </div>
            </Section>

            {/* 7. Format */}
            <Section title="🎬 Välj Format">
              <ChipGrid items={[...FORMAT, ...customFormat]} selected={format} onSelect={setFormat} />
              <div className="mt-3 flex flex-wrap gap-2">
                {customFormat.map(c => (
                  <button
                    key={c.id}
                    onClick={() => removeCustomMeta('format', c.id, setCustomFormat, customFormat)}
                    className="text-[10px] px-2 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant/70 hover:text-red-400 hover:border-red-200"
                  >
                    Ta bort {c.name}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input value={newFormat} onChange={e => setNewFormat(e.target.value)} placeholder="Lägg till eget format" className="input-field text-xs" />
                <button onClick={() => { addCustomMeta('format', newFormat, setCustomFormat, customFormat, '🎬'); setNewFormat('') }} className="px-3 py-2 rounded-xl bg-primary text-white text-xs">Lägg till</button>
              </div>
            </Section>

            {/* 8. Ton */}
            <Section title="🎨 Välj Ton">
              <ChipGrid items={[...TONER, ...customToner]} selected={ton} onSelect={setTon} />
              <div className="mt-3 flex flex-wrap gap-2">
                {customToner.map(c => (
                  <button
                    key={c.id}
                    onClick={() => removeCustomMeta('toner', c.id, setCustomToner, customToner)}
                    className="text-[10px] px-2 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant/70 hover:text-red-400 hover:border-red-200"
                  >
                    Ta bort {c.name}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input value={newTon} onChange={e => setNewTon(e.target.value)} placeholder="Lägg till egen ton" className="input-field text-xs" />
                <button onClick={() => { addCustomMeta('toner', newTon, setCustomToner, customToner, '🎨'); setNewTon('') }} className="px-3 py-2 rounded-xl bg-primary text-white text-xs">Lägg till</button>
              </div>
            </Section>

            {/* 9. Hooks */}
            <Section title="💫 Hooks">
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {(['sv', 'viral'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setHookTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      hookTab === tab
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab === 'sv' ? `📝 Svenska (178)` : `🔥 Viral Formulas (949)`}
                  </button>
                ))}
              </div>

              {/* Viral category filter */}
              {hookTab === 'viral' && (
                <select
                  value={viralCategory}
                  onChange={e => setViralCategory(e.target.value)}
                  className="input-field text-xs mb-3"
                >
                  {VIRAL_HOOK_CATEGORIES.map(c => (
                    <option key={c.id} value={c.category || ''}>{c.name}</option>
                  ))}
                </select>
              )}

              {/* Sök med dropdown */}
              <div className="relative">
                <input
                  type="text"
                  value={hookSearch}
                  onChange={e => setHookSearch(e.target.value)}
                  placeholder="Sök hooks..."
                  className="input-field text-sm"
                />
                {hookSearch && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-editorial max-h-72 overflow-y-auto">
                    {loadingHooks ? (
                      <p className="text-xs text-on-surface-variant text-center py-4">Laddar hooks...</p>
                    ) : currentHooks.length === 0 ? (
                      <p className="text-xs text-on-surface-variant text-center py-4">Inga träffar</p>
                    ) : (
                      <>
                        <p className="text-[10px] text-on-surface-variant/60 px-3 pt-2 pb-1">{currentHooks.length} träffar</p>
                        {currentHooks.slice(0, 20).map(hook => (
                          <button
                            key={hook.id}
                            onClick={() => { prependToDraft(hook.text); setHookSearch('') }}
                            className="w-full text-left px-3 py-2.5 hover:bg-primary/5 transition-colors text-xs text-on-surface leading-relaxed border-b border-outline-variant/10 last:border-b-0"
                          >
                            {hook.text.length > 120 ? hook.text.slice(0, 120) + '…' : hook.text}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {!hookSearch && (
                <>
                  <p className="text-[11px] text-on-surface-variant mb-2 mt-3">
                    {currentHooks.length} hooks. Klicka för att lägga till i utkastet.
                  </p>
                  {loadingHooks ? (
                    <p className="text-xs text-on-surface-variant text-center py-4">Laddar hooks...</p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {currentHooks.map(hook => (
                        <button
                          key={hook.id}
                          onClick={() => prependToDraft(hook.text)}
                          className="w-full text-left p-3 rounded-xl border border-outline-variant/20 bg-background hover:border-primary/40 hover:bg-primary/3 transition-all text-xs text-on-surface leading-relaxed"
                        >
                          {hook.text.length > 120 ? hook.text.slice(0, 120) + '…' : hook.text}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Section>

            {/* 10. Storytelling Structures */}
            <Section title="📖 Storytelling Structures">
              <p className="text-[11px] text-on-surface-variant mb-3">
                Klicka för att lägga till i början av utkastet
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {stories.length === 0 ? (
                  <p className="text-xs text-on-surface-variant text-center py-4">Laddar strukturer...</p>
                ) : (
                  stories.map(s => (
                    <button
                      key={s.id}
                      onClick={() => prependToDraft(s.content)}
                      className="w-full text-left p-3 rounded-xl border border-outline-variant/20 bg-background hover:border-primary/40 hover:bg-primary/3 transition-all text-xs text-on-surface leading-relaxed"
                    >
                      {s.content.length > 130 ? s.content.slice(0, 130) + '…' : s.content}
                    </button>
                  ))
                )}
              </div>
            </Section>

            {/* 11. CTAs */}
            <Section title="🎯 Call-to-Actions">
              <div className="flex gap-2 mb-4">
                {(['sv', 'sales'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setCtaTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      ctaTab === tab
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab === 'sv' ? '📝 Svenska CTAs' : '💰 Follows & Sales'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-on-surface-variant mb-3">
                Klicka för att lägga till i slutet av utkastet
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {currentCtas.length === 0 ? (
                  <p className="text-xs text-on-surface-variant text-center py-4">Laddar CTAs...</p>
                ) : (
                  currentCtas.map(c => (
                    <button
                      key={c.id}
                      onClick={() => appendToDraft(c.content)}
                      className="w-full text-left p-3 rounded-xl border border-outline-variant/20 bg-background hover:border-secondary/40 hover:bg-secondary/5 transition-all text-xs text-on-surface leading-relaxed"
                    >
                      {c.content.length > 120 ? c.content.slice(0, 120) + '…' : c.content}
                    </button>
                  ))
                )}
              </div>
            </Section>

            {/* 12. Utkast */}
            <div className="bg-surface-container-lowest rounded-2xl border border-primary/20 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-on-surface">✍️ Ditt Content</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={undoLastDraftChange}
                    disabled={undoDraftHistory.length === 0}
                    className="text-[10px] px-2 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant/70 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/40 hover:text-primary"
                  >
                    ↩ Ångra ({undoDraftHistory.length})
                  </button>
                  <button
                    onClick={redoLastDraftChange}
                    disabled={redoDraftHistory.length === 0}
                    className="text-[10px] px-2 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant/70 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/40 hover:text-primary"
                  >
                    ↪ Gör om ({redoDraftHistory.length})
                  </button>
                  <span className="text-[10px] text-on-surface-variant/50">Ctrl/Cmd+Z • Ctrl/Cmd+Shift+Z</span>
                  <span className="text-[11px] text-on-surface-variant">{draft.length} tecken</span>
                </div>
              </div>
              <textarea
                ref={draftRef}
                value={draft}
                onChange={e => {
                  const next = e.target.value
                  if (next !== draft) pushUndoDraft(draft)
                  setDraft(next)
                  setCharCount(next.length)
                }}
                onKeyDown={handleUndoShortcut}
                rows={16}
                placeholder="Här byggs ditt content upp. Välj hooks, strukturer och CTA:er ovan eller skriv direkt här."
                className="w-full bg-background border border-outline-variant/20 rounded-xl p-4 text-sm leading-relaxed resize-y focus:outline-none focus:border-primary/40 transition-colors font-mono placeholder:font-sans placeholder:text-on-surface-variant"
              />
              {/* Mobila knappar under utkastet */}
              <div className="flex gap-3 mt-4 xl:hidden">
                <button onClick={copyDraft} className="flex-1 btn-secondary py-3 text-xs">
                  {copied ? '✓ Kopierat!' : '📋 Kopiera'}
                </button>
                <button onClick={savePost} disabled={saving || !draft.trim()} className="flex-1 btn-primary py-3 text-xs">
                  {saving ? 'Sparar...' : saveSuccess ? '✓ Sparat!' : '💾 Spara'}
                </button>
              </div>
            </div>

          </div>

          {/* ── Sticky sidebar ───────────────────────────────────────────── */}
          <div className="hidden xl:block">
            <div className="sticky top-6 flex flex-col gap-4">

              {/* Snabbåtgärder */}
              <div className="bg-surface-container-lowest rounded-2xl border border-black/5 p-5">
                <h3 className="text-sm font-semibold text-on-surface mb-4">⚡ Snabbåtgärder</h3>
                <div className="space-y-2">
                  <button
                    onClick={copyDraft}
                    disabled={!draft}
                    className="w-full btn-primary py-3 text-sm"
                  >
                    {copied ? '✓ Kopierat!' : '📋 Kopiera text'}
                  </button>
                  <button
                    onClick={savePost}
                    disabled={saving || !draft.trim()}
                    className="w-full btn-secondary py-3 text-sm"
                  >
                    {saving ? 'Sparar...' : saveSuccess ? '✓ Sparat!' : '💾 Spara som utkast'}
                  </button>
                  <button
                    onClick={() => navigate('/bibliotek')}
                    className="w-full py-3 text-sm rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-colors"
                  >
                    📚 Mina texter
                  </button>
                  <button
                    onClick={clearAll}
                    className="w-full py-3 text-xs text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
                  >
                    🗑️ Rensa allt
                  </button>
                </div>
              </div>

              {/* Valda inställningar */}
              <div className="bg-surface-container-lowest rounded-2xl border border-black/5 p-5">
                <h3 className="text-sm font-semibold text-on-surface mb-3">📌 Inställningar</h3>
                <div className="space-y-2 text-xs">
                  {selectedDC && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Drömkund</span>
                      <span className="text-on-surface font-medium inline-flex items-center gap-1">
                        <span>{selectedDC.answers?.__avatar_emoji || '👤'}</span>
                        {selectedDC.name}
                      </span>
                    </div>
                  )}
                  {kategori && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Pelare</span>
                      <span className="text-on-surface font-medium">
                        {KATEGORIER.find(k => k.id === kategori)?.name}
                      </span>
                    </div>
                  )}
                  {syfte && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Syfte</span>
                      <span className="text-on-surface font-medium">
                        {SYFTEN.find(s => s.id === syfte)?.name}
                      </span>
                    </div>
                  )}
                  {kanal && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Kanal</span>
                      <span className="text-on-surface font-medium">
                        {KANALER.find(k => k.id === kanal)?.name}
                      </span>
                    </div>
                  )}
                  {format && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Format</span>
                      <span className="text-on-surface font-medium">
                        {FORMAT.find(f => f.id === format)?.name}
                      </span>
                    </div>
                  )}
                  {ton && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Ton</span>
                      <span className="text-on-surface font-medium">
                        {TONER.find(t => t.id === ton)?.name}
                      </span>
                    </div>
                  )}
                  {!selectedDC && !kategori && !syfte && !kanal && !format && !ton && (
                    <p className="text-on-surface-variant/50 italic text-center py-2">
                      Inga val gjorda ännu
                    </p>
                  )}
                </div>
              </div>

              {/* Teckenräknare */}
              {draft && (
                <div className="bg-surface-container-lowest rounded-2xl border border-black/5 p-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-on-surface-variant">Tecken</span>
                    <span className="font-medium text-on-surface">{draft.length}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-on-surface-variant">Ord</span>
                    <span className="font-medium text-on-surface">
                      {draft.trim().split(/\s+/).filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Rader</span>
                    <span className="font-medium text-on-surface">
                      {draft.split('\n').length}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
