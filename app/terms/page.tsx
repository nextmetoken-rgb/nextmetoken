import LegalPage from '@/components/LegalPage';
import { brand } from '@/lib/brand';
export const metadata = { title: 'Terms' };
export default function Terms() {
  return (
    <LegalPage title="Terms">
      <p>{brand.companyName || brand.name} is samay muft seva hai. Isme payment, trial, subscription, vigyapan ya GPS tracking nahi hai.</p>
      <h2 className="t-h2">Account aur queue</h2>
      <p>Google login se account chalta hai. Queue owner apne queue ke naam, token limit aur counter ki settings ke liye zimmedar hai. Galat naam ya kisi aur ki pehchaan ka galat istemal mana hai.</p>
      <h2 className="t-h2">Naam aur line</h2>
      <p>Token lene par aapka poora naam us line ke owner aur line ke sabhi logon ko dikh sakta hai. Token lene se pehle naam sahi likhein aur kisi aur ki private jankari share na karein.</p>
      <h2 className="t-h2">Bachchon ki suraksha</h2>
      <p>Yeh seva bachchon ke liye alag se banayi ya monitor nahi ki jaati. Parent ya guardian ki dekh-rekh me hi istemal karein. Harassment, spam, jhoothe naam, ya seva ko nuksan pahunchane ki koshish mana hai.</p>
      <h2 className="t-h2">Delete aur recovery</h2>
      <p>Queue delete hone ke baad 3 din tak Recently Deleted se wapas aa sakti hai. Iske baad queue hamesha ke liye delete hoti hai. Profile se account/data delete karne ki request bhi de sakte hain; account hatne par us account se judi jankari delete hoti hai.</p>
      <h2 className="t-h2">Seva ki seema</h2>
      <p>Seva bina kisi nishchit uptime, queue timing, notification delivery, ya token call ki guarantee ke di jaati hai. Kanoon jitni anumati deta hai, us had tak seva rukne, data der se update hone, ya notification na pahunchne se hone wale seedhe ya paroksh nuksan ki zimmedari seemit hai. Aapke kanooni adhikar isse kam nahi hote.</p>
      <h2 className="t-h2">Seva dene wale ki jankari</h2>
      <p>{brand.companyName || 'Company ka naam abhi joda nahi gaya hai.'}{brand.address ? ` · ${brand.address}` : ' · Pata abhi joda nahi gaya hai.'}</p>
    </LegalPage>
  );
}
