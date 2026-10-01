'use client';

import { RefreshCw } from 'lucide-react';

export function RefreshControl() {
  return <button className="refresh-control" type="button" onClick={() => window.location.reload()} aria-label="Refresh" title="Refresh">
    <RefreshCw size={15} aria-hidden="true" /><span>Refresh</span>
  </button>;
}
