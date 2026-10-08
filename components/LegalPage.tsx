import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import { t } from '@/lib/i18n';
import { brand } from '@/lib/brand';
export default function LegalPage({ title, children, showUpdated = true }: { title: string; children: ReactNode; showUpdated?: boolean }) {
  return (
    <div className="app-shell">
      <header className="appbar"><div className="container legal appbar-in">
        <Logo />
        <Link href="/" className="btn btn-sm btn-ghost"><ArrowLeft size={20} aria-hidden="true" />{t('nav.back')}</Link>
      </div></header>
      <main className="container legal page tight">
        <div className="stack-3">
          <h1 className="t-h1">{title}</h1>
          {showUpdated && <p className="t-caption c3">{t('legal.updated')}: {brand.legalUpdated}</p>}
        </div>
        <div className="legal-body">{children}</div>
      </main>
    </div>
  );
}
