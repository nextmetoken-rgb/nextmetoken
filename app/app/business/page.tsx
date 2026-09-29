import { AppBar } from '@/components/AppBar';
import { t } from '@/lib/i18n';

export default function BusinessTab() {
  return (
    <>
      <AppBar title={t('tab.business')} isRootTab testId="business.appbar" />
      <main className="container page tight" data-testid="business" />
    </>
  );
}
