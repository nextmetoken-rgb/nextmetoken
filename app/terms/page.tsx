import LegalPage from '@/components/LegalPage';
export const metadata = { title: 'Terms' };
export default function Terms() {
  return (
    <LegalPage title="Terms">
      <p>Ye app abhi free hai. Queue banane wale (owner) apni queue aur token ke liye khud zimmedar hain.</p>
      <h2 className="t-h2">Account</h2>
      <p>Login Google account se hota hai. Ek account ek queue me ek active token le sakta hai.</p>
      <h2 className="t-h2">Naam</h2>
      <p>Token lete waqt aapka poora naam queue ke owner aur line ke logon ko dikhta hai.</p>
      <h2 className="t-h2">Delete aur recovery</h2>
      <p>Delete ki hui queue 3 din tak Recently Deleted me rehti hai. Uske baad hamesha ke liye hat jaati hai.</p>
    </LegalPage>
  );
}
