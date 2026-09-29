import LegalPage from '@/components/LegalPage';
import { brand } from '@/lib/brand';
export const metadata = { title: 'Contact' };
export default function Contact() {
  const has = brand.contactWhatsapp || brand.contactEmail;
  return (
    <LegalPage title="Contact">
      {has ? (
        <>
          {brand.contactWhatsapp && <p>WhatsApp: {brand.contactWhatsapp}</p>}
          {brand.contactEmail && <p>Email: {brand.contactEmail}</p>}
          {brand.contactResponse && <p>{brand.contactResponse}</p>}
        </>
      ) : (<p>Contact details jaldi yahan add hongi.</p>)}
    </LegalPage>
  );
}
