# Contista Action Plan - Priority Fixes

---

## Batch 1: Critical / Dead Code (HIGHEST PRIORITY)

**Status**: Most already fixed this session ✅

- [x] Admin broken tabs (questions/CTAs showing "kommer snart")
- [x] Step1 "Skapa anpassat syfte" button dead
- [x] Step2 dream customer answer count inflated by metadata
- [x] BibliotekPage: mina texter form disappears when has content
- [x] BibliotekPage: ideer buttons hidden until hover
- [x] BibliotekPage: kategorier/texter cards have no edit/delete

**Outcome**: All fixed. Build is clean. ✅

---

## Batch 2: Data Dependency Issues (MEDIUM PRIORITY)

**Must verify before claiming "app ready":**

### 2a. Hooks Table Population
- [ ] Check if Supabase `hooks` table has sample data
- [ ] If empty: Insert sample hooks (at least 2-3 per category)
- [ ] Location to test: Contentskaparen → Step5

**Fix if needed:**
- Create script to seed `hooks` table with sample data
- Or document that Hooks library is admin-populated

### 2b. CTAs Table Population  
- [ ] Check if Supabase `storytelling_structures` table has CTAs
- [ ] Filter: `category = 'cta'` and `category = 'cta_tip'`
- [ ] If empty: Insert sample CTAs
- [ ] Location to test: Contentskaparen → Step8 (CTA tab)

**Fix if needed:**
- Create script to seed `storytelling_structures` table with sample CTAs/tips
- Or document that CTAs library is admin-populated

---

## Batch 3: Edge Function Deployment (MEDIUM PRIORITY)

### 3a. Step8 AI Analysis Feature
- [ ] Verify Supabase edge function `analyze-content` exists and is deployed
- [ ] Location to test: Contentskaparen → Step8 → Click "Analysera innehål"
- [ ] Expected: Content analysis appears (score, strengths, improvements)
- [ ] Current fallback: Error message shows if function missing

**Fix if needed:**
- [ ] Deploy `supabase/functions/analyze-content/` to Supabase
- [ ] Or mark feature as "Coming soon" (UI already has fallback)
- [ ] Or create placeholder mock response

---

## Batch 4: UX Polish (LOWER PRIORITY)

- [ ] Verify form states persist across navigations
- [ ] Test Dream Customer creation flow end-to-end
- [ ] Verify calendar month navigation doesn't reset state
- [ ] Ensure all navigation links have hover states
- [ ] Test mobile layout (if needed for your use case)

---

## Batch 5: Documentation / Setup (LOWEST PRIORITY)

- [ ] Document how to add more Hooks (who manages this? manual entry? import?)
- [ ] Document how to manage CTAs
- [ ] Document how to deploy/maintain edge functions
- [ ] Create admin guide for populating lookup tables
- [ ] Clarify file upload limitation (only metadata, not actual files)

---

## Quick Test Commands

```bash
# Rebuild to verify no errors
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# View test findings
cat TEST_FINDINGS.md

# Check Supabase connection
# Open browser console and verify: no auth/connection errors
```

---

## Sprint Order (if fixing in phases)

1. **First**: Run through Batch 1 checklist (already mostly done ✅)
2. **Second**: Verify data tables are populated (Batch 2)
3. **Third**: Deploy or mock AI analysis feature (Batch 3)
4. **Fourth**: Polish UX and edge cases (Batch 4)
5. **Fifth**: Create documentation (Batch 5)

---

## Definition of "Ready"

App is **READY** when:
- ✅ All navigation works (no 404s, no dead links)
- ✅ All buttons are functional or clearly marked "coming soon"
- ✅ Core form flows complete without crashes
- ✅ Data persists across navigations
- ✅ Error messages are clear and not scary
- ✅ Lookup tables (Hooks, CTAs, Dream Customers) have sample data

---

## Known "Out of Scope" (Won't Fix Now)

- Mobile optimization (can do later if needed)
- Advanced analytics/reporting
- Real file upload to cloud (only metadata)
- Multi-user collaboration features
- Offline mode
- Export/import of content

