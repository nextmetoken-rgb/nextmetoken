'use client';

import { useEffect, useState } from 'react';
import { CoachMark } from '@/components/CoachMark';
import { createClient } from '@/lib/supabase/client';
import { popupPreferenceEnabled } from '@/lib/popupPreference';

export function CoachTip({ id, message }: { id: string; message: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let alive = true;
    const db = createClient();
    const sync = () => {
      void db.from('users').select('helper_tips_enabled,coachmarks_seen').maybeSingle().then(({ data }) => {
        if (!alive || !data?.helper_tips_enabled || data.coachmarks_seen?.[id] || !popupPreferenceEnabled()) { setShow(false); return; }
        setShow(true);
      });
    };
    sync();
    window.addEventListener('tokenapp-popup-preference-change', sync);
    return () => { alive = false; window.removeEventListener('tokenapp-popup-preference-change', sync); };
  }, [id]);
  const dismiss = async () => {
    setShow(false);
    const db = createClient();
    const { data } = await db.from('users').select('coachmarks_seen').maybeSingle();
    await db.from('users').update({ coachmarks_seen: { ...(data?.coachmarks_seen || {}), [id]: true } });
  };
  return <CoachMark isOpen={show} message={message} onDismiss={dismiss} testId={`coach.${id}`} />;
}
