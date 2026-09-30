# PART 9 of 10 — Push + Guide + Profile + iPhone

> **Ye file kaise use karni hai:** Naye Claude chat me ye file + pichle part ka zip (`tokenapp-v8.zip`) upload karo aur likho: **"Part 9 banao."** Part 1 me sirf ye file (zip nahi).

## Claude ke liye instructions (AI ko pehle ye padhna hai)

1. Sabse pehle pichle zip ka `STATE.md` padho (Part 1 me ye file naya banani hai `STATE.md.template` se). Poora code mat padho, sirf wahi files kholo jo is part ke liye zaroori hain.
2. **Sirf is PART ka kaam karo.** Aage ke parts ke features mat banao. Pehle se bani cheezein todo mat.
3. Neeche di gayi spec hi final hai. **Kuch invent mat karo.** Kuch missing ho to `QUESTIONS.md` me likho (line: screen · element · kya missing tha · kya use kiya).
4. Jahan v7 aur purani spec me conflict ho, **v7 jeetta hai.**
5. Payment, trial, subscription, Razorpay **kahin nahi banana.**
6. Code chhoti files me rakho (300 line se kam), koi hardcoded rang/px/text nahi (tokens + i18n).
7. Kaam khatam hone par: `STATE.md` update karo (kya bana, kaunsi file kahan, kya baaki, env variables ke NAAM, kaise chalana hai), phir **`tokenapp-v9.zip`** banao (`node_modules`, `.next`, `.env` **mat daalo**) aur present karo.
8. **Limit ka dhyan:** agar lage ki chat ki limit khatam hone wali hai, to current file poori karo, `STATE.md` me "IN PROGRESS: kya adhoora hai" likho, aur zip bana do. Adhoora zip bhi chalne wali state me hona chahiye (build fail nahi).
9. Naye chat me pichla zip milne par `STATE.md` ke "IN PROGRESS" se aage badho.

## Deliverable is part ka
Notifications (pre-prompt), iPhone popup, Guide (Madad), Profile, helper popups.

## Tum (user) ye test karo, phir agla part
- [ ] Android Chrome me push aata hai
- [ ] iPhone Home Screen se add karke push test
- [ ] Guide me Customer aur Owner dono tab
- [ ] Profile me Subscription/Refund row NAHI

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


<!-- ===== C12 Notif prompt + C13 iPhone + C14 Profile (00-READ-ME-FIRST.md lines 865-918) ===== -->

## C12. Notification pre-prompt (`BottomSheet`)

Sirf jab: pehla token mil chuka, permission `default`, aur (iPhone nahi ya app Home Screen se khula hai).

| Element | Content |
|---|---|
| Icon | `bell` 40 in 72px circle `--c-accent-soft` |
| Title `h2` | "Baari aane par batayein?" |
| Body `body-sm` | "Jab aapka number paas aayega, hum notification bhejenge. Phone lock ho tab bhi." |
| Primary | "Notification chalu karein" → browser permission prompt |
| Tertiary | "Abhi nahi" |

"Abhi nahi" par Profile > Settings > Notification me baad me chalu ho sakta hai. Deny hone par live screen pe chhota `Banner` `info`: "Notification band hai. Baari aane par sirf is screen par pata chalega."

---

## C13. iPhone popup (`BottomSheet`) 

**Trigger:** iPhone/iPad, browser me khula (standalone nahi), token mil gaya. Zyada se zyada **2 baar** (dusri baar agli visit par), uske baad sirf Guide me. Tips toggle OFF ho tab bhi aata hai (ye zaroori setup hai).

| Element | Content |
|---|---|
| Icon | `share` 40 in 72px circle `--c-accent-soft` |
| Title `h2` | "iPhone me notification ke liye 1 minute ka setup" |
| Body `body-sm` | "iPhone me notification tabhi aate hain jab ye website Home Screen par add ho." |
| Steps (numbered, 3, `body-sm`) | 1. "Neeche Share (⬆︎) dabayein" 2. "Add to Home Screen chunein" 3. "Home Screen ke icon se kholein" |
| Primary | "Poore steps dekhein" → `/app/guide#iphone` |
| Tertiary | "Baad me" |

---

## C14. Profile — `/app/profile` (tab)

Root AppBar "Profile". Content padding 20, sections gap 24.

| id | Element | Spec |
|---|---|---|
| `profile.card` | `Card` padding 20 | Naam `h2`; email `body-sm` `--c-text-2`; `Button tertiary sm` "Naam badlein" (sheet: TextField + primary "Save karein") |
| section label | `overline` `--c-text-2`, margin-bottom 8 | |
| Groups | `Card` padding 0 with `SettingsRow`s | |

**Groups & rows (exact):**
- **MADAD:** "Guide (Madad)" `circle-help` → `/app/guide` · `ToggleRow` "Madad ke tips" `info`
- **SETTINGS:** "Language" (value "Hinglish"/"English") → sheet with `SegmentedControl` [Hinglish | English] · "Notification" (value "Chalu"/"Band") → permission flow (iPhone pe C13) · "Awaaz" (value "Chalu"/"Band") → C6 · "Recently Deleted" `rotate-ccw` → `/app/profile/recently-deleted` · "Subscription" `store` (value: "Trial: 1 din baaki" / "Chalu" / "Nahi") → `/app/profile/subscription`
- **SUPPORT:** "Madad chahiye?" (WhatsApp/email link) · "Feedback bhejein" (sheet: multiline TextField + "Bhejein") · "Terms" · "Privacy Policy" · "Refund/Cancellation"
- **ACCOUNT:** "Logout" `log-out` (`--c-danger`) · "Account delete karein" (`--c-danger`) · "Mera saara data hamesha ke liye hatao" (`--c-danger`)
- Footer `caption` `--c-text-3`... (use `--c-text-2` on bg) center "Version 1.0.0".

**Dialogs:**
- Logout: title "Logout karein?", body "Aap dobara Google se login kar sakte hain. Aapka data safe rahega.", `danger-filled` "Logout", `tertiary` "Nahi".
- Data/Account delete: `Dialog` with `TextField` label "Confirm karne ke liye apna naam likhein"; body "Ye turant aur hamesha ke liye hatega. Recovery nahi hogi."; `danger-filled` (disabled jab tak naam match na ho) "Hamesha ke liye hatao" / "Account delete karein"; `tertiary` "Nahi".

---


<!-- ===== C15 Guide cards (00-READ-ME-FIRST.md lines 919-963) ===== -->

## C15. Guide — `/app/guide`

| id | Element | Spec |
|---|---|---|
| `guide.appbar` | AppBar back, title "Guide (Madad)" |
| `guide.iphone-card` | **Sirf iPhone/iPad pe**, sabse upar | `Card` bg `--c-accent-soft`, border 1px `--c-accent-soft-border`, padding 16, icon `bell` 20 accent, title `body-strong` "iPhone me notification kaise chalu karein", chevron; tap → iPhone card (neeche) khule/scroll |
| `guide.search` | Search field | H 48, R12, border 1.5px, icon `search` 20 left, placeholder "Kuch dhundhein…" |
| `guide.tabs` | `SegmentedControl` [Customer \| Owner] | margin-top 16 |
| `guide.list` | `GuideCard`s, gap 12 | |

Guide offline cached. Search: title + content pe filter (debounce 150ms). Koi result nahi: EmptyState "Kuch nahi mila" body "Dusre shabd se dhundhein."

### Customer guide cards (exact content)

| Card title | Ye kya hai | Kaise karein | Dhyan rakhein |
|---|---|---|---|
| QR scan karna | Dukaan ke QR se line me judne ka tarika. | 1) Scan tab kholein ya phone ka camera use karein 2) QR ko frame me rakhein 3) "Token lein" dabayein | QR sirf dukaan/counter pe scan karna hai. Kisi ka bheja hua QR nahi chalta. |
| Token lena | Line me aapka number. | 1) QR scan karein 2) Naam check karein 3) "Token lein" | Ek queue me ek hi active token milta hai. |
| Live screen kaise padhein | Aapki line ka live haal. | Upar bada number = abhi chal raha number. Neeche "Aapka token" = aapka number. | Number apne aap badalta hai, refresh nahi karna. |
| "Andaza" ka matlab | Aapke number ke aane ka anumaan. | Ye pichhle logon ke time se nikala jata hai. | Ye 100% sahi nahi hota, thoda upar-neeche ho sakta hai. |
| Awaaz on/off | Number bolke batane wali awaaz. | Live screen par "Awaaz se batao" chalu karein. | Awaaz tabhi aati hai jab screen chalu ho. Phone off ya lock karne par awaaz nahi aayegi, tab sirf notification milega. |
| Notification | Baari aane par phone par alert. | Token lene ke baad "Notification chalu karein" dabayein. | iPhone me pehle Home Screen par add karna padta hai (neeche iPhone card dekhein). |
| Line chhodna | Token wapas dena. | Live screen par "Line chhodein" > "Haan, chhodein" | Chhodne ke baad number wapas nahi milta. |
| Line ke log | Line me kaun-kaun hai. | Live screen par "Line ke log dekhein" | Sabke poore naam dikhte hain. |
| Naam badalna | Ek line me alag naam rakhna. | Token lete waqt "Badlein" dabayein. Default naam Profile me badlein. | Ye naam is line ke sabhi log dekhte hain. |
| Multiple dukaan | Ek saath kai line me token. | Har dukaan ka QR scan karein. "Mere Tokens" me sab dikhenge. | Ek dukaan me sirf ek token. |
| Saath me doosre log | Group ya family ke liye. | Counter par owner ko naam batayein, wo aapke liye bhi number de dega. | Aap khud ek se zyada token nahi le sakte. |
| History | Purane tokens. | Mere Tokens > Purane | Token poora hone ke 10 min baad history me jata hai. |
| Madad ke tips | Chhote helper popups. | Scan screen ke "?" ya Profile me Madad ke tips ON/OFF | Band karne par bhi Guide hamesha khuli rahegi. |

### iPhone card (exact steps)

Title: **"iPhone me notification kaise chalu karein"**
- **Kyun:** "iPhone me notification tabhi aate hain jab website Home Screen par add ho. iOS 16.4 ya naya chahiye."
- Steps (numbered, har step ke saath chhota annotated screenshot/arrow):
  1. "**Safari** me website kholein."
  2. "Neeche **Share** (⬆︎) dabayein."
  3. "**Add to Home Screen** chunein, phir **Add** dabayein."
  4. "Ab **Home Screen ke icon se** kholein (Safari se nahi). Yahan ek baar phir Google se login karna padega. Aapka token wahi milega, kuch nahi jayega."
  5. "Profile > Settings > **Notification chalu karein** dabayein, aur aane wale sawal me **Allow** chunein."
- **Notification na aaye toh:** "iPhone Settings > Notifications > is app ko Allow karein · Silent ya Focus mode check karein · Low Power Mode band karke dekhein."
- **Android:** "Chrome me 'Install' ya 'Add to Home screen' dabayein."

---


<!-- ===== Owner guide cards (00-READ-ME-FIRST.md lines 1271-1291) ===== -->

## Owner Guide cards (Guide me "Owner" tab, exact content)

| Card title | Ye kya hai | Kaise karein | Dhyan rakhein |
|---|---|---|---|
| Queue banana | Aapki dukaan ki line. | Business tab > Nayi queue banayein > naam, limit, time > "Queue banayein" | 2 din free trial ke baad subscription chahiye. |
| Token limit | Kitne token tak dena hai. | Step 2 me "Koi limit nahi" band karke number likhein. | Limit poori hone par naye customer ko token nahi milega. |
| "Ek token me kitna time" | Andaza nikalne ke liye. | "Automatic" chunein ya minutes khud likhein. | Ye sirf andaza hai. Number khud nahi badalta. |
| QR print karna | Counter par lagane wala QR. | QR screen > "Print karein / PDF" | QR sirf counter par lagayein. Share ka option nahi hai. |
| Agla / Pichla / Undo | Number aage-peeche karna. | Console me "Agla" dabayein. Galti ho toh 5 second me "Undo". | "Pichla" sirf galti sudharne ke liye hai. |
| Walk-in add karna | Jinke paas phone nahi. | Console > "Walk-in add karein" > naam likhein > "Number dein" | Zyada log saath aaye toh sabke liye yahi karein. |
| Kisi ko hatana | Spam ya no-show hatana. | List me row ko left swipe karein (ya ⋮ > Hatao). | Hatate hi agla number turant aage aata hai. Undo 5 second me. |
| Line rok dena | Thodi der ke liye line pause. | Console > ⋮ > "Line rok dein" | Customer ko "Line ruki hai" dikhta hai. |
| Din khatam | Aaj ka kaam band. | Console > ⋮ > "Din khatam (End day)" | Customer scan karenge toh "Ye line band hai" dikhega. |
| Agle din dobara shuru | Wahi QR, naya number. | Business tab > Purani queue > "Dobara shuru karein" | Number 1 se shuru hota hai, purani history safe rehti hai. |
| Delete aur Recovery | Queue hatana aur wapas lana. | Delete karein. Wapas laane ke liye Profile > Recently Deleted > Recover. Ya apna QR scan karein. | 3 din ke andar hi wapas aata hai, uske baad hamesha ke liye hat jata hai. |
| Awaaz announcement | Number bolke batana. | Console me "Awaaz announcement" chalu karein. | Awaaz tabhi aati hai jab screen chalu ho. Phone off ya lock karne par awaaz nahi aayegi. |
| History | Purane din ka record. | Console > ⋮ > History | Har din ka start aur end time dikhta hai. |
| Trial aur Subscription | 2 din free, phir ₹3.57 per din. | Profile > Subscription | ₹100 har 28 din me ek baar charge hota hai. Kabhi bhi band kar sakte hain. |




<!-- ===== Product §8 helper popups (00-READ-ME-FIRST.md lines 1579-1588) ===== -->

## 8. Helper popups (tips) aur helper toast

- **Helper toast/pop-up:** jab bhi koi khaas cheez hoti hai (recovery, apna QR scan, wrong QR, withdraw, remove, pause), neeche halka toast **kya hua, saaf line me** likhe.
- **Coach-mark popups:** naye user ko har screen par ek baar chhota tooltip ("Yahan se number aage badhao"). Ek baar dekhne ke baad dobara nahi.
- Har screen ke corner me **"?"** icon jo us screen ki 2–3 line madad khole.
- **Toggle "Madad ke tips": Scan (home) screen ke top-right me hi**, aur Profile me bhi. OFF karne par coach-marks aur auto-popups band; "?" icon fir bhi kaam kare. Default: **ON**. Setting account me save ho.
- Owner aur customer dono ke liye.

---


<!-- ===== Product §11 notifications (00-READ-ME-FIRST.md lines 1610-1631) ===== -->

## 11. Notifications aur Awaaz (web)

| Kab | Message |
|---|---|
| 3 log pehle | "3 log baaki hain, taiyaar rahiye" |
| Agla aap | "Aap agle hain: {business}" |
| Aapki baari | "Aapki baari hai! Token {n}" (high priority, sound) |
| Owner ne hataya | "Owner ne aapko {business} ki line se hata diya" |
| Queue paused | "{business} ki line ruki hai" |
| Session closed | "{business} ki line band ho gayi" |

- **Web Push (VAPID + service worker).** Permission tab maango jab pehla token mil chuka ho, ek line ke saath: "Baari aane par batayein?" Site khulte hi mat maango.
- **iOS:** Home Screen add karne ke baad hi push. Guide (5.9 step 4).
- **Fallback jab push na chale:** page khula ho toh sound + vibration + page title blink ("🔔 Aapki baari"), aur "Notification off hai" ek chhota banner.
- **Awaaz:** browser TTS (`speechSynthesis`), Hindi/English. Owner: "Token number 13". User: sirf jab unhone Awaaz ON kiya ho ("Aapki baari hai" / "Ab token 13 chal raha hai").
- **Awaaz toggle ON karte hi turant test awaaz bajao** ("Awaaz chalu ho gayi"). Ye browser ka audio bhi unlock karta hai. Na sunai de toh tip: "Volume aur silent mode check karein."
- **Phone off / lock warning (owner aur user dono):** "Awaaz tabhi aayegi jab ye screen chalu ho. Phone off ya lock karne par announcement ON hone ke baad bhi awaaz nahi aayegi." Toggle ke neeche hamesha dikhe.
- Phone lock hone par user ko sirf **push notification (sound ke saath)** milega. Owner ke liye Wake Lock screen on rakhta hai, par owner khud lock kare toh awaaz band.
- Volume aur silent mode respect karo.

---


<!-- ===== Product §14D Guide + iPhone (00-READ-ME-FIRST.md lines 1695-1725) ===== -->

## 14D. Guide (Madad) aur iPhone popup

**Guide kahan milti hai**
- Har main screen ke 3-dot menu me **"Guide (Madad)"**, Profile me bhi, aur Scan screen ke "?" se.
- Do hisse: **Customer ke liye** aur **Owner ke liye**. iPhone/iPad detect ho toh sabse upar pinned card **"iPhone me notification kaise chalu karein"**.
- Search box. Hindi/English (language setting ke hisaab se). Service worker se **offline cached**.

**Har option ke liye ek chhota card**, isi format me: *Ye kya hai · Kab use karein · Kaise karein (steps) · Dhyan rakhein*. Seedhi bhasha, koi jargon nahi. Zaroorat ho toh chhota screenshot/arrow.

**Customer guide me kya-kya:** QR scan, token lena, live screen kaise padhein, "andaza" ka matlab, Awaaz on/off (aur phone lock hone par awaaz nahi aayegi), notification, line chhodna, line ke log ki list, apna naam badalna, history, multiple shops ke tokens, ek account ek queue me ek token (zyada log ho toh counter par naam likhwayein), tips ON/OFF.

**Owner guide me kya-kya:** queue banana (limit, timing/andaza, start number), QR print karna, Agla/Pichla/Undo, Walk-in add, Hatao, Pause, Din khatam, dobara shuru (reset), delete + Recently Deleted + recover (3 din), owner history, awaaz announcement (aur screen lock par band), free trial + subscription.

**iPhone section (steps, screenshots ke saath)**
- Kyun: "iPhone me notification tabhi aata hai jab website Home Screen pe add ho." (iOS 16.4 ya naya chahiye.)
1. **Safari** me website kholo.
2. Neeche **Share** (⬆︎) dabao.
3. **"Add to Home Screen"** chuno, phir **Add**.
4. Ab **Home Screen ke icon se** kholo (Safari se nahi). **Yahan ek baar phir Google se login karna padega** (iPhone me Safari aur Home Screen app alag hote hain). Aapka token wahi milega, kuch nahi jayega.
5. Profile > Notifications > **"Notification chalu karein"** dabao, aane wale sawal me **Allow** chuno.
- **Notification na aaye toh:** iPhone Settings > Notifications > is app ko Allow · Silent/Focus mode check · Low Power Mode band karke dekho.
- Android ke chhote steps bhi (install prompt / Chrome menu > Add to Home screen).

**iPhone popup (apne aap)**
- Trigger: iPhone/iPad, browser me khula (Home Screen se nahi), aur user ne token le liya.
- Bottom sheet: "iPhone me notification ke liye 1 minute ka setup" · **Steps dekhein** (seedha iPhone section) · **Baad me**.
- "Baad me" par agli visit me ek baar phir, maximum 2 baar. Uske baad popup nahi, sirf Guide me.
- Tips toggle OFF hone par bhi ye popup ek baar aana chahiye (ye zaroori setup hai, tip nahi).

---


<!-- ===== Product §20 iPhone testing (00-READ-ME-FIRST.md lines 1852-1883) ===== -->

## 20. iPhone (PWA) testing plan

Ye sab **asli iPhone** pe karo. Simulator/emulator pe web push test nahi hota.

**Devices:** kam se kam 1 real iPhone (iOS 16.4+). Ho sake toh iOS 16.4 aur latest dono. Backup: BrowserStack/LambdaTest real-device.

**Setup:** HTTPS domain (staging bhi), localhost/http pe push nahi chalta.

**iPhone ke known quirks (design me pehle se dhyan rakho):**
1. **Push sirf Home Screen se khule app me** chalta hai, aur permission user ke tap par hi maango.
2. **Safari aur Home Screen app ka storage/login alag hota hai.** Safari me login kiya toh Home Screen app me dobara Google login karna padega. Token account me saved hai, isliye wahi milega. Ye Guide me likha hai (14D).
3. **QR camera se scan karne par link hamesha Safari me khulta hai**, Home Screen app me nahi. Isliye Home Screen app ke andar bhi **Scan tab** (in-page camera) hona zaroori hai, aur token ka live screen dono jagah chale.
4. Notification par tap karne se Home Screen app khulna chahiye.
5. Audio unlock (test awaaz) aur Wake Lock dono iPhone par alag se test karo.

**Test matrix (push aata hai ya nahi):**
| App state | Expected |
|---|---|
| Home Screen app khula (foreground) | In-app sound + banner |
| Background | Push notification (sound ke saath) |
| Phone lock | Push notification |
| App band (swipe kiya) | Push notification |
| Silent mode / Focus | Notification aaye, awaaz system rules ke hisaab se |
| Low Power Mode | Notification aaye (thoda late ho sakta hai) |
| Permission deny kiya | Guide ka "notification na aaye toh" hissa dikhe, in-app fallback chale |

**Guide test:** kisi non-technical insaan ko sirf Guide dikha ke bolo iPhone pe setup karwao. Jahan atke wahan Guide ka text/screenshot theek karo.

**Popup test:** iPhone Safari me token lo → popup aaye, "Baad me" → agli visit me ek baar phir, max 2 baar; Home Screen app me popup na aaye.

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
