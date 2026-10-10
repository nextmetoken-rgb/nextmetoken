import Link from 'next/link';
import { Store, Stethoscope, Wrench, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';
import ButtonLink from '@/components/Button';
import GuideCard from '@/components/GuideCard';
import { DemoTicket } from '@/components/home/DemoTicket';
import { BookLookup } from '@/components/home/BookLookup';
import { HomeLanguagePicker } from '@/components/home/HomeLanguagePicker';
import { GuideAccordions } from '@/components/home/GuideAccordions';
import { t, type Key } from '@/lib/i18n';
import { brand } from '@/lib/brand';
import { InstallButton } from '@/components/InstallButton';

const faq = [5, 1, 2, 3, 4] as const;
const who = [[Store, 'Salon'], [Stethoscope, 'Clinic'], [Wrench, 'Repair shop'], [Sparkles, 'Aur kai jagah']] as const;

export default function Home() {
  return (
    <div className="app-shell">
      <header className="appbar"><div className="container home appbar-in">
        <Logo />
      </div></header>
      <main className="container home page">
        <section className="stack-6" data-testid="home.hero">
          <div className="stack-4">
            <h1 className="t-h1">{t('hero.title')}</h1>
            <p className="t-body c2">Customer ke liye QR token banayein, aur QR scan karke apna token number lein.</p>
            <ButtonLink href="/login" wrap testId="home.cta">{t('hero.cta')}</ButtonLink>
            <p className="t-caption c3">Google se login karein.</p>
          </div>
          <HomeLanguagePicker />
          <DemoTicket />
          <div className="home-demo-warning" role="note"><strong>DEMO TICKET · YE ASLI TOKEN NAHI HAI</strong><span>Sahi token number paane ke liye login karein aur business ka QR scan karein.</span></div>
        </section>

        <section data-testid="home.book"><BookLookup /></section>

        <section className="stack-4" data-testid="home.how">
          <h2 className="t-h2">Shuru kaise karein</h2>
          <GuideAccordions />
        </section>


        <section className="stack-4" data-testid="home.who">
          <h2 className="t-h2">{t('who.title')}</h2>
          <div className="home-use-cases">
            {who.map(([Icon, k]) => (
              <div className="home-use-case" key={k}>
                <span className="ico"><Icon size={20} strokeWidth={2} aria-hidden="true" /></span>
                <span className="t-label">{k}</span>
              </div>
            ))}
          </div>
          <p className="t-body-sm c2">Line ka jhanjhat? Wahan Next Me Token.</p>
        </section>

        <section className="stack-4" data-testid="home.faq">
          <h2 className="t-h2">{t('faq.title')}</h2>
          <div className="stack-3">
            {faq.map(n => (<GuideCard key={n} q={t(`faq.${n}.q` as Key)} a={t(`faq.${n}.a` as Key)} />))}
          </div>
        </section>

        <section data-testid="home.finalcta">
          <div className="home-install"><InstallButton /></div>
          <ButtonLink href="/login" wrap>{t('cta.final')}</ButtonLink>
        </section>

        <footer className="foot" data-testid="home.footer">
          <nav className="t-body-sm">
            <Link href="/terms">{t('footer.terms')}</Link>
            <Link href="/privacy">{t('footer.privacy')}</Link>
            <Link href="/contact">{t('footer.contact')}</Link>
          </nav>
          <p className="t-caption c3">© {new Date().getFullYear()} {brand.name}</p>
        </footer>
      </main>
    </div>
  );
}
