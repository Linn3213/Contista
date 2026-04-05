import { createContext, useContext, useState, ReactNode } from 'react'

export type CreatorState = {
  purpose: string
  purposeSub: string
  audience: string
  tone: string
  research: string
  insight: string
  hookCategory: string
  hookLanguage: 'sv' | 'en'
  selectedHook: string
  structureKrok: string
  structureKrokPoints: string
  structureKontext: string
  structureKontextPoints: string
  structureKarnavarde: string
  draft: string
  selectedCTA: string
  platform: string
  dreamCustomerId: string
  dreamCustomerName: string
  dreamCustomerAnswers: Record<string, string>
}

const defaultState: CreatorState = {
  purpose: '', purposeSub: '', audience: '', tone: '',
  research: '', insight: '', hookCategory: 'educational',
  hookLanguage: 'sv', selectedHook: '', structureKrok: '',
  structureKrokPoints: '', structureKontext: '', structureKontextPoints: '',
  structureKarnavarde: '', draft: '', selectedCTA: '', platform: '',
  dreamCustomerId: '', dreamCustomerName: '', dreamCustomerAnswers: {},
}

type CreatorContextType = {
  state: CreatorState
  update: (patch: Partial<CreatorState>) => void
  reset: () => void
}

const CreatorContext = createContext<CreatorContextType>({
  state: defaultState, update: () => {}, reset: () => {},
})

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CreatorState>(defaultState)
  const update = (patch: Partial<CreatorState>) => setState(s => ({ ...s, ...patch }))
  const reset = () => setState(defaultState)
  return <CreatorContext.Provider value={{ state, update, reset }}>{children}</CreatorContext.Provider>
}

export const useCreator = () => useContext(CreatorContext)
