import { AppBar } from '@/components/AppBar';
import { t } from '@/lib/i18n';

export default function TokensTab() {
  return (
    <>
      <AppBar title={t('tab.tokens')} isRootTab testId="tokens.appbar" />
      <main className="container page tight" data-testid="tokens" />
    </>
  );
}
