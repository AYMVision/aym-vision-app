// src/bonus/useArticleMeta.ts
import { useEffect, useState } from 'react';
import { parseFrontmatter, type MdMeta } from './mdFrontmatter';

const CACHE = new Map<string, MdMeta>();

export function useArticleMeta(bodySrc?: string, lang: string = 'de') {
  const [meta, setMeta] = useState<MdMeta | null>(() => {
    if (!bodySrc) return null;
    return CACHE.get(`${bodySrc}.${lang}`) ?? null;
  });

  useEffect(() => {
    if (!bodySrc) return;

    const key = `${bodySrc}.${lang}`;
    if (CACHE.has(key)) {
      setMeta(CACHE.get(key)!);
      return;
    }

    fetch(`/${bodySrc}.${lang}.md`)
      .then((r) => r.ok ? r.text() : '')
      .then((text) => {
        if (!text) return;
        const { meta } = parseFrontmatter(text);
        CACHE.set(key, meta);
        setMeta(meta);
      })
      .catch(() => {
        /* leise scheitern */
      });
  }, [bodySrc, lang]);

  return meta;
}
