import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Hook = {
  id: string
  text: string
  category: string
  language: string
  source: string
  sort_order: number
}

export type Question = {
  id: string
  section_key: string
  section_title: string
  section_order: number
  question: string
  question_order: number
}

export type UserAnswer = {
  id: string
  user_id: string
  section_type: string
  section_key: string
  question_text: string
  answer: string
  updated_at: string
}

export type StorytellingStructure = {
  id: string
  content: string
  category: string
  sort_order: number
}

export type DreamCustomer = {
  id: string
  user_id: string
  name: string
  answers: Record<string, string>
  created_at: string
  updated_at: string
}
