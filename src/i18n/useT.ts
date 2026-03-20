import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18nInstance, { ensureNamespace, type I18nNamespace } from '../i18n';

export function useT(ns: I18nNamespace) {
  const { t, i18n } = useTranslation(ns, { useSuspense: false });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const lng = (i18n.resolvedLanguage || i18nInstance.language || 'de').split('-')[0];
    setLoaded(false);
    ensureNamespace(lng, ns).then(() => setLoaded(true));
  }, [ns, i18n.resolvedLanguage]);

  return { t, loaded };
}