# PART 7 of 10 — Customer: Live Token + Line ke log

> **Ye file kaise use karni hai:** Naye Claude chat me ye file + pichle part ka zip (`tokenapp-v6.zip`) upload karo aur likho: **"Part 7 banao."** Part 1 me sirf ye file (zip nahi).

## Claude ke liye instructions (AI ko pehle ye padhna hai)

1. Sabse pehle pichle zip ka `STATE.md` padho (Part 1 me ye file naya banani hai `STATE.md.template` se). Poora code mat padho, sirf wahi files kholo jo is part ke liye zaroori hain.
2. **Sirf is PART ka kaam karo.** Aage ke parts ke features mat banao. Pehle se bani cheezein todo mat.
3. Neeche di gayi spec hi final hai. **Kuch invent mat karo.** Kuch missing ho to `QUESTIONS.md` me likho (line: screen · element · kya missing tha · kya use kiya).
4. Jahan v7 aur purani spec me conflict ho, **v7 jeetta hai.**
5. Payment, trial, subscription, Razorpay **kahin nahi banana.**
6. Code chhoti files me rakho (300 line se kam), koi hardcoded rang/px/text nahi (tokens + i18n).
7. Kaam khatam hone par: `STATE.md` update karo (kya bana, kaunsi file kahan, kya baaki, env variables ke NAAM, kaise chalana hai), phir **`tokenapp-v7.zip`** banao (`node_modules`, `.next`, `.env` **mat daalo**) aur present karo.
8. **Limit ka dhyan:** agar lage ki chat ki limit khatam hone wali hai, to current file poori karo, `STATE.md` me "IN PROGRESS: kya adhoora hai" likho, aur zip bana do. Adhoora zip bhi chalne wali state me hona chahiye (build fail nahi).
9. Naye chat me pichla zip milne par `STATE.md` ke "IN PROGRESS" se aage badho.

## Deliverable is part ka
Live token screen (realtime), Line ke log, Mere Tokens, history, line chhodna.

## Tum (user) ye test karo, phir agla part
- [ ] Owner Agla dabaye -> customer screen <1 sec me update
- [ ] Refresh/logout/login ke baad token wahin se continue
- [ ] Customer live screen pe bada Leave button nahi; menu (3 dots) me hai
- [ ] Line chhodne par owner ko turant grey dikhe
- [ ] Customer ticket me owner ka naam nahi

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


<!-- ===== C5 Live Token (00-READ-ME-FIRST.md lines 726-779) ===== -->

## C5. Live Token — `/app/tokens/:id` ⭐

Sabse important screen. Skeleton pehle (ticket ka exact size).

**Layout (top→bottom):**

| id | Element | Spec |
|---|---|---|
| `live.appbar` | `AppBar` | back `live.back`, title `live.title` = business naam (`h3`, 1 line), right `IconButton` `live.more` (`ellipsis-vertical`, label "Aur options") |
| `live.banner` | `Banner` slot | offline / reconnecting / paused (agar applicable) |
| `live.ticket` | `TicketCard` (state ke hisaab se) | margin-top 12 |
| `live.eta-note` | Note niche | TicketCard component me (2.9) |
| `live.progress` | `Card` padding 16, margin-top 16 | title `label` "Line me aapki jagah" + `ProgressLine` full (margin-top 12) |
| `live.sound-row` | `Card` padding 0 16, margin-top 16 | `ToggleRow` icon `volume-2`, label "Awaaz se batao"; niche `caption` `--c-text-2` (padding-bottom 12) "Phone off ya lock karne par awaaz nahi aayegi. Tab sirf notification milega." |
| `live.people-row` | `Card` padding 0, margin-top 16 | `SettingsRow` icon `users`, label "Line ke log dekhein", value `{n}` , chevron |
| `live.sudoku` | (v1.1) Card, margin-top 16 | row: icon `grid-3x3`(lucide) + "Time pass ke liye Sudoku" + chevron |
| `live.leave` | `StickyBar` | `Button danger-outline md` "Line chhodein" |

Content bottom padding = StickyBar height + 24.

**More menu (`live.more`) — BottomSheet, title "Options", ListRows:**
1. `users` "Line ke log dekhein"
2. `volume-2` "Awaaz settings" → C6
3. `circle-help` "Guide (Madad)" → `/app/guide`
4. `log-out` "Line chhodein" (text `--c-danger`)

**State table (TicketCard content):**

| State | Main overline | Number | Main caption | Stub left | Stub right | Haptic/Sound |
|---|---|---|---|---|---|---|
| `waiting` | AB CHAL RAHA HAI | current | "Shuru: 9:00 AM" (`caption`) | AAPKA TOKEN · 19 | "6 log pehle" / "Lagbhag 20–30 min" / chip andaza | — |
| `next` | AB CHAL RAHA HAI | current | **"Taiyaar rahiye, aap agle hain"** (`body-strong`) | AAPKA TOKEN · 19 | "Aap agle hain" / "Lagbhag 5 min" | `[20,40,20]`, `next.mp3` (agar Awaaz ON) |
| `now` | AB CHAL RAHA HAI | apna number | **"Aapki baari hai"** (`body-strong`) | AAPKI BAARI · 19 | "Counter par jaayein" | `[30,60,30,60,30]`, `now.mp3` (agar ON) + `role="alert"` |
| `done` | (icon `circle-check` 40 in main) | — | h2 "Dhanyavaad", `body-sm` "Aapka token {n} poora hua." | stub ki jagah `Button secondary md` "History dekhein" | — | — |
| `removed` | icon `user-minus` 40 | — | h2 "Owner ne aapko line se hata diya", `body-sm` "Aap dobara scan karke token le sakte hain." | stub: `Button primary md` "Scan karein" | — | Toast nahi |
| `skipped` | icon `triangle-alert` 40 | — | h2 "Aapka number nikal gaya", `body-sm` "Aap line me last me wapas aa sakte hain." | stub: `Button primary md` "Line me wapas aayein" + `Button tertiary md` "Chhodein" | — | — |
| `closed` | icon `moon` 40 | — | h2 "Aaj ki line khatam ho gayi", `body-sm` "Aapka token history me hai." | stub: `Button secondary md` "History dekhein" | — | — |

`done/removed/skipped/closed` me `live.progress`, `live.sound-row`, `live.leave` hide.

**Behavior:**
- Number realtime: NumberFlip animation (250ms). Connection toot jaye: Banner `reconnecting`, 5s polling; wapas aane par Banner hide.
- State `waiting→next` jab aapke aage ka koi nahi bacha (ahead=0) aur current != aapka. `next→now` jab current == aapka.
- "Line me wapas aayein": server naya last number deta hai, state `waiting`.
- `now` par screen wake lock (jab tak page khula).
- **Withdrawn/removed tokens** count me nahi (peeche wale ke "log pehle" me nahi jodte).
- "Done" ke 10 min baad token `Mere Tokens > Purane` me chala jata hai, is screen ka link history detail pe redirect.
- Pull-to-refresh nahi (realtime hai). Screen refresh par state wahin se resume.
- Tap on `live.sudoku`: v1.1 me C16, v1 me card hi nahi dikhta.

**States:** loading (skeleton), offline (Banner + last known numbers), error (EmptyState "Ye token nahi mila", action "Mere Tokens par jayein"), token doosre account ka (404 same message).

---


<!-- ===== C7 Leave + C8 People + C9 Mere Tokens + C10 History (00-READ-ME-FIRST.md lines 793-845) ===== -->

## C7. Line chhodein — `Dialog`

Title "Line chhodein?" · Body "Aapka number {n} chala jayega. Aap dobara scan karke naya token le sakte hain." · Buttons: `danger-filled` "Haan, chhodein", `tertiary` "Nahi".
**Behavior:** confirm → loading → success: navigate `/app/tokens`, Toast "Aapne line chhod di". Owner ko realtime "Line chhod di". Error: Toast "Line nahi chhod paye. Dobara koshish karein."

---

## C8. Line ke log — `/app/tokens/:id/people`

| id | Element | Spec |
|---|---|---|
| `people.appbar` | AppBar back, title "Line ke log" |
| `people.count` | `caption` `--c-text-2`, padding 8 20 | "{n} log line me" |
| `people.list` | Virtualized list of `PersonRow` (poore naam) | Order: (1) abhi chal raha (pinned), (2) waiting (number ascending), (3) recent withdrawn/removed (last 5, `left` chip) |
| section labels | `overline` `--c-text-2`, padding 16 20 8 | "AB CHAL RAHA HAI" / "INTEZAR ME" / "HAAL HI ME CHHODNE WALE" |

**Behavior:** open par agar "Aap" row viewport ke bahar ho toh smooth scroll (300ms) uspe. Realtime rows insert/remove (opacity 200ms). Row tap = kuch nahi. Poora naam dikhta hai; lamba ho toh ellipsis, **tap par row expand** (naam poora, 2 lines tak).
**Empty:** EmptyState icon `users` "Abhi line me koi nahi hai." **Loading:** 6 skeleton rows. **Offline:** Banner.

---

## C9. Mere Tokens — `/app/tokens` (tab)

| id | Element | Spec |
|---|---|---|
| `tokens.appbar` | Root AppBar title "Mere Tokens" |
| `tokens.live-label` | `overline` `--c-text-2`, padding 8 20 8 | "ABHI KE TOKENS" |
| `tokens.live-list` | `TokenCard`s, gap 12 | sorted: jiska number sabse paas (Now > Next > Waiting by ahead count) |
| `tokens.past-label` | `overline`, margin-top 24 | "PURANE" |
| `tokens.past-list` | `Card` padding 0 with `ListRow`s | Row: `body-strong` business naam + `caption` `--c-text-2` "26 Sep · Token 19" ; right `Chip done`/`left` ; chevron |
| `tokens.more` | `Button tertiary sm` center | "Aur dekhein" (10 aur load) |

**Empty (no live):** EmptyState icon `ticket`, title "Abhi koi token nahi", body "QR scan karke token lein.", action `Button primary` "Scan karein" → `/app/scan`. **Empty (no past):** section hide.
**Loading:** 3 skeleton TokenCards. **Behavior:** tap TokenCard → `/app/tokens/:id`; past row → history detail. Realtime update cards me (NumberFlip nahi, plain text update).

---

## C10. Token history detail — `/app/tokens/history/:id`

AppBar back, title "Token history". Content: `Card` padding 20.

| Element | Spec |
|---|---|
| Business naam | `h2` |
| Date | `body-sm` `--c-text-2` "26 Sep 2025" |
| Rows (margin-top 16) | Har row min-height 48, divider 1px; left `body-sm` `--c-text-2`, right `body-strong` |

Rows (order): "Queue shuru" 9:00 AM · "Queue khatam" 6:30 PM · "Aapka token" 19 · "Token liya" 10:12 AM · "Aapka number aaya" 10:42 AM · "Wait" 30 min · "Andaza" 25–35 min · "Status" `Chip` (done/left).
Neeche (margin-top 16): estimate Chip full-width-ish: "Andaze se pehle" (`now` colors) / "Andaze ke aas-paas" (`waiting`) / "Andaze ke baad" (`next` colors).
Removed/withdrawn tokens me "Aapka number aaya" row nahi.

---


<!-- ===== v7 §12-13 customer changes (05-changes-v7.md lines 142-159) ===== -->

## 12. Customer — "Line chhodein" ka option chhota kiya

- Live Token screen se **bada sticky "Line chhodein" button hata diya** (galti se dabta tha).
- Ab AppBar ke right me **⋮ (`ellipsis-vertical`, `aria-label="Aur options"`)** → BottomSheet "Options" → ek row **"Line chhodein"** (`--c-danger`, icon `out`) → wahi confirm Dialog (`03` C7): "Line chhodein?" · "Aapka number {n} chala jayega. Aap dobara scan karke naya token le sakte hain." · "Haan, chhodein" / "Nahi".
- Yani 3 step: ⋮ → Line chhodein → Haan. Galti se hone ka chance nahi.
- Live screen ke sticky bar hatne se bottom padding sirf 32px. Toast ki position bina-nav/bina-sticky screens jaisi (`safe-bottom + 12px`).
- ⋮ sirf active token (waiting/next/now) me dikhe. done/removed/left/closed me nahi.

## 13. Customer "Line ke log" screen — ticket ke saath

`/app/tokens/:id/people`:
1. AppBar "Line ke log".
2. Row: "{n} log line me · {kul} kul token" + button "Abhi ke number par".
3. **List box** (Section 10).
4. **Neeche aapka TicketCard** (Live Token wala hi, poora, stub ke saath, state colors ke saath) + "Ye anumaan hai, sahi samay alag ho sakta hai." Ticket sirf jab token active ho (waiting/next/now). Warna list poori jagah leti hai.
5. `now` state me ticket `role="alert"`.
Isse list dekhte hue bhi pata rehta hai ki abhi kaunsa number chal raha hai.


<!-- ===== Product §5.4-5.8 (00-READ-ME-FIRST.md lines 1407-1452) ===== -->

### 5.4 Live Token screen (sabse important)
1. Header: back, business naam, 3-dot menu.
2. Hero card (~45%): label "AB CHAL RAHA HAI", **bahut bada number**. Number badalte waqt slide/flip animation 250ms.
3. Pill: "Aapka token · 19".
4. "6 log aapse pehle".
5. "Lagbhag 20–30 min" + "andaza" badge + chhoti line "Ye anumaan hai, sahi samay alag ho sakta hai."
6. Line ki progress bar, apna position dot.
7. "Shuru hua: 9:00 AM" chhota text.
8. Awaaz toggle row + neeche chhoti grey line: "Phone off ya lock karne par awaaz nahi aayegi. Tab sirf notification milega." Toggle ON karte hi test awaaz bajti hai.
9. **Sudoku card** (v1.1) "Time pass ke liye Sudoku khelein".
10. Sticky bottom: "Line chhodein" (outline/red text).

**3-dot menu:** Line ke log dekhein, Awaaz settings, Line chhodein, **Guide (Madad)**.
(**"Mera QR dikhao / share" HATA DIYA.**)

**State ke hisaab se screen:**
- *Waiting*: normal.
- *Next*: hero amber, "Taiyaar rahiye, aap agle hain", haptic.
- *Now*: poori screen green, bada "Aapki baari hai", vibration + sound + push.
- *Done*: tick, "Dhanyavaad", "History dekhein".
- *Removed by owner*: grey card, "Owner ne aapko line se hata diya. Dobara scan karke token le sakte hain."
- *Skipped*: "Aapka number nikal gaya." Options: "Line me wapas aayein (last me)" / "Chhodein".
- *Session closed*: "Aaj ki line khatam ho gayi." History me chala jaye.

### 5.5 Line ke log (list)
- Row: number, **poora naam**, "Aap" tag apne row pe (highlighted).
- Aage aur peeche dono ke log dikhao, jo abhi kaha jaa raha hai wo top pe pinned.
- Withdrawn wale grey + "Line chhod di".
- Walk-in wale par chhota "Walk-in" chip.

### 5.6 Line chhodein (withdraw)
- Dialog: "Kya aap line chhodna chahte hain? Aapka number 19 chala jayega." → "Haan, chhodein" (red) / "Nahi".
- Chhodne par owner ko turant dikhe ki ye line se nikal gaya. Owner "Agla" dabaye toh withdrawn number **apne aap skip** ho jaye aur toast "#14 ne line chhod di, #15 par gaye".
- Console me withdrawn row par text: "Ye ab list me nahi hain, aap agle number par ja sakte hain."

### 5.7 My Tokens tab
- Cards: business naam, "Chal raha: 12 · Aapka: 19", status chip. Tap = live screen.
- Multiple shops ek saath allowed. Jiska number sabse paas hai wo upar.
- Neeche "Purane" section: history.

### 5.8 History
- Token Done hone ke **10 minute baad** apne aap "Purane" me shift.
- Row: business naam, tareekh, aapka number, "Number aaya: 10:42 AM", badge **"Andaze se pehle / baad me"**.
- Open karne par: queue ka **Shuru: 9:00 AM · Khatam: 6:30 PM**, apna number ka time, wait kitna hua.
- Customer ki history uski apni hai. Owner ne queue delete kar di toh bhi customer ki history bani rahegi.


<!-- ===== Product §10 ETA (00-READ-ME-FIRST.md lines 1601-1609) ===== -->

## 10. ETA (andaza)

- Default Automatic: **pichhle 10 completed tokens ka औसत**, outlier hata ke. Shuru ke 3 token tak owner ka diya time ya default 3 min.
- Hamesha **range**: "Lagbhag 20–30 min". Kabhi "0 min" nahi, "Bas aane hi wala hai".
- Users aur owner dono ko dikhe. "Andaza" badge hamesha saath.
- History me "estimate se pehle/baad me" ke liye issue-time ka ETA `eta_at_issue` save karo.

---


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
