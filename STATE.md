# STATE.md

## Abhi kaunsa version
- Version: v5
- Parts done: 5
- IN PROGRESS: dependency install/build verification environment me complete nahi ho paya; `npm install` / `npm ci` timeout hue. Source-level Part 5 review/fixes complete kiye gaye hain; build ko normal networked Node environment me run karna baaki hai.

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
- Part 3 (login/db/shell):
  - supabase/001_init.sql: tables (users, queues, sessions, tokens, queue_events, push_subscriptions) + RLS + new-user trigger. SQL Editor me chalayein
  - middleware.ts + lib/supabase/{env,client,server,middleware}.ts: session refresh, /app/* aur /onboarding/* login ke bina -> /login?next=
  - lib/safeNext.ts, validateName.ts, useOnline.ts, authFlag.ts
  - app/login/page.tsx + components/auth/LoginView.tsx, GoogleG.tsx: `/login`
  - app/auth/callback/route.ts: OAuth code exchange, naam nahi -> /onboarding/name, warna next ya /app/scan
  - app/onboarding/name/page.tsx + components/auth/NameForm.tsx
  - app/app/layout.tsx (auth+naam guard) + components/shell/AppShell.tsx (BottomNav, session-expire Dialog)
  - app/app/{tokens,scan,profile,business}/page.tsx: khaali tab pages (AppBar title); profile me Logout (components/shell/LogoutButton.tsx)
- Part 4 (owner queue + QR):
  - app/app/business/page.tsx + components/business/BusinessList.tsx: Business tab (loading/empty/error/offline, Live>Paused>Closed, PURANI QUEUES)
  - app/app/business/new/page.tsx + actions.ts (server action createQueueAction: validate, queue+pehla session insert) + components/business/{NewQueueFlow,StepName,StepLimit,StepTime}.tsx
  - app/app/business/[id]/qr/page.tsx + components/business/{QrScreen,PrintSheet}.tsx: QR screen, Print/PDF (portal + @media print), Image save (PNG)
  - lib/qr.ts (asli QR, qrcode-generator, level M, quiet zone 4), components/QRCodeSVG.tsx, components/QRFrame.tsx (ab asli QR)
  - lib/queueInput.ts (validation), lib/queueView.ts (title, sort, summary)
  - AppShell: BottomNav ab sirf 4 root tabs par (sub-screens par nahi)
- Part 5 (customer scan + token):
  - supabase/002_customer.sql: RPC `queue_public(code)` (anon ok), `my_active_token(code)`, `issue_token(code, name)` (atomic, queue row lock, duplicate nahi, limit/paused/closed/rate check). 001 ke baad SQL Editor me chalayein
  - app/q/[code]/page.tsx: server render, logged-in + naam nahi -> onboarding, pehle se token -> /app/tokens/:id?t=existing
  - components/customer/{QrEntry,LandingTicket,ConfirmSheet}.tsx: landing (C3), confirm sheet (C4); lib/publicQueue.ts: 5s polling + visibilitychange refetch + offline/reconnecting banner
  - components/scan/ScanView.tsx + app/app/scan/page.tsx: Scan tab (C11), transparent on-dark AppBar, lib/decodeQr.ts (BarcodeDetector, warna jsqr). Naya package: jsqr
  - lib/i18n.ts: naye strings + `tf(key, {vars})`
  - Part 5 verification: QR landing/confirm/atomic RPC/scan paths reviewed; no new payment/subscription code added.
- lib/brand.ts: brand name, contact details
- lib/i18n.ts: Hinglish strings & `t(key)`

## Environment variables (sirf NAAM)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
(.env.example dekhein, .env.local banayein). Part 4 me koi naya env nahi.

## Kaise chalana hai
- Supabase: project banayein, Auth > Providers > Google on, Auth > URL Configuration me Site URL + Redirect `http://localhost:3000/auth/callback` (deploy URL bhi), SQL Editor me supabase/001_init.sql chalayein
- Google Cloud OAuth client ka redirect URI = Supabase ka callback URL
- `npm install`
- `npm run dev` (Dev server)
- `npm run build` (Production build verification)
- `/dev/components` path for viewing all UI components

## Decisions / QUESTIONS.md me pending
- QUESTIONS.md dekhein

## Baaki / dhyan dein
- Token milne ke baad redirect `/app/tokens/:id?t=issued|changed|existing&n=` hota hai. Live Token page (Part 6) abhi nahi, toh 404 aayega; wahan `t` se toast dikhana hai (Token mil gaya / Aapka number {n} mila / pehle se hai).
- C12 (notification pre-prompt) aur C13 (iPhone popup) token ke baad: Part 5 spec me nahi the, nahi banaye.
- Realtime WebSocket nahi; 5s polling hi hai (spec ne fallback allowed kiya).
- Hero number ka digit-wise chhota font (v7 §7.4) landing ticket me abhi nahi.
- Scan tab ka "Madad ke tips" toggle sirf screen state hai, save nahi hota.
- O3 "Purani queue" sheet (Dobara shuru etc.) nahi bana: closed queue abhi ban hi nahi sakti (console Part 5+). Closed card par tap abhi kuch nahi karta.
- QR ka link `/q/<code>` hai, ye customer page Part 5+ me banega (abhi 404).
- "Console kholein" aur live/paused card tap `/app/business/:id` par jate hain, wo page baad me (abhi 404).
- "Demo: QR scan" button nahi banaya (sirf test build ke liye tha).

## Agla part
- Part 6
