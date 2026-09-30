'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/Button';

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error); }, [error]);
  return <main className="container page tight" role="alert"><h1 className="t-h2">Screen khul nahi paayi.</h1><p className="t-body-sm c2">Dobara koshish karein.</p><Button onClick={reset}>Dobara koshish karein</Button></main>;
}
