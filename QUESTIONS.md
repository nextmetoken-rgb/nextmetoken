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
