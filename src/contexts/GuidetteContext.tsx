import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

export type UserProfile = {
  id?: string
  user_id?: string
  display_name: string
  what_you_sell: string
  who_buys: string
  transformation: string
  onboarding_done: boolean
  content_pillars: ContentPillar[]
}

export type ContentPillar = {
  id: string
  name: string
  emoji: string
  description: string
}

type GuidetteContextType = {
  profile: UserProfile | null
  loading: boolean
  onboardingDone: boolean
  saveProfile: (updates: Partial<UserProfile>) => Promise<void>
  generatePillars: () => ContentPillar[]
  refetch: () => Promise<void>
}

const DEFAULT_PROFILE: UserProfile = {
  display_name: '',
  what_you_sell: '',
  who_buys: '',
  transformation: '',
  onboarding_done: false,
  content_pillars: [],
}

const GuidetteContext = createContext<GuidetteContextType>({
  profile: null,
  loading: true,
  onboardingDone: false,
  saveProfile: async () => {},
  generatePillars: () => [],
  refetch: async () => {},
})

// Generera enkla content pillars baserat på profilen
function buildPillars(profile: Partial<UserProfile>): ContentPillar[] {
  return [
    {
      id: 'utbildande',
      name: 'Utbildande',
      emoji: '📚',
      description: `Lär din målgrupp om ${profile.what_you_sell || 'din tjänst'} — tips, insikter och guider.`,
    },
    {
      id: 'transformation',
      name: 'Transformation',
      emoji: '✨',
      description: `Visa hur ${profile.who_buys || 'din kund'} går från problem till ${profile.transformation || 'resultat'}.`,
    },
    {
      id: 'bakom-kulisserna',
      name: 'Bakom kulisserna',
      emoji: '🎬',
      description: 'Visa vem du är, hur du jobbar och varför du bryr dig.',
    },
    {
      id: 'socialt-bevis',
      name: 'Socialt bevis',
      emoji: '💬',
      description: 'Kundresultat, reviews och transformationshistorier.',
    },
  ]
}

export function GuidetteProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (data) {
      setProfile({
        ...data,
        content_pillars: data.content_pillars ?? [],
      })
    } else {
      setProfile(null)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProfile() }, [user])

  const saveProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return
    const merged = { ...DEFAULT_PROFILE, ...profile, ...updates, user_id: user.id }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ ...merged }, { onConflict: 'user_id' })
      .select()
      .single()

    if (!error && data) {
      setProfile({ ...data, content_pillars: data.content_pillars ?? [] })
    }
  }

  const generatePillars = () => buildPillars(profile ?? {})

  return (
    <GuidetteContext.Provider value={{
      profile,
      loading,
      onboardingDone: profile?.onboarding_done ?? false,
      saveProfile,
      generatePillars,
      refetch: fetchProfile,
    }}>
      {children}
    </GuidetteContext.Provider>
  )
}

export const useGuidette = () => useContext(GuidetteContext)
