import LegalPage from '@/components/LegalPage';
export const metadata = { title: 'Privacy Policy' };
const sections = [
['1. Hum kaun si jaankari lete hain','- Google login se: aapka naam aur email, taaki aapka account chal sake.\n- Token lete waqt: aapka diya hua display name, token number, kis queue me hai, aur token ki sthiti (jaise waiting, serving, done).\n- Queue owner ke liye: queue ka naam, business ka naam, counter ki settings aur token limit.\n- Login session: aapko login rakhne ke liye browser me cookies ya local storage.\n- Tekniki jaankari: app me aayi galtiyon (errors) ki jaankari, taaki hum unhe theek kar sakein.'],
['2. Jo hum nahi lete','App aapki GPS ya location nahi leta, ads nahi dikhata, aur payment nahi leta. Hum aapki jaankari kisi ko bechte nahi.'],
['3. Hum jaankari ka istemal kaise karte hain','- Account chalane aur aapko login rakhne ke liye.\n- Queue chalane, aapka token dikhane aur aapki token history dikhane ke liye.\n- Seva ko surakshit rakhne aur galtiyan theek karne ke liye.'],
['4. Aapka naam kisko dikhta hai','Token ke saath aapka display name us queue ke owner ko aur us line ke doosre logon ko dikh sakta hai. Isliye chahein to token lete waqt apna pehla naam ya chhota naam likhein, aur kisi aur ki private jaankari na likhein.'],
['5. Awaaz','Awaaz sirf aapke browser me chalti hai.'],
['6. Teesri party ki sevayein','Seva chalane ke liye hum teesri party ki sevaon (jaise Google login, database aur hosting, error monitoring) ka istemal karte hain. Inko woh jaankari milti hai jo seva chalane ke liye zaroori hai. Unki apni privacy policy bhi lagu hoti hai.'],
['7. Account delete karna','Aap Profile me jaakar apna account delete kar sakte hain. Account delete hone par aap log out ho jaate hain. Yeh action wapas nahi hota.'],
['8. Suraksha','Account aur line ki jaankari ko bina ijazat access se bachane ke liye sign-in aur database access controls ka istemal kiya jaata hai. Koi bhi online system poori tarah surakshit hone ki guarantee nahi de sakta, lekin hum jaankari ko surakshit rakhne ki koshish karte hain.'],
['9. Bachche','Seva bachchon ke liye alag se nahi banayi gayi hai. 18 saal se kam umar ke log sirf apne mata-pita ya guardian ki dekh-rekh me hi Seva ka istemal karein.'],
['10. Is Policy me badlaav','Hum samay-samay par is Policy ko badal sakte hain. Badlaav is page par naye "Aakhri update" ki taareekh ke saath dikhega.'],
['11. Sampark','Sawal, shikayat, ya account se judi kisi bhi madad ke liye humein email karein:\n\nnextmetokensupport@gmail.com'],
];
export default function Privacy() { return <LegalPage title="Privacy Policy" showUpdated={false}><p><b>Token App</b><br/>Aakhri update: 4 October 2026</p><p className="t-body-sm">Yeh Privacy Policy batati hai ki Token App ("hum") aapki jaankari kya leta hai, kaise istemal karta hai aur kaise surakshit rakhta hai. Seva ka istemal karke aap isse sehmat hote hain.</p>{sections.map(([title,body])=><section className="legal-section" key={title}><h2 className="t-h3">{title}</h2>{body.split('\n\n').map((p,i)=><p key={i} className="t-body-sm">{p}</p>)}</section>)}</LegalPage>; }
