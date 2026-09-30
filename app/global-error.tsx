'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error); }, [error]);
  return <html lang="hi"><body><main role="alert"><h1>App khul nahi paayi.</h1><p>Dobara koshish karein.</p><button type="button" onClick={reset}>Dobara koshish karein</button></main></body></html>;
}
