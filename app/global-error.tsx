'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { if (process.env.NEXT_PUBLIC_SENTRY_DSN) void import('@sentry/nextjs').then(Sentry => Sentry.captureException(error)); }, [error]);
  return <html lang="hi"><body><main><h1>Page khul nahi paya. Kripya refresh karein.</h1><button type="button" onClick={reset}>Refresh karein</button></main></body></html>;
}
