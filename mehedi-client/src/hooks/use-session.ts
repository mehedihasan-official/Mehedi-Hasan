'use client';

import { useEffect, useState } from 'react';
import type { SessionUser } from '@/shared';

type SessionData = { user: SessionUser; apiToken: string } | null;
type Status = 'loading' | 'authenticated' | 'unauthenticated';

export function useSession(): { data: SessionData; status: Status } {
  const [data, setData] = useState<SessionData>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { user: SessionUser | null; apiToken: string | null } | null) => {
        if (cancelled) return;
        if (body?.user && body.apiToken) {
          setData({ user: body.user, apiToken: body.apiToken });
          setStatus('authenticated');
        } else {
          setData(null);
          setStatus('unauthenticated');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('unauthenticated');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, status };
}
