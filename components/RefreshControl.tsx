'use client';

import { RefreshCw } from 'lucide-react';

export function RefreshControl() {
  return <button className="refresh-control" type="button" onClick={() => window.location.reload()} aria-label="Refresh" title="Refresh">
    <RefreshCw size={16} aria-hidden="true" />
  </button>;
}
