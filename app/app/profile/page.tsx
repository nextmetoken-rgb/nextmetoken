import { AppBar } from '@/components/AppBar';
import LogoutButton from '@/components/shell/LogoutButton';
import { t } from '@/lib/i18n';

export default function ProfileTab() {
  return (
    <>
      <AppBar title={t('tab.profile')} isRootTab testId="profile.appbar" />
      <main className="container page tight" data-testid="profile"><LogoutButton /></main>
    </>
  );
}
