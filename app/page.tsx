import Link from 'next/link';
import { Store, Stethoscope, Wrench, Building2, Check } from 'lucide-react';
import Logo from '@/components/Logo';
import ButtonLink from '@/components/Button';
import TicketCard from '@/components/TicketCard';
import GuideCard from '@/components/GuideCard';
import { t, type Key } from '@/lib/i18n';
import { brand } from '@/lib/brand';

const steps = [1, 2, 3] as const;
const who = [[Store, 'who.1'], [Stethoscope, 'who.2'], [Wrench, 'who.3'], [Building2, 'who.4']] as const;
const faq = [1, 2, 3, 4] as const;
const free = ['free.1', 'free.2', 'free.3'] as const;

export default function Home() {
  return (
    <div className="app-shell">
      <header className="appbar"><div className="container home appbar-in">
        <Logo />
        <ButtonLink href="/login" size="sm" testId="home.login">{t('nav.login')}</ButtonLink>
      </div></header>
      <main className="container home page">
        <section className="stack-6" data-testid="home.hero">
          <div className="stack-4">
            <h1 className="t-h1">{t('hero.title')}</h1>
            <p className="t-body c2">{t('hero.body')}</p>
            <ButtonLink href="/login" wrap testId="home.cta">{t('hero.cta')}</ButtonLink>
            <p className="t-caption c3">{t('hero.note')}</p>
          </div>
          <TicketCard current={12} mine={19} testId="home.ticket" />
        </section>

        <section className="stack-4" data-testid="home.how">
          <h2 className="t-h2">{t('how.title')}</h2>
          <div className="stack-4">
            {steps.map(n => (
              <div className="row" key={n}>
                <span className="num" aria-hidden="true">{n}</span>
                <div>
                  <h3 className="t-h3">{t(`how.${n}.t` as Key)}</h3>
                  <p className="t-body-sm c2">{t(`how.${n}.d` as Key)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="stack-4" data-testid="home.who">
          <h2 className="t-h2">{t('who.title')}</h2>
          <div className="stack-3">
            {who.map(([Icon, k]) => (
              <div className="row mid" key={k}>
                <span className="ico"><Icon size={20} strokeWidth={2} aria-hidden="true" /></span>
                <span className="t-label">{t(k)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="stack-4" data-testid="home.free">
          <h2 className="t-h2">{t('free.title')}</h2>
          <div className="card big stack-4">
            <p className="t-display-l free-big">{t('free.big')}</p>
            <ul className="bullets t-body-sm">
              {free.map(k => (<li key={k}><Check size={16} strokeWidth={2} aria-hidden="true" />{t(k)}</li>))}
            </ul>
          </div>
        </section>

        <section className="stack-4" data-testid="home.faq">
          <h2 className="t-h2">{t('faq.title')}</h2>
          <div className="stack-3">
            {faq.map(n => (<GuideCard key={n} q={t(`faq.${n}.q` as Key)} a={t(`faq.${n}.a` as Key)} />))}
          </div>
        </section>

        <section data-testid="home.finalcta">
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
