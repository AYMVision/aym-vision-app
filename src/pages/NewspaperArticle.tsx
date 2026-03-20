// src/pages/NewspaperArticle.tsx
// Schülerzeitung Detail: lädt bodySrc als Markdown (empfohlen) oder PDF (optional).
// Datensparsam: Inhalte nur aus /public, Fortschritt lokal (bonusSeen + profile.progress).

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';

import { useProfile } from '../profile/useProfile';
import { BONUS_INDEX, type BonusItem } from '../bonus/bonusIndex';
import { isBonusUnlocked, type BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { unlockBonusById } from '../bonus/unlockBonusById';
import { parseFrontmatter } from '../bonus/mdFrontmatter';
import { loadSeenBonusIds } from '../bonus/bonusSeen';
import { ArticleBody } from '../bonus/ArticleBody';


type LocationState = { backTo?: string; backgroundLocation?: unknown } | null;


function normalizeLang(lang: string | undefined) {
  const l = (lang ?? 'de').toLowerCase();
  return l.startsWith('en') ? 'en' : 'de';
}

function useBonusProgressFromProfile(): BonusProgressSnapshot {
  const { profile } = useProfile();

  const completed = profile.progress?.completedChapters ?? {};
  const seen = new Set<string>();

  for (const [key, done] of Object.entries(completed)) {
    if (!done) continue;
    const parts = key.split(':');
    if (parts.length !== 3) continue;

    const episodeId = parts[1];
    const match = /^c(\d{2})$/.exec(parts[2]);
    if (!match) continue;

    seen.add(`${episodeId}c${match[1]}`);
  }

  const cur = profile.progress?.current;
  if (cur?.episodeId && typeof cur.chapterIndex === 'number') {
    const c = String(cur.chapterIndex).padStart(2, '0');
    seen.add(`${cur.episodeId}c${c}`);
  }

  return { seenChapterIds: Array.from(seen) };
}

/** ✅ Topic/Icon helpers (wie in Newspaper.tsx) */
function topicIcon(topicId: string) {
  const map: Record<string, string> = {
    infoCheck: '🕵️',
    teamTalk: '🤝',
    create: '🎨',
    safe: '🛡️',
    solve: '🧩',
    reflect: '🔍',
    fair: '⚖️',
  };
  return map[topicId] ?? '📰';
}

function pickFallbackEmoji(item: BonusItem) {
  if (item.mediaType === 'audio') return '🎧';
  if (item.mediaType === 'link') return '🔗';

  const firstTopic = (item.topicTags ?? [])[0];
  if (firstTopic) return topicIcon(firstTopic);

  return '📰';
}

function MarkdownBody({ text }: { text: string }) {
  // Minimal, sicherer Renderer (kein HTML). Unterstützt: #, ##, -, Absätze, > Quote
  const lines = text.replace(/\r\n/g, '\n').split('\n');

  const blocks: Array<{ type: 'h1' | 'h2' | 'p' | 'ul' | 'quote'; content: string[] }> = [];
  let cur: { type: 'p' | 'ul' | 'quote'; content: string[] } | null = null;

  function flush() {
    if (cur && cur.content.join('').trim()) blocks.push(cur);
    cur = null;
  }

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flush();
      continue;
    }

    if (line.startsWith('# ')) {
      flush();
      blocks.push({ type: 'h1', content: [line.replace(/^#\s+/, '')] });
      continue;
    }
    if (line.startsWith('## ')) {
      flush();
      blocks.push({ type: 'h2', content: [line.replace(/^##\s+/, '')] });
      continue;
    }
    if (line.startsWith('- ')) {
      if (!cur || cur.type !== 'ul') {
        flush();
        cur = { type: 'ul', content: [] };
      }
      cur.content.push(line.replace(/^-+\s+/, ''));
      continue;
    }
    if (line.startsWith('> ')) {
      if (!cur || cur.type !== 'quote') {
        flush();
        cur = { type: 'quote', content: [] };
      }
      cur.content.push(line.replace(/^>\s+/, ''));
      continue;
    }

    if (!cur || cur.type !== 'p') {
      flush();
      cur = { type: 'p', content: [] };
    }
    cur.content.push(line);
  }
  flush();

  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.type === 'h1')
          return (
            <div key={i} className="text-xl font-extrabold text-slate-900">
              {b.content[0]}
            </div>
          );
        if (b.type === 'h2')
          return (
            <div key={i} className="text-lg font-extrabold text-slate-900">
              {b.content[0]}
            </div>
          );
        if (b.type === 'ul') {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1 text-sm text-slate-800 leading-relaxed">
              {b.content.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        }
        if (b.type === 'quote') {
          return (
            <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              {b.content.join(' ')}
            </div>
          );
        }
        return (
          <div key={i} className="text-sm text-slate-800 leading-relaxed">
            {b.content.join(' ')}
          </div>
        );
      })}
    </div>
  );
}

export default function NewspaperArticle() {
  const { t, i18n } = useTranslation('bonus');
  const lang = normalizeLang(i18n.resolvedLanguage ?? i18n.language);

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState;
  const isModal = Boolean(state?.backgroundLocation);


  const progress = useBonusProgressFromProfile();

  const [imgFailed, setImgFailed] = useState(false);

  const [bodyText, setBodyText] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState(false);

  const [meta, setMeta] = useState<{ title?: string; description?: string; author?: string; date?: string } | null>(
    null
  );

  const item = useMemo(() => {
    if (!id) return null;
    return BONUS_INDEX.find((x) => x.bonusId === id && x.category === 'newspaper') ?? null;
  }, [id]);

  const unlocked = item ? isBonusUnlocked(item, progress) : false;
  const locked = !!item && !unlocked;

  // ✅ Seen markieren (nur wenn unlocked)
useEffect(() => {
  if (!item || !unlocked) return;
  unlockBonusById(item.bonusId);
}, [item, unlocked]);



  // ✅ Load Markdown body if configured & unlocked
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setBodyError(false);
      setBodyText(null);
      setMeta(null);

      if (!item || !unlocked) return;
      if (!item.bodySrc) return;

      const kind = item.bodyKind ?? 'md';
      if (kind === 'pdf') return; // PDF wird per iframe gerendert

const urlLang = assetUrl(`${item.bodySrc}.${lang}.md`);
const urlPlain = assetUrl(`${item.bodySrc}.md`);

try {
  let res = await fetch(urlLang);

  // fallback: wenn es keine .de.md / .en.md Datei gibt
  if (!res.ok) res = await fetch(urlPlain);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const text = await res.text();
  const parsed = parseFrontmatter(text);

  if (cancelled) return;

  setMeta(parsed.meta ?? null);
  setBodyText((parsed.body ?? '').trim());
} catch {
  if (!cancelled) setBodyError(true);
}
}

    load();
    return () => {
      cancelled = true;
    };
  }, [item, unlocked, lang]);

  if (!item) {
return (
  <Layout
    title={isModal ? undefined : t('newspaper.title', { defaultValue: 'Schülerzeitung' })}
    backPath={isModal ? undefined : (state?.backTo ?? '/newspaper')}
    hideHeader={isModal}
  >
        <div className="max-w-3xl mx-auto px-4 mt-6 text-sm text-slate-600">
          {t('newspaper.notFound', { defaultValue: 'Artikel nicht gefunden.' })}
          <div className="mt-4">
            <Link className="font-extrabold underline" to="/newspaper">
              {t('newspaper.backToBlog', { defaultValue: 'Zurück zum Blog →' })}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

// ✅ Titel/Desc: 1) Frontmatter (nur wenn nicht leer) 2) i18n 3) fallback
const fallbackTitle = item.titleKey ? t(item.titleKey, { defaultValue: item.bonusId }) : item.bonusId;
const fallbackDesc = item.descriptionKey ? t(item.descriptionKey, { defaultValue: '' }) : '';

const title = meta?.title?.trim() ? meta.title : fallbackTitle;
const desc = meta?.description?.trim() ? meta.description : fallbackDesc;


  const coverSrc = item.coverImage ? assetUrl(item.coverImage) : '';
  const fallbackEmoji = pickFallbackEmoji(item);

  const bodyKind = item.bodyKind ?? 'md';
  const bodyUrl =
    item.bodySrc
      ? bodyKind === 'pdf'
        ? assetUrl(`${item.bodySrc}.${lang}.pdf`)
        : assetUrl(`${item.bodySrc}.${lang}.md`)
      : null;

      const showHeaderText = bodyKind !== 'md'; 
// wenn es ein MD-Artikel ist, kommt Titel im Body -> Headertext weg



    return (
  <Layout
    title={isModal ? undefined : t('newspaper.title', { defaultValue: 'Schülerzeitung' })}
    backPath={isModal ? undefined : (state?.backTo ?? '/newspaper')}
    hideHeader={isModal}
  >

      <div className="max-w-3xl mx-auto px-4 pt-4">
        {isModal ? (
    <div className="mb-3 flex items-center justify-between">
    <Link
      to={state?.backTo ?? '/stories'}
      className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--color-teal-900)]"
    >
      ← {t('newspaper.backToStory', { defaultValue: 'Zurück zur Story' })}
    </Link>

    <Link
      to="/newspaper"
      className="text-sm font-semibold text-slate-700 underline"
    >
      {t('newspaper.backToBlog', { defaultValue: 'Zur Übersicht' })}
    </Link>
  </div>
) : null}

        <div className="mt-4 rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
          <div className="p-4">


{showHeaderText ? (
  <>
    <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{title}</div>
    {desc ? <div className="mt-2 text-sm text-slate-700">{desc}</div> : null}
  </>
) : null}


<div className="px-4 pb-5 space-y-4">
  {!unlocked ? (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      🔒 {t('newspaper.lockHint', { defaultValue: 'Lies weiter in der Story, um das freizuschalten.' })}
    </div>
  ) : null}

  {/* Audio */}
  {unlocked && item.mediaType === 'audio' && item.audioSrc ? (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-extrabold text-slate-600 mb-2">
        {t('newspaper.listen', { defaultValue: 'Anhören' })}
      </div>
      <audio controls className="w-full">
        <source src={assetUrl(item.audioSrc)} />
      </audio>
    </div>
  ) : null}

  {/* Body (MD oder PDF) */}
  {unlocked && item.bodySrc ? (
    bodyKind === 'pdf' ? (
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="p-3 text-sm font-extrabold text-slate-600">
          {t('newspaper.pdf', { defaultValue: 'PDF' })}
        </div>
        <div className="h-[70vh] border-t border-slate-200">
          <iframe title={title} src={bodyUrl ?? undefined} className="w-full h-full" />
        </div>
        <div className="p-3 text-sm text-slate-600">
          {t('newspaper.pdfHint', { defaultValue: 'Wenn das PDF auf dem Handy klein ist: lieber den Text-Artikel nutzen.' })}
        </div>
      </div>
    ) : (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-extrabold text-slate-600 mb-3">
          {t('newspaper.articleBody', { defaultValue: 'Artikel' })}
        </div>

        {bodyError ? (
          <div className="text-base text-slate-700">
            {t('newspaper.bodyMissing', { defaultValue: 'Der Text kommt bald ✨' })}
          </div>
        ) : bodyText ? (
          <ArticleBody text={bodyText} />
        ) : (
          <div className="text-base text-slate-600">
            {t('newspaper.loading', { defaultValue: 'Lädt…' })}
          </div>
        )}
      </div>
    )
  ) : null}

  {/* Link */}
  {unlocked && item.mediaType === 'link' && item.linkHref ? (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-extrabold text-slate-600 mb-2">
        {t('newspaper.link', { defaultValue: 'Link' })}
      </div>
      <a href={item.linkHref} className="font-extrabold underline" target="_blank" rel="noreferrer">
        {t('newspaper.openLink', { defaultValue: 'Link öffnen →' })}
      </a>
    </div>
  ) : null}

  <div className="flex items-center justify-between gap-3">
    {isModal ? (
      <Link
        to={state?.backTo ?? '/stories'}
        className="inline-flex px-4 py-2 rounded-2xl border border-slate-200 bg-white text-base font-extrabold text-[var(--color-teal-900)] hover:bg-slate-50"
      >
        ← {t('newspaper.backToStory', { defaultValue: 'Zurück zur Story' })}
      </Link>
    ) : (
      <span />
    )}

    <Link
      to="/newspaper"
      className="inline-flex px-4 py-2 rounded-2xl border border-slate-200 bg-white text-base font-extrabold text-slate-800 hover:bg-slate-50"
    >
      {t('newspaper.backToBlog', { defaultValue: 'Zurück zum Blog →' })}
    </Link>
  </div>
</div>

</div>
</div>
        <div className="h-10" />
      </div>
    </Layout>
  );
}
