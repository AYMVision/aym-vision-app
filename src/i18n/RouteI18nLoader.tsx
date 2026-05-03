// src/i18n/RouteI18nLoader.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import i18n, { ensureNamespaces } from '../i18n';
import { namespacesForPath } from './routeNamespaces';

export default function RouteI18nLoader({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const lng = (i18n.resolvedLanguage || i18n.language || 'de').split('-')[0];
    const needed = namespacesForPath(location.pathname);

    setReady(false);
    ensureNamespaces(lng, needed).then(() => {
      if (alive) setReady(true);
    });

  return () => {
    alive = false;
  };
}, [location.pathname, i18n.resolvedLanguage]);

  if (!ready) return null; // oder Skeleton/Spinner
  return <>{children}</>;
}