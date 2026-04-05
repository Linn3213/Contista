# Contista — Claude Code Guide

## VS Code setup
```bash
cd C:/Users/linn_/Downloads/contista-app
npm install
cp .env.example .env   # fyll i VITE_SUPABASE_ANON_KEY
npm run dev            # startar på http://localhost:5173
```

## Tech stack
- React 18 + TypeScript + Vite
- Tailwind CSS (Stitch design system)
- Supabase: projekt `mhswnvzpqekdcdjxxrmm`
- react-router-dom v6
- Vercel deploy (vercel.json SPA rewrites)

## Design system — Stitch "The Silent Curator"
- Bakgrund: `#F6F1EB` (cream) = `bg-background`
- Primary: `#9F6B78` (dusty rose) = `text-primary / bg-primary`
- Secondary: `#A8B5A2` (sage) = `text-secondary`
- Tertiary: `#2F4A43` (dark green) = `text-tertiary`
- Font: Cormorant Garamond (serif-headline) + Inter (body)
- Rounded: `rounded-card` = 20px
- Inga 1px borders — tonal layering
- Alltid: `bg-surface-container-lowest` för kort, `shadow-editorial` för lyft

## Supabase tabeller
| Tabell | Beskrivning |
|--------|-------------|
| `hooks` | 1127 hooks — category, language, text, sort_order |
| `questions` | 29 drömkund (type='dreamcustomer') + 41 strategi (type='strategy') |
| `user_content_answers` | user_id, question_id, answer |
| `storytelling_structures` | CTAs (category='cta') + tips (category='cta_tip') |
| `dream_customers` | Namngivna drömkundsprofiler per användare |

## Projektstruktur
```
src/
  contexts/       AuthContext, ToastContext, CreatorContext
  components/     Layout, TopNav, BottomNav, StepLayout
  pages/          BibliotekPage, HooksPage, SkapaPage, StepPage
  pages/steps/    Step1–Step9
  hooks/          useClipboard
  lib/            supabase.ts
supabase/
  functions/      Edge Functions (AI)
  migrations/     SQL migrations
```

## Viktiga konventioner
- `update({ key: val })` i CreatorContext — aldrig direkt setState
- Alltid `canContinue={!!state.field}` i StepLayout
- Mobile: `md:hidden` single col, Desktop: `hidden md:grid grid-cols-12`
- Toast: `showToast('text ✓')` — aldrig alert()
- Supabase RLS: alltid `auth.uid() = user_id` policy
- Inga kommentarer i koden om inte logiken är icke-uppenbar
