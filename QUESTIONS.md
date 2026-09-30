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
