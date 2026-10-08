'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ticket, Languages } from 'lucide-react';
import Button from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Banner } from '@/components/Banner';
import { Toast } from '@/components/Toast';
import GoogleG from './GoogleG';
import { createClient } from '@/lib/supabase/client';
import { useOnline } from '@/lib/useOnline';
import { t } from '@/lib/i18n';
import { SegmentedControl } from '@/components/SegmentedControl';

export default function LoginView({ next, hasError }: { next: string; hasError: boolean }) {
  const router = useRouter();
  const online = useOnline();
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(hasError);
  const [language,setLanguage]=useState<'hi-Latn'|'en'|'hi-Deva'>('hi-Latn');
  const [languageOpen,setLanguageOpen]=useState(false);
  useEffect(()=>{const saved=localStorage.getItem('tokenapp-language');if(saved==='en'||saved==='hi-Deva'||saved==='hi-Latn')setLanguage(saved as typeof language)},[]);
  const chooseLanguage=(value:string)=>{const locale=value as typeof language;setLanguage(locale);localStorage.setItem('tokenapp-language',locale);document.cookie=`tokenapp-language=${locale}; path=/; max-age=31536000; samesite=lax`;document.documentElement.lang=locale==='hi-Deva'?'hi':locale;setLanguageOpen(false)};
  const dismiss = useCallback(() => setShowError(false), []);

  const signIn = async () => {
    setLoading(true);
    setShowError(false);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) { setLoading(false); setShowError(true); }
  };

  const goBack = () => (window.history.length > 1 ? router.back() : router.push('/'));

  return (
    <>
      {!online && <div style={{ position: 'sticky', top: 0, zIndex: 'var(--z-banner)' }}><Banner variant="offline" testId="login.offline" /></div>}
      <main className="container login-page" data-testid="login">
        <div className="login-back"><IconButton icon={<ArrowLeft size={24} />} aria-label={t('nav.back')} onClick={goBack} testId="login.back" /></div>
        <button type="button" className="login-language" onClick={()=>setLanguageOpen(v=>!v)}><Languages size={18}/>{language==='hi-Latn'?'Hinglish':language==='en'?'English':'हिन्दी'}</button>
        <div className="login-logo" data-testid="login.logo"><Ticket size={28} strokeWidth={2} aria-hidden="true" /></div>
        <h1 className="t-h1" style={{ marginTop: 'var(--sp-6)' }} data-testid="login.title">{t('login.title')}</h1>
        <p className="t-body c2" style={{ marginTop: 'var(--sp-2)' }} data-testid="login.sub">{t('login.sub')}</p>
        <div style={{ marginTop: 'var(--sp-8)' }}>
          <Button
            variant="tertiary" size="md" fullWidth loading={loading} disabled={!online} onClick={signIn}
            icon={<GoogleG />} testId="login.google"
            style={online ? { backgroundColor: 'var(--c-surface)', border: '1.5px solid var(--c-border-strong)', color: 'var(--c-text)' } : undefined}
          >{t('login.google')}</Button>
        </div>
        <p className="t-caption c2" style={{ marginTop: 'var(--sp-4)', textAlign: 'center' }} data-testid="login.note">{t('login.note')}</p>
        <p className="t-caption c2 login-legal" data-testid="login.legal">
          {t('login.legal.pre')}<Link className="link-u" href="/terms">Terms</Link>{t('login.legal.mid')}<Link className="link-u" href="/privacy">{t('footer.privacyFull')}</Link>{t('login.legal.post')}
        </p>
      </main>
      {languageOpen&&<div className="login-language-picker"><SegmentedControl options={[{value:'hi-Latn',label:'Hinglish'},{value:'en',label:'English'},{value:'hi-Deva',label:'हिन्दी'}]} value={language} onChange={chooseLanguage}/></div>}
      {showError && <Toast type="error" message={t('login.error')} hasBottomNav={false} onDismiss={dismiss} testId="login.toast" />}
    </>
  );
}
