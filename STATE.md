# STATE.md

## Abhi kaunsa version
- Version: v1
- Parts done: 1
- IN PROGRESS: - (npm install / next build yahan verify nahi hua, network band tha. Pehle `npm install && npm run build` chalake dekhein)

## Stack
Next.js 14 (App Router) + TypeScript, plain CSS variables (Tailwind abhi nahi), lucide-react, @fontsource-variable (Inter, Noto Sans Devanagari). Supabase, PWA service worker aage ke parts me.

## File map
- app/layout.tsx: fonts, metadata, viewport, manifest link
- app/globals.css: sab tokens (--c-*, --sp-*, ...), type styles, buttons, layout classes
- app/page.tsx: Home `/` (v7: free, koi payment nahi)
- app/terms, privacy, contact: legal pages (components/LegalPage.tsx)
- app/not-found.tsx: 404
- components/: Logo, Button (ButtonLink), TicketCard (static), GuideCard, LegalPage
- lib/brand.ts: brand naam, legal date, contact details (khaali)
- lib/i18n.ts: Hinglish strings, `t(key)`
- public/manifest.json + public/icons/*.png (192, 512, 512 maskable)

## Environment variables (sirf NAAM)
- Abhi koi nahi (Part 3 me Supabase)

## Kaise chalana hai
- npm install && npm run dev
- Deploy: Vercel (GitHub ya `vercel` CLI)

## Decisions / QUESTIONS.md me pending
- QUESTIONS.md dekhein

## Agla part
- Part 2 (Components library)
