home · TicketCard demo · 02-components.md ka TicketCard spec nahi mila · simple do-hisse ticket (upar current, neeche apna), notches + dashed line use kiye
home · Login button/CTA · /login route Part 3 me banega · abhi /login par 404 aayega
manifest · start_url /app/scan · route Part 5 me banega · spec jaisa hi rakha
fonts · preload Inter 400/600/800 aur Devanagari subset · @fontsource import use kiya (self-hosted, bundle me), preload/subset baad me
pwa · service worker · Part 1 me nahi bana · abhi sirf manifest + icons
contact · WhatsApp/email/response time nahi diya · brand.ts me khaali, page par "jaldi add hongi"
legal · Terms/Privacy ka text spec me nahi tha · v7 ke locked decisions se chhota text likha, aap review karein
home · Login button label "Login" (sticky bar) · spec me sirf "Login" likha
tailwind · spec me "suggestion" tha · plain CSS variables use kiye
login · Banner offline · copy "Last update N min pehle" login par ajeeb, spec me alag copy nahi · Banner offline default use kiya
login · back button · v7 me sirf "back button", jagah/icon nahi di · AppBar ka ArrowLeft IconButton top-left, history.back ya home
name · save fail toast · copy spec me nahi · "Naam save nahi ho paya. Dobara koshish karein." likha
tabs · route names · spec me nahi · /app/tokens, /app/scan, /app/profile, /app/business
tabs · Scan/Business/Tokens screens · Part 4+ me · sirf AppBar title + khaali body
profile · logout button · label/jagah spec me nahi (sirf "Profile > Logout") · secondary md button, label "Logout"
session expire · Dialog me sirf primary diya hai, Dialog component cancel bhi dikhata hai · default "Nahi" cancel (home par le jata hai)
db · users.plan · v7 me plan/subscription nahi banana · column nahi banaya
db · queues.status, avg_time_mode values · spec me list nahi · text, koi check constraint nahi (Chip se live/paused/closed use hoga)
db · customer ke liye queue/token insert · RPC Part 5+ me · abhi sirf owner policies + tokens apna select
business · error state copy · spec me sirf "EmptyState" · "Queues nahi khul payin." + "Dobara koshish karein" button
business · offline banner · minutes ka copy spec me nahi · Banner offline, last load se minutes
business · tap on Closed card · sheet O3 Part 4 me nahi (console/history baad me) · tap par kuch nahi
business · live/paused card tap · console page abhi nahi · /app/business/:id par bhejta hai (404 jab tak console na bane)
new queue · save fail toast copy · spec me nahi · "Queue nahi ban payi. Dobara koshish karein."
new queue · Advanced row · khulne par sirf start number field · start != 1 ho toh khula rehta hai
new queue · limit vs start number · spec me relation nahi · koi cross-check nahi
qr · library · asli QR ke liye zaroori · qrcode-generator (chhota, no dependency)
qr · "Scan karke token lein" Hindi + English · exact Hindi text spec me nahi · "स्कैन करके टोकन लें" + "Scan to get a token" (sirf print sheet me)
qr · QR link · domain spec me nahi · window.location.origin + /q/<code>
qr · Toast "Queue ban gayi" · ?created=1 se dikhta hai, phir URL saaf
nav · BottomNav sub-screens par · spec me nahi · sirf root tabs par dikhta hai (StickyBar se takrao na ho)
v7 · trial/paywall/Locked chip · v7 me sab free · nahi banaya
q landing · TicketCard variant="landing" · TicketCard me nahi tha · components/customer/LandingTicket.tsx alag banaya (accent rang, dashed line, notch nahi)
q landing · logged-in user ka background · skeleton ticket · sheet ke peeche skeleton rakha (closed/limit par sheet nahi, seedha ticket)
confirm · ETA formula · spec me nahi · (waiting+serving) x avg_time_min, -20% se +20%; avg_time_min khaali ho toh ETA row nahi
confirm · token ke baad C12/C13 · Part 5 me nahi · nahi banaye
confirm · paused par sheet · copy spec me nahi · sheet dikhti hai, CTA disabled, helper "Line ruki hai, thodi der baad dobara scan karein."
confirm · rate limit · limit spec me nahi · 1 min me 10 token se zyada par "rate" error
scan · AppBar transparent · AppBar me transparent variant nahi · default AppBar rakha
scan · Madad tips toggle · kahan save ho spec me nahi · sirf local state
scan · jsqr · BarcodeDetector sab browser me nahi (iPhone) · jsqr library joda (Part 5 ke liye zaroori)
scan · not-ours · sirf apni origin ka /q/<code> maana jata hai
spec bundle · referenced 01-foundations.md / 02-components.md / 03-screens-customer.md / 04-screens-owner-public.md and product spec v6 · full source files were not supplied in this upload; Part 5 file contains excerpts only · existing repo implementation was preserved and only supplied Part 5 requirements were used

part6 · owner console realtime · Supabase Realtime publication/config source spec me exact setup nahi diya · client subscription + 5s polling fallback use kiya
part6 · History/Settings/Delete menu destinations/behavior · Part 6 me labels diye gaye hain par destination/behavior spec nahi diya · menu items render kiye, destructive/navigation behavior invent nahi kiya
part6 · sound persistence · persistence rule spec me nahi diya · console-local state use kiya

part7 · /app/guide · Part 7 archive me full Guide spec nahi thi; ab Part 9 exact guide content supplied hai · Part 9 guide tabs/cards/search/iPhone text implemented
part7/9 · C6 Awaaz Settings · exact C6 settings layout and persistence rules still missing · Part 9-defined browser TTS behavior implemented; per-token and profile toggles use browser storage
part7 · skipped token · v7 excerpt me skipped copy/options hain, lekin v6 DB status constraint me `skipped` nahi aur owner console me skip, rejoin-last, ya skipped-token action nahi; owner_next sirf agla waiting token chalata hai · workflow implement nahi kiya; DB status, trigger condition, owner action, aur rejoin-last semantics chahiye
part7 · ETA calculation · product excerpt previous 10 completed tokens ka average mangta hai, lekin supplied schema/owner RPCs completed duration ka average maintain nahi karte · existing `avg_time_min` (or 3-minute default) × active queue count se issue time par eta_at_issue save kiya; 10-token rolling average support ke liye owner/session duration updates ki exact rule chahiye
part7 · realtime setup · schema/source me Supabase Realtime publication enable karne ka deployment setting nahi · client subscription plus 1.5-second RPC polling fallback; Supabase dashboard me `tokens` and `sessions` realtime enable karna zaroori
part7 · issue-time ETA range/status mapping · supplied excerpt me output range/threshold calculation incomplete · stored `eta_at_issue` preserve kiya; exact before/around/after and range mapping follow-up spec ke bina invent nahi ki

part8 · purge scheduler · target Supabase project/role may not allow pg_cron · migration attempts to enable pg_cron and schedule hourly purge; verify the `tokenapp-purge-expired` job in Supabase Cron. Recently Deleted view also purges expired records when opened.
part8 · permanent delete/history · customer-history preservation · archived customer snapshots in `customer_history` before hard deletion; live Supabase migration has not been run here
part8 · QR recovery “Settings badlein” destination · source had no settings editor spec; existing queue creation steps provide supported settings fields · implemented queue name/counter/limit/time/start editor reusing the supplied queue fields and validation components
part9 · VAPID push · VAPID key values and HTTPS host not supplied · server worker and send route are implemented; configure `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` before push can work
part9 · account deletion · service-role secret not supplied · account deletion API uses `SUPABASE_SERVICE_ROLE_KEY`; it returns a setup error until configured
part9 · iPhone guide screenshots · annotated screenshots are referenced but were not supplied · exact written steps are displayed without invented screenshots
part9 · English language · only language selector labels are specified; no English UI copy supplied · Hinglish remains active and English selection is not saved
part9 · support contact · WhatsApp/email addresses are blank in `lib/brand.ts` · contact row shows existing “Jaldi add hogi”; submitted feedback is stored in `feedback` table, no support inbox supplied
part9 · screen help and coach marks · exact 2–3-line per-screen help copy and coach-mark copy/trigger content not supplied · existing Scan help and full Guide remain available; no new instructional copy invented
part9 · push device verification · no configured Supabase/VAPID staging secrets or iPhone/Android devices in this workspace · build can be verified, real-device delivery matrix cannot
part10 · visual/performance QA · requested device widths, 200% font scale, Lighthouse and low-end Android/iOS devices are unavailable here · TypeScript and production build checks only; device and Lighthouse measurements remain unverified
