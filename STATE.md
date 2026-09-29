# STATE.md

## Abhi kaunsa version
- Version: v2
- Parts done: 2
- IN PROGRESS: -

## Stack
Next.js 14 (App Router) + TypeScript, plain CSS variables, lucide-react, @fontsource-variable (Inter, Noto Sans Devanagari).

## File map
- app/layout.tsx: fonts, metadata, viewport, manifest link
- app/globals.css: CSS tokens (--c-*, --sp-*, --r-*, --shadow-*, --z-*), typography styles, keyframe animations
- app/page.tsx: Home `/` (free, no payment)
- app/dev/components/page.tsx: Hidden showcase page for all components and states
- app/terms, privacy, contact: legal pages
- app/not-found.tsx: 404 page
- components/:
  - Button.tsx: Button & ButtonLink (primary, secondary, tertiary, danger-outline, danger-filled, danger-text; lg, md, sm)
  - IconButton.tsx: IconButton (default, on-dark)
  - AppBar.tsx: Sticky header with back button & root tab title support
  - BottomNav.tsx: Fixed bottom navigation (4 tabs: Mere Tokens, Scan, Profile, Business)
  - TextField.tsx: Styled text input with label, clear button, helper text & error states
  - Toggle.tsx: Toggle switch & ToggleRow with touch feedback
  - Chip.tsx: Status badges (live, paused, closed, waiting, next, now, done, left, walkin, trial, you, estimate)
  - Cards.tsx: Card, ListRow, SettingsRow, PersonRow, QueueCard, TokenCard
  - TicketCard.tsx: Signature notched ticket card with main, perforation, stub, state colors (waiting, next, now, done, removed, skipped) & console variant
  - NumberFlip.tsx: Tabular animated number flip (250ms cubic-bezier)
  - ProgressLine.tsx: Full and compact progress bar with marker
  - BottomSheet.tsx: Bottom sheet modal with handle, drag-to-dismiss, scrim & Esc key support
  - Dialog.tsx: Centered dialog modal & v7 §11 Hatao confirm dialog
  - Toast.tsx: Bottom fixed toast notification with auto-dismiss (4s/5s/6s) and Undo action
  - Banner.tsx: Sticky banner (offline, reconnecting, paused, trial, locked)
  - Skeleton.tsx: Shimmer placeholder loading element
  - Spinner.tsx: Rotating loader (20px, 32px)
  - EmptyState.tsx: Centered empty state container
  - CoachMark.tsx: Onboarding tooltip bubble with target ring
  - StepDots.tsx: Step progress indicator dots
  - SegmentedControl.tsx: Tabbed segment control with sliding indicator
  - SwipeRow.tsx: Left-swipe reveal row for Hatao with v7 confirm dialog & 3-dot overflow menu
  - QRFrame.tsx: White card QR code frame with quiet zone & business name
  - ViewfinderOverlay.tsx: Full-bleed camera viewfinder frame with corner brackets & controls
  - GuideCard.tsx: Accordion guide card with numbered steps
  - StickyBar.tsx: Fixed bottom action bar
  - Countdown.tsx: Live countdown timer text
  - Logo.tsx: Brand logo mark & name link
- lib/brand.ts: brand name, contact details
- lib/i18n.ts: Hinglish strings & `t(key)`

## Environment variables (sirf NAAM)
- Abhi koi nahi (Part 3 me Supabase)

## Kaise chalana hai
- `npm install`
- `npm run dev` (Dev server)
- `npm run build` (Production build verification)
- `/dev/components` path for viewing all UI components

## Decisions / QUESTIONS.md me pending
- QUESTIONS.md dekhein

## Agla part
- Part 3 (Supabase DB schema + auth)
