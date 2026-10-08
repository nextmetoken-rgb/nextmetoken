# Implementation state

Updated from the supplied complete specification.

## Implemented in this source

- New business creation asks for the business name and a unique Book ID; only one new queue can be created per account. Existing queues are preserved.
- Book IDs can be edited and looked up from the home page. The existing QR code remains tied to the queue code.
- A five-calendar-day IST trial, a one-time 10-day test balance, paid-day balance fields, and day-expiry accounting are included in migration 009.
- Razorpay order creation, checkout verification, signature checks, duplicate-safe crediting, and webhook handling are implemented. No payment is treated as successful without verification.
- Business days/balance appear on the owner screens. Owners can add funds through the Razorpay checkout.
- Online token intake can be stopped separately; walk-in issuance remains available while only online intake is off.
- Queue deletion has been removed from the owner menu and the delete RPC is dropped by migration 009. History remains available.
- Announcement preference and repeat count (1–4) are stored on the queue. A supported Media Session next/previous control is available when enabled.
- Token history can be opened as groups by business. A Book ID entry point is on the home page.
- QR save/print offers QR-only and business-info designs. The info design uses the supplied teal A4 layout and owner instructions.
- Home page use cases and FAQs were updated, the FAQ now explains optional installation and the minimum personal information, dark mode uses neutral black surfaces, and the floating refresh control is icon-only.

## Validation state

- Dependencies installed successfully with `npm install`.
- `npx tsc --noEmit --incremental false` passed after the changes.
- `npm run build` passed in a clean copy after the feature integration. After one final server-side guard was added to the new-queue page, TypeScript validation passed; a repeat build was blocked by Windows `EPERM` while Next.js tried to create generated output directories. The last one-line guard was not separately re-confirmed by a full build.
- The Supabase migration was not applied to the user's hosted project; no project credentials were supplied.
