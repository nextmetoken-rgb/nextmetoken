# STATE.md

## Abhi kaunsa version
- Version: v10
- Parts 8–9 implemented from the supplied specifications, subject to the external setup and unsupported cases listed below. Part 7 skipped-token workflow remains blocked because no owner-side skip action is specified or present.
- TypeScript check and production build are the local QA gates; Android/iOS device and live-service checks require configured credentials and real devices.

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
- Part 6 (owner console): `app/app/business/[id]/page.tsx` + `components/business/OwnerConsole.tsx`: owner console, current token hero, fixed-height line list, 3rd-row focus, Agla/Pichla, 300ms lock, optimistic-safe server actions, walk-in sheet, Hatao confirm + 5s Undo, pause/end-day/restart menu actions, offline/realtime/polling refresh, wake lock, sound/TTS.
- Part 6 DB: `supabase/003_owner_console.sql`: atomic `owner_next`, `owner_prev`, `owner_undo`, `owner_walkin`, `owner_remove`, `owner_set_status`, `owner_end_day`, `owner_restart` RPCs.
- Part 7 customer live token: `app/app/tokens/[id]/page.tsx` and `components/customer/LiveToken.tsx`; customer-safe data, people list, and withdrawal RPCs are in `supabase/004_customer_live.sql`.
- Part 7 people: `app/app/tokens/[id]/people/page.tsx`, `components/customer/PeopleView.tsx`.
- Part 7 audio preference: `app/app/tokens/[id]/settings/page.tsx`; per-token preference is stored in browser local storage.
- Part 7 Guide: `app/app/guide/page.tsx`, reusing only FAQ copy already present in `lib/i18n.ts`.
- Part 7 customer tokens/history: `app/app/tokens/page.tsx`, `app/app/tokens/history/[id]/page.tsx`.
- Part 7 database migration: `supabase/004_customer_live.sql` (run after 001, 002, and 003).
- Part 8 lifecycle/recovery: `supabase/005_lifecycle_recovery_history.sql`; owner end-day, custom restart start number, soft delete, 72-hour recovery, permanent deletion, hourly purge schedule (pg_cron when available), QR recovery, and customer history snapshots.
- Part 8 screens: `app/app/profile/recently-deleted`, `app/app/business/[id]/history`, `app/app/business/[id]/history/[sessionId]`, and `components/business/{RecentlyDeleted,OwnerHistory}.tsx`.
- Part 9 Guide/Profile: `app/app/guide/page.tsx`, `components/profile/ProfileView.tsx`, Profile editing, account-backed tips, notification/audio settings, feedback storage, logout, and account deletion API.
- Part 9 push: `public/sw.js`, `lib/push.ts`, `app/api/push/notify/route.ts`, and push notification targets in migration 005.
- Part 9 account deletion: `app/api/account/delete/route.ts`; needs server-only `SUPABASE_SERVICE_ROLE_KEY`.
- Plan references Parts 7–10 are included at the project root.
- lib/brand.ts: brand name, contact details
- lib/i18n.ts: Hinglish strings & `t(key)`

## Environment variables (sirf NAAM)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (account deletion API, server-only)
- NEXT_PUBLIC_VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY (server-only)
- VAPID_SUBJECT
(`.env.example` dekhein; `.env.local` banayein; real secrets ZIP me nahi hain.)

## Kaise chalana hai
- Supabase: Auth > Providers > Google on, Auth > URL Configuration me Site URL + Redirect `http://localhost:3000/auth/callback` (deploy URL bhi). SQL Editor me `001_init.sql` se `005_lifecycle_recovery_history.sql` tak order me chalayein.
- Google Cloud OAuth client ka redirect URI = Supabase ka callback URL
- VAPID keys configure karein; iPhone Web Push ke liye HTTPS + Home Screen install + iOS 16.4+ zaroori.
- Account deletion endpoint ke liye Supabase service-role secret configure karein.
- `npm install`
- `npm run dev` (Dev server)
- `npm run build` (Production build verification)
- `/dev/components` path for viewing all UI components

## Decisions / QUESTIONS.md me pending
- QUESTIONS.md dekhein

- Run all five SQL files against the target Supabase project. The migration attempts to schedule hourly purging with pg_cron; confirm that the schedule exists in the project's Cron dashboard.
- Set all environment values above. Push delivery cannot be verified without real VAPID keys and HTTPS; iOS push needs a real iPhone/iPad on iOS 16.4+.
- Account deletion cannot run until the server-only service-role key is set.
- iPhone guide text is present, but the screenshots referenced by the plan were not supplied.
- `SUPPORT` contact details are blank in `lib/brand.ts`; the app shows the existing “Jaldi add hogi” text. Feedback is stored in `feedback`, but no support dashboard/email destination was supplied.
- English copy was not supplied. Profile keeps Hinglish selected and reports that English copy is unavailable.
- v7 removes trials, subscription and payment. Older guide text is omitted, and no Subscription/Refund row is shown.
- Part 7 skipped state remains unavailable: no specified owner-side skip action/status or rejoin-last operation exists in the supplied app/schema.
- Supabase Realtime must be enabled for `tokens` and `sessions`; screens keep polling fallbacks.
- Part 10 check: TypeScript and production build. Real-device push, screen-size matrix, Lighthouse budgets, service-role deletion, and live Supabase migration execution require project secrets/devices not included here.
