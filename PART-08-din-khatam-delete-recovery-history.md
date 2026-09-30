# PART 8 of 10 — Din khatam, Delete, Recovery, History

> **Ye file kaise use karni hai:** Naye Claude chat me ye file + pichle part ka zip (`tokenapp-v7.zip`) upload karo aur likho: **"Part 8 banao."** Part 1 me sirf ye file (zip nahi).

## Claude ke liye instructions (AI ko pehle ye padhna hai)

1. Sabse pehle pichle zip ka `STATE.md` padho (Part 1 me ye file naya banani hai `STATE.md.template` se). Poora code mat padho, sirf wahi files kholo jo is part ke liye zaroori hain.
2. **Sirf is PART ka kaam karo.** Aage ke parts ke features mat banao. Pehle se bani cheezein todo mat.
3. Neeche di gayi spec hi final hai. **Kuch invent mat karo.** Kuch missing ho to `QUESTIONS.md` me likho (line: screen · element · kya missing tha · kya use kiya).
4. Jahan v7 aur purani spec me conflict ho, **v7 jeetta hai.**
5. Payment, trial, subscription, Razorpay **kahin nahi banana.**
6. Code chhoti files me rakho (300 line se kam), koi hardcoded rang/px/text nahi (tokens + i18n).
7. Kaam khatam hone par: `STATE.md` update karo (kya bana, kaunsi file kahan, kya baaki, env variables ke NAAM, kaise chalana hai), phir **`tokenapp-v8.zip`** banao (`node_modules`, `.next`, `.env` **mat daalo**) aur present karo.
8. **Limit ka dhyan:** agar lage ki chat ki limit khatam hone wali hai, to current file poori karo, `STATE.md` me "IN PROGRESS: kya adhoora hai" likho, aur zip bana do. Adhoora zip bhi chalne wali state me hona chahiye (build fail nahi).
9. Naye chat me pichla zip milne par `STATE.md` ke "IN PROGRESS" se aage badho.

## Deliverable is part ka
End day, Dobara shuru (custom start number), Delete, Recently Deleted, QR-scan recovery, owner history.

## Tum (user) ye test karo, phir agla part
- [ ] Din khatam -> Dobara shuru -> 145 likha -> pehla token 145
- [ ] Delete -> Recently Deleted -> Recover kaam karta hai
- [ ] Apna QR scan (delete ke baad) -> sahi toast
- [ ] History me start aur end time dikhte hain

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


<!-- ===== O7 End day + O8 Delete + O9 Recently Deleted + O10 Recovery + O11 History (00-READ-ME-FIRST.md lines 1155-1207) ===== -->

## O7. End day dialog

`Dialog`: title "Aaj ka kaam khatam karein?" · body "Bache hue token khatam ho jayenge. Customer scan karenge toh 'Ye line band hai' dikhega." · `danger-filled`... **primary** "Din khatam karein" (`primary`, destructive nahi) · `tertiary` "Nahi".
**Behavior:** `ended_at` save, session close, console closed state (O5). Toast "Din khatam. Dobara shuru karne ke liye Business tab me jayein."

---

## O8. Delete dialog

`Dialog`: title "Ye queue delete karein?" · body "3 din tak Settings > Recently Deleted se wapas la sakte hain. Uske baad ye hamesha ke liye hat jayegi." · `danger-filled` "Delete karein" · `danger-text` "Abhi hamesha ke liye hatao" (dobara confirm: title "Hamesha ke liye hatao?", body "Ye wapas nahi aayega.", `danger-filled` "Haan, hatao", `tertiary` "Nahi") · `tertiary` "Nahi".
**Behavior:** soft delete → Toast "Queue delete ho gayi" (Undo nahi, kyunki Recently Deleted hai). `Business` list se hata.

---

## O9. Recently Deleted — `/app/profile/recently-deleted`

AppBar back, title "Recently Deleted".

| id | Element | Spec |
|---|---|---|
| `rd.info` | Info card | bg `--c-surface-2`, R12, padding 12, `body-sm`: "Delete kiye gaye items 3 din tak yahan rehte hain. Uske baad hamesha ke liye hat jate hain." + `caption` `--c-text-2` "Aakhri delete: 26 Sep, 4:10 PM" |
| `rd.list` | Cards gap 12 | Har card padding 16 |

**Item card:** row1: naam `body-strong` + `Chip` type ("Queue" / "History", `waiting` style). row2 (margin-top 8) `body-sm` `--c-text-2`: "Delete hua: 26 Sep, 4:10 PM". row3 `body-sm`: "Hamesha ke liye hatega: 29 Sep, 4:10 PM" + `Countdown` ("2 din 3 ghante baaki", color `--c-next-strong`, `label`). row4 (margin-top 12): `Button primary sm` "Recover" (icon `rotate-ccw`) + `Button danger-text sm` "Hamesha ke liye hatao".
**Behavior:** Recover → loading → Toast success "Queue wapas aa gayi." (History: "History wapas aa gayi."). Queue **Closed** state me wapas aati hai; dobara chalane ke liye subscription/trial chahiye (`Business` me dikhegi). "Hamesha ke liye hatao" → confirm Dialog (O8 wala). 3 din baad item apne aap list se hat jata hai.
**Empty:** EmptyState icon `trash-2`, title "Koi deleted item nahi hai".

---

## O10. QR-scan recovery (owner apna QR scan kare)

Kaam server-side (product spec Section 7.4). UI: sirf `Toast`/sheet.

| Case | UI |
|---|---|
| Apna QR, kuch delete nahi hua | Toast info "Aap apna hi QR scan kar rahe hain." + action "Queue kholein" |
| Ek cheez restore hui | Toast success "Queue wapas aa gayi." ya "History wapas aa gayi." |
| Ek se zyada restore | Toast success "Saara data wapas aa gaya." |
| Restore ke baad | `BottomSheet`: title "Isi settings se dobara shuru karein?" · `Button primary md` "Shuru karein" · `Button secondary md` "Settings badlein" |
| 3 din nikal chuke | Landing "Ye QR abhi available nahi hai" |
| Galat QR | Toast info "Ye QR nahi mila." |

---

## O11. Owner history — `/app/business/:id/history`

AppBar back, title "History". List: har **session** ek `Card` padding 16:
`body-strong` "26 Sep 2025" · `body-sm` `--c-text-2` "Shuru: 9:00 AM · Khatam: 6:30 PM" · row: `Chip` "34 token" (`waiting`) + `Chip` "Ausat wait 6 min" (`waiting`). Tap → session detail.
**Session detail** (`/history/:sessionId`): summary Card (start, end, total tokens, ausat wait, walk-ins) + list rows: number, naam, "Liya 10:12 AM · Call 10:42 AM", `Chip` status (done/left/removed/skipped).
**Empty:** EmptyState icon `clock` "Abhi koi history nahi". **Loading:** skeleton cards.

---


<!-- ===== v7 §5-6 restart + delete (05-changes-v7.md lines 54-71) ===== -->

## 5. Din khatam aur "Dobara shuru karein" (custom start number)

- **Din khatam:** dialog "Aaj ka kaam khatam karein?" · "Bache hue token khatam ho jayenge. Customer scan karenge toh 'Ye line band hai' dikhega." · "Din khatam karein" / "Nahi". Waiting tokens `expired`, chalta hua token `done`, queue `closed`.
- **Dobara shuru karein** (closed console ka sticky button) → BottomSheet:
  - Title "Dobara shuru karein" · "Token kis number se shuru ho? Jaise 1, 10 ya 145."
  - Field "Shuruaati number" (default **1**, numeric, 1–9999) · helper "Pichhli baar: {n} se shuru hua tha. Purani history safe rehti hai."
  - Error: "Number 1 se 9999 ke beech likhein." · "Shuru karein" / "Wapas".
  - Success: naya session, list khaali, pehla token wahi number jo likha, Toast "Nayi shuruaat. Number {n} se chalu." QR wahi rehta hai.
  - Customer ka purana token history me chala jaata hai, gayab nahi hota.

## 6. Delete (owner apni queue) + Recently Deleted

- Console ⋮ menu me **"Delete karein"** (`--c-danger`). Dialog: "Ye queue delete karein?" · "3 din tak Business tab > Recently Deleted se wapas la sakte hain. Uske baad ye hamesha ke liye hat jayegi." · `danger-filled` "Delete karein" · `danger-text` "Abhi hamesha ke liye hatao" · `tertiary` "Nahi". Toast "Queue delete ho gayi".
- "Hamesha ke liye hatao" ka **dobara confirm**: "Hamesha ke liye hatao?" · "Ye wapas nahi aayega." · "Haan, hatao" / "Nahi".
- Business tab ke neeche **RECENTLY DELETED** section (sirf jab item ho): "Delete ki hui queue 3 din tak yahan rehti hai." Card: naam + chip "Queue", "3 din me hamesha ke liye hat jayegi", buttons "Recover" (queue **Closed** me wapas, Toast "Queue wapas aa gayi.") aur "Hamesha ke liye hatao".
- Delete = soft delete (`deleted_at`, `purge_at = +72 ghante`), hourly purge job. Delete ke baad us QR par customer ko "Ye QR abhi available nahi hai." Customer ki apni token history par asar nahi.
- Purani spec ka QR-scan recovery aur poora Recently Deleted screen (`04` O9/O10) real build me ban sakta hai; prototype me sirf Business tab section tha.


<!-- ===== Product §6.4-6.6 (00-READ-ME-FIRST.md lines 1507-1524) ===== -->

### 6.4 End day / Close
- "Din khatam" dialog: "Aaj ka kaam khatam karein? Bache hue token Expired ho jayenge." → Confirm.
- Session `ended_at` save hota hai.
- Ab QR scan karne par customer ko: **"Ye token line band hai."**
- Owner ke liye card **Closed** dikhe, jisme "Dobara shuru karein".

### 6.5 Dobara shuru (next day)
- Create tab me purana queue upar dikhega (6.2). Tap → "Dobara shuru karein".
- Naya session banta hai: number reset (0 ya start number), **QR same**. (Active subscription chahiye.)
- Pehle ke session history me safe.

### 6.6 Delete
- 3-dot ya queue settings se "Delete karein".
- Dialog: "Ye queue delete karein? **3 din tak** Settings > Recently Deleted se wapas la sakte hain. Uske baad hamesha ke liye hat jayegi."
- Buttons: **"Delete karein"** (red) · "Abhi hamesha ke liye hatao" (chhota red link, dobara confirm, "Ye wapas nahi aayega") · "Nahi".
- Delete ke baad customer QR scan kare toh "Ye QR ab valid nahi hai".
- Poori detail Section 7 me.


<!-- ===== Product §6.8 owner history (00-READ-ME-FIRST.md lines 1530-1533) ===== -->

### 6.8 Owner history
- Sessions list: **date, start time, end time**, kitne token, औसत wait.
- Tap → us din ke tokens (naam, number, kab aaya, kab call hua, done).


<!-- ===== Product §7 delete/recovery (00-READ-ME-FIRST.md lines 1541-1578) ===== -->

## 7. Delete, Recently Deleted aur Recovery

### 7.1 Kya delete ho sakta hai
Queue, queue ka session history, ya Profile se poora account data. Delete hamesha **soft delete** (`deleted_at`, `purge_at = deleted_at + 72 ghante`).

### 7.2 Settings > Recently Deleted (recover yahan se)
- Profile > Settings > **"Recently Deleted"**.
- Upar ek line: "Aakhri delete: 26 Sep, 4:10 PM".
- Har item: naam, type (Queue / History), **"Delete hua: 26 Sep, 4:10 PM"**, **"Hamesha ke liye hatega: 29 Sep, 4:10 PM (2 din 3 ghante baaki)"**.
- Buttons: **Recover** (primary) · **Hamesha ke liye hatao** (red, confirm ke saath).
- Khaali state: "Koi deleted item nahi hai."
- Recover ke baad item wapas Business tab me aa jata hai (queue **Closed** state me). Dobara chalane ke liye subscription active chahiye (14C).

### 7.3 Auto purge
- Har ghante ek job `purge_at` nikal chuke items ko **hamesha ke liye hata de**. 3 din baad recovery kisi tarah nahi.
- Purge ke baad us QR ko scan karne par "Ye QR ab valid nahi hai".

### 7.4 QR-scan recovery (bonus, wahi 3 din ke andar)
Owner apna deleted QR **same Google account** se scan kare:
1. Server check: QR ka `owner_id` == logged in user?
2. **Nahi** → normal customer flow ("valid nahi" agar deleted).
3. **Haan, kuch delete nahi hua tha** → kuch nahi hoga. Toast: *"Aap apna hi QR scan kar rahe hain."* (+ button "Queue kholein").
4. **Haan, aur 3 din ke andar delete hua tha** → data restore.
   - Ek hi cheez restore hui → toast me uska naam: *"Queue wapas aa gayi."* / *"History wapas aa gayi."*
   - Ek se zyada → *"Saara data wapas aa gaya."*
   - Phir sheet: "Isi settings se dobara shuru karein?" → **Shuru karein** / **Settings badlein**.
5. **3 din nikal chuke** → "Ye QR ab valid nahi hai" (data purge ho chuka).
6. Galat/anjaan QR → kuch nahi hoga, halka toast "Ye QR nahi mila."
7. **Alag Google account** se scan → recovery nahi.

### 7.5 Customer side
Owner ke delete/purge se customer ki apni token history par koi asar nahi.

### 7.6 Account-level
Profile me **"Mera saara data hamesha ke liye hatao"**: turant, koi 3 din ka window nahi, aur logout ho jata hai. Confirm me account ka naam type karwao.

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
