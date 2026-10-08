'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, CircleHelp, FileText, Languages, LogOut, Shield, Trash2, Volume2, Moon } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { BottomSheet } from '@/components/BottomSheet';
import { Card, SettingsRow } from '@/components/Cards';
import { Dialog } from '@/components/Dialog';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TextField } from '@/components/TextField';
import { ToggleRow } from '@/components/Toggle';
import { createClient } from '@/lib/supabase/client';
import { InstallButton } from '@/components/InstallButton';
import { saveTheme } from '@/components/ThemeRuntime';

type Language = 'hi-Latn' | 'en' | 'hi-Deva';

export default function ProfileView({ userId, name, email, language, theme }: { userId: string; name: string; email: string; language: string; theme: 'light' | 'dark' }) {
  const router = useRouter();
  const db = useMemo(() => createClient(), []);
  const [currentName, setName] = useState(name);
  const [nameDraft, setNameDraft] = useState(name);
  const [editName, setEditName] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [lang, setLang] = useState<Language>((['hi-Latn', 'en', 'hi-Deva'].includes(language) ? language : 'hi-Latn') as Language);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [darkTheme, setDarkTheme] = useState(theme === 'dark');
  const [dialog, setDialog] = useState<'logout' | 'account' | null>(null);
  const [confirmName, setConfirmName] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    setSound(localStorage.getItem('token-audio-all') === 'true');
    const saved=localStorage.getItem('tokenapp-language') as Language|null;
    if(saved&&['hi-Latn','en','hi-Deva'].includes(saved))setLang(saved);
  },[]);

  const saveName = async () => {
    if (nameDraft.trim().length < 2) { setStatusMessage('Naam kam se kam 2 akshar ka likhein.'); return; }
    setBusy(true);
    const { error } = await db.from('users').update({ name: nameDraft.trim() }).eq('id', userId);
    setBusy(false);
    if (error) { setStatusMessage('Naam save nahi ho paya. Dobara koshish karein.'); return; }
    setName(nameDraft.trim()); setEditName(false); setStatusMessage('Naam badal gaya.');
  };

  const setLanguage = async (value: string) => {
    const locale = value as Language;
    setLang(locale);
    localStorage.setItem('tokenapp-language', locale);
    document.cookie = `tokenapp-language=${locale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = locale === 'hi-Deva' ? 'hi' : locale;
    window.dispatchEvent(new Event('tokenapp-language-change'));
    const { error } = await db.from('users').update({ language: locale }).eq('id', userId);
    setLanguageOpen(false);
    if (error) setStatusMessage('Language setting save nahi ho payi.');
  };

  const deleteAccount = async () => {
    setBusy(true); setDeleteError('');
    const response = await fetch('/api/account/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ confirmationName: confirmName }) });
    setBusy(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setDeleteError(data.error === 'name_mismatch' ? 'Naam match nahi hua.' : data.error === 'missing_key' ? 'Account delete setup abhi poora nahi hai.' : 'Account delete nahi ho paya. Dobara koshish karein.');
      return;
    }
    await db.auth.signOut(); router.replace('/'); router.refresh();
  };

  return <>
    <AppBar title="Profile" isRootTab testId="profile.appbar" />
    <main className="container page tight" data-testid="profile">
      <Card big testId="profile.card"><h2 className="t-h2">{currentName}</h2><p className="t-body-sm c2">{email}</p><Button variant="tertiary" size="sm" onClick={() => { setNameDraft(currentName); setEditName(true); }}>Naam badlein</Button></Card>
      <section className="profile-section"><h2 className="t-overline c2">MADAD</h2><Card className="profile-options"><SettingsRow icon={<CircleHelp />} label="Guide (Madad)" onClick={() => router.push('/app/guide')} /></Card></section>
      <section className="profile-section"><h2 className="t-overline c2">SETTINGS</h2><Card className="profile-options"><SettingsRow icon={<Languages />} label="Language" value={lang === 'hi-Latn' ? 'Hinglish' : lang === 'en' ? 'English' : 'हिन्दी'} onClick={() => setLanguageOpen(true)} /><ToggleRow icon={<Volume2 />} label="Awaaz" checked={sound} onChange={value => { setSound(value); localStorage.setItem('token-audio-all', String(value)); if (value && 'speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance('Awaaz chalu ho gayi')); }} /><ToggleRow icon={<Moon />} label="Dark theme" helperText="Puri website ke rang dark mode me badlein." checked={darkTheme} onChange={value => { setDarkTheme(value); saveTheme(value ? 'dark' : 'light'); }} /></Card><InstallButton className="profile-install" /></section>
      <section className="profile-section"><h2 className="t-overline c2">LEGAL</h2><Card className="profile-options"><Link className="profile-row" href="/terms"><FileText />Terms<ChevronRight /></Link><Link className="profile-row" href="/privacy"><Shield />Privacy Policy<ChevronRight /></Link></Card></section>
      <section className="profile-section"><h2 className="t-overline c2">ACCOUNT</h2><Card className="profile-options"><SettingsRow icon={<LogOut />} label="Logout" onClick={() => setDialog('logout')} /><SettingsRow icon={<Trash2 />} label="Account delete karein" onClick={() => { setConfirmName(''); setDeleteError(''); setDialog('account'); }} /></Card></section>
      <p className="t-caption c2 profile-version">Version 1.0.0</p>{statusMessage&&<p role="status" className="t-body-sm">{statusMessage}</p>}
    </main>
    <BottomSheet isOpen={editName} onClose={() => setEditName(false)} title="Naam badlein" primaryAction={<Button fullWidth loading={busy} onClick={saveName}>Save karein</Button>} secondaryAction={<Button fullWidth variant="tertiary" onClick={() => setEditName(false)}>Wapas</Button>} testId="profile.name.sheet"><TextField label="Poora naam" value={nameDraft} onChange={event => setNameDraft(event.target.value.slice(0, 40))} maxLength={40} /></BottomSheet>
    <BottomSheet isOpen={languageOpen} onClose={() => setLanguageOpen(false)} title="Language" testId="profile.language"><SegmentedControl options={[{ value: 'hi-Latn', label: 'Hinglish' }, { value: 'en', label: 'English' }, { value: 'hi-Deva', label: 'हिन्दी' }]} value={lang} onChange={setLanguage} /></BottomSheet>
    <Dialog isOpen={dialog === 'logout'} title="Logout karein?" body="Aap dobara Google se login kar sakte hain. Aapka data safe rahega." primaryLabel="Logout" primaryVariant="danger-filled" onPrimary={async () => { setBusy(true); await db.auth.signOut(); router.replace('/'); router.refresh(); }} onCancel={() => setDialog(null)} testId="profile.logout.confirm" />
    <Dialog isOpen={dialog === 'account'} title="Account delete karein?" body={<div><p>Ye turant aur hamesha ke liye hatega. Recovery nahi hogi.</p><TextField label="Confirm karne ke liye apna naam likhein" value={confirmName} onChange={event => setConfirmName(event.target.value)} error={deleteError || undefined} /></div>} primaryLabel={busy ? 'Rukiye…' : 'Account delete karein'} primaryVariant="danger-filled" primaryDisabled={confirmName.trim() !== currentName.trim()} onPrimary={deleteAccount} onCancel={() => setDialog(null)} testId="profile.delete.confirm" />
  </>;
}
