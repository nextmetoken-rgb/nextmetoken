import LegalPage from '@/components/LegalPage';
import { brand } from '@/lib/brand';
export const metadata = { title: 'Privacy' };
export default function Privacy() {
  return (
    <LegalPage title="Privacy">
      <p>{brand.companyName || brand.name} account chalane aur queue dikhane ke liye Google login se diya gaya naam aur email use karta hai. App GPS ya location nahi leta, ads nahi dikhata aur payment nahi leta.</p>
      <h2 className="t-h2">Naam aur token data</h2>
      <p>Token ke saath aapka poora display name queue owner aur us line ke sabhi logon ko dikhta hai. Token number, queue, aur token ki sthiti line chalane aur aapki history dikhane ke liye save hoti hai.</p>
      <h2 className="t-h2">Notifications aur awaaz</h2>
      <p>Push notification ki ijazat aapke browser se maangi jaati hai. Aap ise browser settings me kabhi bhi band kar sakte hain. Awaaz browser me hi chalti hai.</p>
      <h2 className="t-h2">Delete aur retention</h2>
      <p>Deleted queue 3 din tak recovery ke liye rakhi jaati hai; uske baad queue data permanently purge hota hai. Profile me account/data delete ka option hai. Account delete karne par login profile aur usse judi token pehchaan hatai jaati hai.</p>
      <h2 className="t-h2">Suraksha aur sampark</h2>
      <p>Account aur line data ko unauthorized access se bachane ke liye sign-in aur database access controls use kiye jaate hain. Sawaal ya deletion request ke liye {brand.contactEmail || brand.contactWhatsapp || 'Contact page par diye gaye contact details'} ka istemal karein. Company: {brand.companyName || brand.name}{brand.address ? `, ${brand.address}` : ''}.</p>
    </LegalPage>
  );
}
