import Logo from '@/components/Logo';
import ButtonLink from '@/components/Button';
import { t } from '@/lib/i18n';
export default function NotFound() {
  return (
    <div className="app-shell">
      <header className="appbar"><div className="container appbar-in"><Logo /></div></header>
      <main className="container center-page" data-testid="err.404">
        <h1 className="t-h1">{t('err.title')}</h1>
        <p className="t-body c2">{t('err.body')}</p>
        <ButtonLink href="/" wrap>{t('err.cta')}</ButtonLink>
      </main>
    </div>
  );
}
