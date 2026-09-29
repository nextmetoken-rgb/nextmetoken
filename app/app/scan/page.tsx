import { AppBar } from '@/components/AppBar';
import { t } from '@/lib/i18n';

export default function ScanTab() {
  return (
    <>
      <AppBar title={t('tab.scan')} isRootTab testId="scan.appbar" />
      <main className="container page tight" data-testid="scan" />
    </>
  );
}
