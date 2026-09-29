# TokenApp — QR Token & Live Queue Management System

TokenApp is a modern, mobile-first PWA for live queue management and digital token issuing via QR code scanning. Built with Next.js, React, Tailwind CSS, and TypeScript.

## Features
- **Instant QR Code Scanning & Generation**: Scannable QR code generator for businesses and in-app camera scanner for customers.
- **Real-Time Live Queue**: Live number flip updates, estimated wait time calculation, and voice announcements (TTS).
- **Owner Console**: Next/Prev controls with double-tap safety locks, 5-second Undo toasts, walk-in token issuance, and queue pause/resume.
- **List Management**: Full customer queue view with status tags (`Ab chal raha`, `Walk-in`, `Line chhod di`, `Hata diya`, `Poora hua`).
- **Recovery & History**: Soft delete with 3-day recovery window, session history, and end-of-day reports.
- **Mobile First & PWA Ready**: Optimized for low-end mobile devices, tabular numerals to prevent layout shifts, and responsive touch controls (360px – 480px container width).

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

## Deployment to Vercel
1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set environment variables if connecting Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Click **Deploy**.
