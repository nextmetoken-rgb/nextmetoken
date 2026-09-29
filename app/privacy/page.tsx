import LegalPage from '@/components/LegalPage';
export const metadata = { title: 'Privacy' };
export default function Privacy() {
  return (
    <LegalPage title="Privacy">
      <p>Hum Google login se aapka naam aur email lete hain. Location kabhi nahi li jaati.</p>
      <h2 className="t-h2">Kya dikhta hai</h2>
      <p>Token lene par aapka poora naam owner aur line ke logon ko dikhta hai.</p>
      <h2 className="t-h2">Notification</h2>
      <p>Notification tabhi maangi jaati hai jab aap use ON karte hain.</p>
      <h2 className="t-h2">Delete</h2>
      <p>Delete ki hui queue 3 din baad hamesha ke liye hat jaati hai.</p>
    </LegalPage>
  );
}
