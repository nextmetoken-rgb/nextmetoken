import { AppBar } from '@/components/AppBar';
import BusinessList from '@/components/business/BusinessList';
import { t } from '@/lib/i18n';

export default function BusinessTab() {
  return (
    <>
      <AppBar title={t('tab.business')} isRootTab testId="business.appbar" />
      <BusinessList />
    </>
  );
}
