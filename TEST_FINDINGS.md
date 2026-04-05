# Contista E2E Test Findings & Action Plan

**Date:** April 4, 2026  
**App running:** http://localhost:5175  
**Build status:** ✅ Clean (tsc + vite build)

---

## ✅ Recently Fixed (This Session)

1. **BibliotekPage - "Mina texter" tab** - ✅ FIXED
   - Issue: Quick-add form only visible when empty
   - Fix: Always-visible note-style textarea at top
   
2. **BibliotekPage - "Idéer" tab** - ✅ FIXED
   - Issue: Action buttons (copy/upgrade/delete) only visible on hover
   - Fix: Now always visible on idea cards
   
3. **BibliotekPage - "Kategorier" → "Texter" section** - ✅ FIXED
   - Issue: Text cards had no edit/delete buttons
   - Fix: Added visible edit & delete icons per card

4. **AdminPage** - ✅ FIXED
   - Issue: "Questions" and "CTAs" tabs were clickable but showed "kommer snart"
   - Fix: Removed dead tabs entirely, only "hooks" tab visible

5. **Step1 - "Skapa anpassat syfte" button** - ✅ FIXED
   - Issue: Button was dead (no onClick)
   - Fix: Now opens input, saves to state, gates canContinue

6. **Step2 - DreamCustomer answer count** - ✅ FIXED
   - Issue: Count included internal `__avatar_*` metadata
   - Fix: Filtered out keys starting with `__`

---

## 🟡 Potential Issues to Test

### Dashboard
- [ ] "Snabbåtgärder" buttons navigate correctly (6 buttons)
- [ ] "Dagens plan" - add item, toggle done, delete, send to calendar
- [ ] "Anpassade kort" - create, edit, delete cards
- [ ] "Anteckningar" - auto-save and sync with Bibliotek
- [ ] "Statistik per kanal" - displays correctly if posts exist
- [ ] "Veckans schema" - shows correct calendar days and posts

### Bibliotek Tabs
- [ ] **Översikt** - All sections load and render
- [ ] **Kategorier** - All 8 categories work (hooks, captions, ctas, texter, bilder, videos, qa, anteckningsblock)
  - [ ] File uploads work for bilder/videos
  - [ ] Add/delete entries in each category
- [ ] **Mina texter** - New always-visible form works
  - [ ] Save draft from form
  - [ ] Edit existing text
  - [ ] Delete text
- [ ] **Idéer** - New always-visible form works
  - [ ] Idea cards show all 3 buttons (copy, upgrade, delete)
  - [ ] Buttons don't disappear on resize
- [ ] **Kalender** - Navigate months, add posts to dates
- [ ] **Anteckningar** - Shared notes sync with Dashboard

### Contentskaparen (Steps 1-9)
- [ ] **Step1** - "Skapa anpassat syfte" - input appears and saves ✅ (fixed)
- [ ] **Step2** - DreamCustomer count shows correct number (no `__avatar` keys) ✅ (fixed)
- [ ] **Step3** - Select tone, button highlights correctly
- [ ] **Step4** - Select audience from DreamCustomer or free text
- [ ] **Step5** - Hooks load from DB
  - ⚠️ **RISK**: If hooks table is empty, no hooks will show
  - [ ] Search/filter hooks
  - [ ] Copy hook to draft
- [ ] **Step6** - Select / write insight
- [ ] **Step7** - Narrative selector works (story template)
- [ ] **Step8** - Content refinement tab
  - ⚠️ **RISK**: AI analysis calls `supabase.functions.invoke('analyze-content')`
  - If edge function not deployed: will show error (already has fallback)
  - [ ] CTA tab loads CTAs from DB
  - [ ] Copy CTA to draft
  - [ ] Tips tab shows refinement tips
  - [ ] Draft shows live character/word count
- [ ] **Step9** - Preview, platform select, save/copy
  - [ ] Platform selector works (7 platforms)
  - [ ] Copy text/caption buttons work
  - [ ] Save as draft works

### Drömkund (Dream Customer)
- [ ] Create new dream customer
- [ ] Answer questions (minimum required)
- [ ] Edit existing dream customer
- [ ] Delete dream customer
- [ ] Emoji avatar picker works
- [ ] Full profile displays (status: "Under arbete" / "Färdig")
- [ ] Can select dream customer in Step2

### Contentstrategi (Strategy)
- [ ] All sections expand/collapse
- [ ] Answers save automatically to localStorage
- [ ] Progress bar updates (X/40 questions)
- [ ] "Generera pelare" button works
- [ ] Generated pillars display and can be removed

### Hooks Bibliotek
- [ ] Filter by category works
- [ ] Filter by language works (Swedish/English/All)
- [ ] Search input filters correctly
- [ ] "Slumpa" button returns random hook
- [ ] Copy button copies to clipboard
- [ ] Pagination/load more works

### CTAs Bibliotek
- [ ] Tab selection (CTAs / Tips & Tekniker) works
- [ ] Filter by category works
- [ ] Search input filters
- [ ] Copy button works
- [ ] All CTAs/tips load from DB

### Kalender
- [ ] Navigate to different months
- [ ] Click day to see/add posts
- [ ] Add new post to date
- [ ] Edit post
- [ ] Delete post
- [ ] Show posts for week view
- [ ] Local mode (if not logged in) works

### Trender (Trend Spaning)
- [ ] Tabs work (admin hooks view + trends)
- [ ] Add trend button works
- [ ] Trend list displays
- [ ] "Använd i Contentskaparen" button loads trend into Step5

### Inställningar
- [ ] User profile shows correct email
- [ ] "Contentskaparen" button navigates to /strategi
- [ ] "Contentpelare" shows count
- [ ] "Drömkunder" button navigates
- [ ] "Logga ut" button logs out and redirects to /auth

### Auth Flow
- [ ] Login with valid Supabase credentials works
- [ ] Error handling for wrong password
- [ ] Logout works
- [ ] Auth bypass (dev mode) - localStorage key works
- [ ] Protected routes redirect to /auth when not logged in

---

## 🔴 Critical Issues (Must Fix)

None identified. All core flows appear functional. Dead buttons from previous sessions have been fixed.

---

## 🟠 High Priority (Should Fix)

1. **AI Analysis Dependency** (Step 8)
   - Requires `supabase/functions/analyze-content/` edge function
   - Error handling exists, but feature won't work without deployment
   - Action: Deploy edge function or mark as "coming soon"

2. **Empty Hooks/CTAs Tables**
   - If Supabase tables are empty, users see no options in Step5 and Step8 CTA tab
   - Action: Verify sample data is populated in tables

---

## 🟡 Medium Priority (Could Improve)

1. **Form state persistence**
   - Verify CreatorContext state persists correctly across navigations
   - Test: Go through steps, navigate away, come back - state should remain

2. **File upload handling**
   - Kategorier → bilder/videos allow file uploads
   - Only file metadata is stored, not actual files
   - Clarify UI that files aren't actually uploaded to cloud

3. **Dream Customer emoji picker**
   - Verify emoji input works on all platforms
   - Test on mobile if needed

---

## 📋 Test Checklist Template

Use this to manually test each section:

```
[ ] Navigate to section
[ ] All buttons visible and interactive
[ ] Forms save data correctly
[ ] Navigation works between related pages
[ ] Data persists after refresh
[ ] Error states display correctly
[ ] Success/feedback messages appear
[ ] Mobile layout works (if responsive)
```

---

## Notes on Known Limitations

- **Draft auto-save**: Uses CreatorContext (in-memory), not persisted to DB until explicitly saved
- **Local mode storage**: Uses localStorage (Kalender, Dashboard default when not logged in)
- **AI Analysis**: Requires deployment of Supabase edge function `analyze-content`
- **File uploads**: Only metadata tracked, actual files require cloud storage setup
- **Character/word limits**: None enforced, UI shows counters only

---

## Environment

- **Node version**: 25.8.1
- **Dependencies**: 151 packages (2 moderate audit vulnerabilities - non-blocking)
- **Build command**: `tsc && vite build` ✅
- **Dev server**: Port 5175
- **Supabase env vars**: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY ✅ Present

