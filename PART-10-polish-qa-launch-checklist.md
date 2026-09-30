# PART 10 of 10 — Polish + QA + Launch checklist

> **Ye file kaise use karni hai:** Naye Claude chat me ye file + pichle part ka zip (`tokenapp-v9.zip`) upload karo aur likho: **"Part 10 banao."** Part 1 me sirf ye file (zip nahi).

## Claude ke liye instructions (AI ko pehle ye padhna hai)

1. Sabse pehle pichle zip ka `STATE.md` padho (Part 1 me ye file naya banani hai `STATE.md.template` se). Poora code mat padho, sirf wahi files kholo jo is part ke liye zaroori hain.
2. **Sirf is PART ka kaam karo.** Aage ke parts ke features mat banao. Pehle se bani cheezein todo mat.
3. Neeche di gayi spec hi final hai. **Kuch invent mat karo.** Kuch missing ho to `QUESTIONS.md` me likho (line: screen · element · kya missing tha · kya use kiya).
4. Jahan v7 aur purani spec me conflict ho, **v7 jeetta hai.**
5. Payment, trial, subscription, Razorpay **kahin nahi banana.**
6. Code chhoti files me rakho (300 line se kam), koi hardcoded rang/px/text nahi (tokens + i18n).
7. Kaam khatam hone par: `STATE.md` update karo (kya bana, kaunsi file kahan, kya baaki, env variables ke NAAM, kaise chalana hai), phir **`tokenapp-v10.zip`** banao (`node_modules`, `.next`, `.env` **mat daalo**) aur present karo.
8. **Limit ka dhyan:** agar lage ki chat ki limit khatam hone wali hai, to current file poori karo, `STATE.md` me "IN PROGRESS: kya adhoora hai" likho, aur zip bana do. Adhoora zip bhi chalne wali state me hona chahiye (build fail nahi).
9. Naye chat me pichla zip milne par `STATE.md` ke "IN PROGRESS" se aage badho.

## Deliverable is part ka
Edge cases, 4 states har screen (loading/empty/error/offline), accessibility, performance, final QA.

## Tum (user) ye test karo, phir agla part
- [ ] Sab QA checklist tick
- [ ] 360/390/412px + font scale 200% pe layout na tute
- [ ] Offline state, error state har screen pe

---

# SPEC (sirf is part ke liye)



<!-- ===== CORE RULES (gap protocol, banned list, naming) (00-READ-ME-FIRST.md lines 1-58) ===== -->

# 00 — READ ME FIRST (AI coder ke liye)

Ye folder app ka **exact UI specification** hai. Product ka logic `token-app-product-spec-v6.md` me hai. Ye files batati hain ki **har cheez kaisi dikhegi, kitni badi hogi, kaise behave karegi**.

## Files aur unka kaam

| File | Kya hai |
|---|---|
| `01-foundations.md` | Rang, font, size, spacing, radius, shadow, texture, icons, motion, haptics, sound, responsive, accessibility, formats |
| `02-components.md` | Har component (button, input, sheet, dialog, toast, bottom nav, ticket card...) ke exact size, rang, states, animation |
| `03-screens-customer.md` | Customer ki har screen: layout, element names, copy, behavior, states |
| `04-screens-owner-public.md` | Owner ki har screen + public pages (home, login, legal, errors) |

## Kis file ki baat maanni hai (priority)

1. **Visual mockups** (jab bane), dikhne ke liye.
2. **Ye UI spec**, sizes/rang/copy/behavior ke liye.
3. **Product spec v6**, logic/rules/edge cases ke liye.

Do files me conflict mile toh **guess mat karo**. `QUESTIONS.md` me likho (neeche).

## GAP PROTOCOL (sabse zaroori)

Hum jaante hain ki AI gap dekh ke apni marzi se bhar deta hai. **Yahan wo mana hai.**

1. **Kuch bhi invent mat karo.** Rang, size, text, animation, screen, feature, library, naam. Sab kuch spec me diya hai.
2. Agar koi cheez spec me **nahi** mile:
   - Sabse paas ka **token/component** use karo (jaise sabse paas ka spacing token).
   - Repo root me `QUESTIONS.md` me ek line likho: `screen · element · kya missing tha · maine kya use kiya`.
   - Kaam rokna nahi hai, par apni taraf se naya design/feature nahi banana.
3. **Exact copy** use karo (spec me quotes me likha text). Text badalna, chhota karna, English me badalna mana.
4. **Naye screens, features, animation, icons, libraries jodna mana**, jab tak spec me na ho.
5. Hardcode mana: rang, px, ms, text sab **tokens/i18n keys** se aayein.
6. Har element ko spec ka **`id`** do (`data-testid="live.hero"`). Names spec jaise hi rakho.
7. Har screen ke 4 states (loading, empty, error, success) aur offline state banane hain, chahe spec me ek line hi likhi ho.
8. Sirf "happy path" nahi. Product spec ke edge cases (Section 13) implement karne hain.
9. Har screen khatam hone par apni **Definition of Done** check karo:
   - [ ] Spec ke sab elements maujood, exact size/rang/copy
   - [ ] Loading/empty/error/offline states
   - [ ] 360px, 390px, 412px, tablet, laptop pe theek
   - [ ] Android low-end pe 60fps jaisa smooth
   - [ ] Keyboard/tab focus, screen-reader labels, font scale 200%
   - [ ] Koi extra element/feature nahi
10. Kuch samajh na aaye toh **poochho, mat maano.**

## AI-jaisa look ki banned list (kabhi nahi)

Purple/blue gradients, glassmorphism, neon glow, blob backgrounds, emoji as icons, har cheez ka card, card ke andar card, har jagah shadow, bounce/spring animation, confetti, "Oops!/Awesome!/Welcome aboard!" text, stock illustrations, Lorem ipsum, placeholder names (John Doe), 1000-line files, `alert()`, `console.log` chhodna, hardcoded values, unused code, default browser form styling.

## Naming
- Components: `PascalCase` (`TicketCard`, `BottomSheet`).
- CSS variables: `--c-*`, `--sp-*`, `--r-*`, `--dur-*`, `--ease-*` (01-foundations me).
- Routes: spec me likhe hue.
- Test ids: spec ke `id` column jaise.

## Placeholder brand
App ka naam abhi `TokenApp` hai. Code me ek hi jagah (`brand.ts`) rakho taaki baad me badle.


<!-- ===== C17 Global states (00-READ-ME-FIRST.md lines 979-991) ===== -->

## C17. Global states (sab customer screens)

| State | Design |
|---|---|
| Loading | Skeletons (2.16), spinner sirf buttons me |
| Offline (cached data hai) | Banner `offline`, data grey nahi hota |
| Offline (data nahi) | EmptyState icon `wifi-off`, title "Internet nahi mila", body "Connection check karke dobara koshish karein.", action "Dobara koshish karein" |
| Server error | EmptyState icon `triangle-alert`, title "Kuch load nahi ho paya", body "Thodi der baad dobara koshish karein.", action "Dobara koshish karein" |
| Session expire | Dialog "Dobara login karein" body "Aapka session khatam ho gaya.", button primary "Login karein" |
| 404 | EmptyState icon `qr-code`, title "Ye page nahi mila", action "Home par jayein" |
| Permission denied (notification) | Banner `info` (C12) |



<!-- ===== Product §13 edge cases (00-READ-ME-FIRST.md lines 1645-1662) ===== -->

## 13. Edge cases

- Same QR do baar scan → wahi token, koi nayi entry nahi.
- Alag business ka QR → naya token, multiple ek saath.
- Do log ek hi second me scan → **server pe atomic** number assign (Postgres transaction/function). Duplicate number kabhi nahi.
- **Ek account = ek queue me ek active token.** Doosra token lene par wahi purana token khule. Zyada logon ke liye owner **Walk-in** se naam likh ke token de. Spam ho toh owner ek swipe me Hatao kar deta hai, hataya hua number skip hokar agla turant aata hai.
- Limit khatam, queue closed/paused/deleted → 5.3 ke messages.
- Internet gaya → banner "Offline — last update 2 min pehle", purana number dikhta rahe.
- Owner ne "Pichla" dabaya → history log me record.
- User ka token skip hua → 5.4 ke options.
- Logout/refresh/reinstall/naya phone → same Google account se login karte hi tokens wapas dikhein, jahan the wahi se continue.
- Session end par pending tokens `Expired`.
- Naam change kiya toh purane tokens ka naam nahi badalta (us waqt ka naam history me).
- Time IST, 12-hour format (9:00 AM).
- Bahut lambe naam UI tode nahi (ellipsis + tap par poora).

---


<!-- ===== Product §19 Final QA (00-READ-ME-FIRST.md lines 1817-1851) ===== -->

## 19. Final QA checklist

- [ ] QR scan → token: naye user 60 sec me, returning user 2 tap
- [ ] Same QR do baar scan, duplicate nahi
- [ ] Do phone ek saath scan, alag numbers
- [ ] Owner "Agla" ke baad user screen <1 sec me update
- [ ] Refresh/logout/login ke baad tokens wahin se continue
- [ ] Recovery: delete → apna QR scan → sahi toast (ek cheez ka naam / "Saara data wapas aa gaya")
- [ ] Apna QR scan (kuch delete nahi) → "Aap apna hi QR scan kar rahe hain"
- [ ] Galat QR → kuch nahi hota, halka toast
- [ ] Closed queue scan → "Token line band hai"
- [ ] Withdraw → owner ko turant dikhe, Agla par auto-skip
- [ ] History me start aur end time (customer + owner)
- [ ] Android Chrome push, iPhone Home Screen push, dono test
- [ ] Offline banner, koi crash nahi
- [ ] Sasta Android (2GB RAM), 4G slow pe smooth
- [ ] Font Large pe layout nahi tootta, Hindi text cut nahi
- [ ] Har screen ke loading/empty/error/success state
- [ ] Koi ad, GPS aur user-QR-share kahin nahi
- [ ] Trial 2 din ek account ko ek baar; trial ke baad bina subscription QR/session nahi banta (server pe bhi)
- [ ] Payment fail, grace, expire, renew, cancel sab flows chalte hain
- [ ] Awaaz ON karte hi test awaaz, aur phone-lock warning dikhti hai
- [ ] Recently Deleted: date, countdown, Recover, Hamesha ke liye hatao sahi; 72 ghante baad purge
- [ ] Ek account ek queue me sirf ek active token; owner walk-in se dusre logon ko token de sakta hai
- [ ] Real iPhone pe: popup aata hai, Guide ke steps se Home Screen add + notification chalu hota hai
- [ ] Guide me har customer aur owner option ka card hai, offline bhi khulti hai
- [ ] Hatao ek swipe me, agla number turant aata hai
- [ ] Kahin "monthly/mahina" nahi likha; UI me sirf "₹3.57 per din"; payment button, confirmation, receipt aur Terms me ₹100/28 din saaf hai
- [ ] Section 21 (professional polish + Android) poora pass
- [ ] Section 22 (launch checklist) poora
- [ ] iPhone testing plan (Section 20) poora pass
- [ ] Section 16 ka ek bhi rule nahi tooti

---


<!-- ===== Product §21.3-22 Android + launch (00-READ-ME-FIRST.md lines 1910-1942) ===== -->

### 21.3 Android par smooth aur clean
- **Target:** sasta Android (2GB RAM, Chrome) pe 60fps jaisa smooth. Test device: Moto G / Redmi class.
- Animation sirf `transform` aur `opacity` se. Layout/height animate nahi. Number flip 250ms.
- Performance budget: LCP < 2.5s (4G), CLS < 0.1, INP < 200ms, initial JS < 150KB gzip. Lighthouse Performance ≥ 90 (mobile).
- Code splitting: Sudoku, Guide, Owner screens alag load. Heavy library nahi.
- Fonts self-host, `font-display: swap`, **Devanagari subset** (bhaari hota hai). Icons SVG.
- Touch: `touch-action: manipulation`, tap-highlight custom, 48px targets, accidental pull-to-refresh/overscroll control (`overscroll-behavior`).
- Android back button sahi chale (History API stack), band na ho, loop na ho.
- `theme-color` meta (status bar site ke rang me), `color-scheme` set (Chrome ka force-dark UI na tode), manifest ke saath splash + icons (maskable).
- Chrome, Samsung Internet aur Firefox pe test. QR kai baar WhatsApp/Instagram ke in-app browser me bhi khulta hai, wahan bhi login/token flow chalna chahiye.
- Font scale (system 130–200%) aur battery saver mode me layout aur animation theek.
- Skeleton loaders, koi layout jump nahi, koi blank/white flash nahi.

### 21.4 Visual QA (release se pehle)
- [ ] 5 alag screen size (360px, 390px, 412px, tablet, laptop) pe har screen dekhi
- [ ] Koi button/card stretch, cut, overlap ya alignment se bahar nahi
- [ ] Har screen me same header/spacing/rang/font
- [ ] Sasta Android pe scroll aur number animation smooth
- [ ] Lighthouse mobile ≥ 90, CLS < 0.1
- [ ] Sab states (loading/empty/error) bhi professional dikhte hain, "toota hua" nahi

---

## 22. Launch se pehle ki checklist (jo abhi baaki hai)

1. **Final naam + domain + logo/app icon.** Naam chhota, bolne me aasan, domain aur social handles free ho.
2. **Legal pages:** Terms, Privacy Policy, Refund/Cancellation, Contact. Razorpay ko ye website pe chahiye.
3. **Razorpay account activation (KYC/bank).** Isme kuch din lag sakte hain, isliye code ke saath hi shuru kar do.
4. **Support:** Profile me "Madad chahiye?" (WhatsApp/email) aur ek "Feedback bhejein" button.
5. **Staging + production alag**, backups on, error monitoring (Sentry), custom domain ke saath HTTPS, email sender domain set.
6. **Pehla pilot:** ek asli dukaan/stall me 3–5 din chalao (tum khud jaake), roz feedback likho, phir fix.

---

<!-- ===== v7 §17 QA checklist (05-changes-v7.md lines 186-205) ===== -->

## 17. QA checklist (in changes ke liye)

- [ ] Nayi queue 3 step, har validation error sahi; queue banne par QR screen; QR phone se scan hota hai
- [ ] Start number 1, 10, 145, 9999 se queue banti hai; pehla token wahi number
- [ ] Din khatam → Dobara shuru → 145 likha → pehla token 145
- [ ] Agla/Pichla 200 baar tez dabao, number kabhi Infinity/NaN/negative/"undefined" nahi
- [ ] Khaali list par Agla → "Ab line me koi nahi hai."; koi serving nahi → "—"
- [ ] 4–5 digit number hero me kat/overflow nahi
- [ ] Console: ticket me chalte token ka naam; customer ticket me nahi
- [ ] Console me QR dikhta hai aur scan hota hai
- [ ] Agla par purana wala list se gayab nahi, grey; line chhodne wala owner ko grey dikhta hai
- [ ] Current wala 3rd row pe, upar max 2 grey; list box ke andar scroll
- [ ] Scroll karke chhod do → list waisi hi rahe (koi auto-reset nahi); "Abhi ke number par" wapas le aaye
- [ ] Cross → popup; "Nahi" par kuch nahi; "Haan, hatao" par hatta + Undo 5s
- [ ] Delete → Recently Deleted → Recover; permanent delete par dobara confirm
- [ ] Customer live screen par bada Leave button nahi; ⋮ → Line chhodein → confirm
- [ ] Customer "Line ke log" me list ke neeche ticket, live update
- [ ] Payment/trial/₹ kahin nahi dikhta
- [ ] Login ke bina tab nahi khulte; naam pehli baar hi puchta hai
- [ ] 360 / 390 / 412 px par sab theek; font scale 200% par layout na tute

<!-- ===== v7 §16 conflict list (v7 hamesha jeetta hai) (05-changes-v7.md lines 170-185) ===== -->

## 16. Purani files me kya badal gaya (conflict list)

| Purani baat | Ab |
|---|---|
| Trial, ₹3.57/din, ₹100/28 din, paywall, subscription (v6 §1, 14C, `04` O12–O13, P1 price) | **Hata. Sab free.** |
| Bottom nav order Mere Tokens · Scan · Business · Profile (`02` 2.4) | Mere Tokens · Scan · **Profile · Business** |
| Owner Hatao = ek swipe, confirm nahi (v6, `02` 2.22) | **Cross par confirm popup zaroori** |
| Waiting list se current/done wale gayab (implicit) | **Kabhi gayab nahi, grey, number order** |
| "Line ke log" `03` C8 me section-wise list | Number order + grey, 3rd-row position, box scroll |
| Customer ticket me owner ka naam nahi | Same (naam **sirf owner console ticket** me) |
| Live screen pe sticky "Line chhodein" (`03` C5 `live.leave`) | ⋮ menu ke andar |
| Console order (`04` O5) | Section 8 ka order |
| Dobara shuru = number reset (0/1) | Owner ka chuna hua start number |
| Login sirf C1/C2 | Login ke bina koi tab nahi khulta |
| Empty current number "0" | "—" |
