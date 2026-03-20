// src/components/CharacterFriendbookCard.tsx
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SmartImage from '../components/SmartImage';
import { assetUrl } from '../common/assetUrl';

type Props = {
  characterId: string;
  coverImage?: string | null;

  // ✅ Fotoleiste
  detailImage?: string | null;
  extraImages?: string[]; // 0..n
  videoSrc?: string | null;
  onOpenVideo?: () => void;
};


function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
}

/** Split bio like "Ruhig. Überlegt. Wach." into ["Ruhig", "Überlegt", "Wach"] */
function splitBioToTags(bio: string): string[] {
  return bio
    .split(/[.·•]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

const BIO_EMOJI: Record<string, string> = {
  ruhig: '🧘',
  überlegt: '🧠',
  wach: '👀',
  laut: '📣',
  direkt: '⚡️',
  modisch: '✨',
  neugierig: '🔎',
  fair: '⚖️',
  schnell: '🏃',
  kreativ: '🎨',
};

function emojiForWord(w: string) {
  const key = w.toLowerCase().replace(/[^a-zäöüß]/g, '');
  return BIO_EMOJI[key] ?? '⭐️';
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-extrabold text-slate-900 shadow-sm">
      {children}
    </span>
  );
}

function SectionCard({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  if (!title) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          {emoji}
        </span>
        <div className="text-[13px] font-extrabold text-slate-900">{title}</div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function RevealCard({
  icon,
  title,
  value,
  open,
  setOpen,
}: {
  icon: string;
  title: string;
  value: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  if (!value.trim() || !title) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="text-left w-full rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none" aria-hidden>
            {icon}
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-extrabold text-slate-900">{title}</div>
            <div className="text-[11px] font-semibold text-slate-500">{open ? '• • •' : '• • • • • • •'}</div>
          </div>
        </div>

        <div className="shrink-0 text-lg font-extrabold text-slate-800" aria-hidden>
          {open ? '−' : '+'}
        </div>
      </div>

      {open ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
          <div className="text-sm text-slate-900 leading-relaxed">{value}</div>
        </div>
      ) : null}
    </button>
  );
}

function PhotoTile({
  src,
  alt,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const hasSrc = Boolean(src && src.trim());
  const showGift = !hasSrc || failed;

  if (showGift) {
    return (
      <div
        className={[
          'rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex items-center justify-center',
          className ?? 'h-[220px]',
        ].join(' ')}
      >
        <span className="text-5xl" aria-hidden>
          🎁
        </span>
      </div>
    );
  }

  return (
    <div
      className={[
        'rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden',
        className ?? 'h-[220px]',
      ].join(' ')}
    >
      <SmartImage
        alt={alt}
        fallback={assetUrl(src!)}
        onErrorFallback={assetUrl('media/ui/gift-512.webp')}
        onError={() => setFailed(true)} 
        className="w-full h-full object-cover object-center"
        sizes="(min-width: 768px) 420px, 100vw"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}



export default function CharacterFriendbookCard({
  characterId,
  coverImage,
  detailImage,
  extraImages,
  videoSrc,
  onOpenVideo,
}: Props) {
  const { t } = useTranslation('bonus');

  const baseKey = `characters.${characterId}`;
  const ui = (k: string) => t(`charactersUi.${k}`, { defaultValue: '' });

  const name = t(`${baseKey}.name`, { defaultValue: characterId });

  const bio = t(`${baseKey}.bio`, { defaultValue: '' });
  const bioTags = splitBioToTags(bio);

  const mostly = t(`${baseKey}.friendbook.mostly`, { defaultValue: '' });

  const othersLikeRaw = t(`${baseKey}.friendbook.othersLike`, { returnObjects: true }) as unknown;
  const annoysRaw = t(`${baseKey}.friendbook.annoys`, { returnObjects: true }) as unknown;
  const hobbiesRaw = t(`${baseKey}.friendbook.hobbies`, { returnObjects: true }) as unknown;

  const othersLike = asStringArray(othersLikeRaw);
  const annoys = asStringArray(annoysRaw);
  const hobbies = asStringArray(hobbiesRaw);
  const friendsRaw = t(`${baseKey}.friendbook.friends`, { returnObjects: true }) as unknown;
const friends = asStringArray(friendsRaw);


  const colors = t(`${baseKey}.friendbook.colors`, { defaultValue: '' });
  const happy = t(`${baseKey}.friendbook.happy`, { defaultValue: '' });
  const netRule = t(`${baseKey}.friendbook.netRule`, { defaultValue: '' });
  const mistake = t(`${baseKey}.friendbook.mistake`, { defaultValue: '' });

  const secret = t(`${baseKey}.friendbook.secret`, { defaultValue: '' });
  const funFact = t(`${baseKey}.friendbook.funFact`, { defaultValue: '' });

  const [secretOpen, setSecretOpen] = useState(false);
  const [funOpen, setFunOpen] = useState(false);

  const coverSrc = coverImage ? assetUrl(coverImage) : '';

  const quickFacts = useMemo(() => {
  const rows: { emoji: string; label: string; value: string }[] = [];

  if (colors.trim()) rows.push({ emoji: '🎨', label: ui('sections.colors'), value: colors });
  if (happy.trim()) rows.push({ emoji: '😄', label: ui('sections.happy'), value: happy });
  if (netRule.trim()) rows.push({ emoji: '🛡️', label: ui('sections.netRule'), value: netRule });
  if (mistake.trim()) rows.push({ emoji: '🧩', label: ui('sections.mistake'), value: mistake });

  // ✅ NEU: Hobbies + Friends als QuickFacts
  if (hobbies.length) rows.push({ emoji: '🎯', label: ui('sections.hobbiesInline'), value: hobbies.join(', ') });
  if (friends.length) rows.push({ emoji: '👫', label: ui('sections.friendsInline'), value: friends.join(', ') });

  return rows;
}, [colors, happy, netRule, mistake, hobbies, friends, t]);


  // Foto-Leiste: detailImage + bis zu 2 extraImages
  const extras = (extraImages ?? []).filter(Boolean).slice(0, 2) as string[];
  const hasAnyPhoto = Boolean(detailImage || extras.length > 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* 1/2) Freundebuch-Zeile: "Mein Name: ..." Name ganz oben links */}
        <div className="text-2xl font-extrabold text-slate-900"> {ui('labels.myName')}: {name}</div>

        {/* 3) Bio-Tags */}
        {bioTags.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {bioTags.map((w, i) => (
              <Chip key={`${w}-${i}`}>
                <span className="text-lg" aria-hidden>
                  {emojiForWord(w)}
                </span>
                <span>{w}</span>
              </Chip>
            ))}
          </div>
        ) : null}

        {/* 4) Erste Reihe: links "mostly (+ hobbies)", rechts Portrait (Passport-Crop) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 items-start">
          {/* LEFT */}
          {mostly.trim() ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  💬
                </span>
                <div className="text-[13px] font-extrabold text-slate-900">{ui('sections.mostly')}</div>
              </div>

              <div className="mt-2 text-sm text-slate-800 leading-relaxed">{mostly}</div>


            </div>
          ) : null}


          {/* RIGHT: Portrait als "Passfoto"-Crop (hochkant; links/rechts eher abgeschnitten) */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {coverImage ? (
              <SmartImage
                alt={name}
                fallback={coverSrc}
                onErrorFallback={assetUrl('media/ui/gift-512.webp')}
                className="w-full h-[160px] object-cover object-center"
                sizes="(min-width: 768px) 220px, 100vw"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-[220px] flex items-center justify-center">
                <span className="text-5xl" aria-hidden>
                  🎁
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="px-4 sm:px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {othersLike.length ? (
          <SectionCard emoji="🌟" title={ui('sections.othersLike')}>
            <ul className="space-y-2 text-sm text-slate-900">
              {othersLike.map((it, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-xl leading-none" aria-hidden>
                    ✅
                  </span>
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        ) : null}

        {annoys.length ? (
          <SectionCard emoji="😤" title={ui('sections.annoys')}>
            <ul className="space-y-2 text-sm text-slate-900">
              {annoys.map((it, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-xl leading-none" aria-hidden>
                    ⚠️
                  </span>
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        ) : null}


        {quickFacts.length ? (
          <div className="md:col-span-2">
            <SectionCard emoji="📌" title={ui('sections.quickFacts')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickFacts.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden>
                        {r.emoji}
                      </span>
                      <div className="text-[12px] font-extrabold text-slate-700">{r.label}</div>
                    </div>
                    <div className="mt-1 text-sm text-slate-900 leading-relaxed">{r.value}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        ) : null}

        {/* Secret + FunFact: nebeneinander, gleicher Stil/Mechanik */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <RevealCard
            icon="🔐"
            title={ui('sections.secret')}
            value={secret}
            open={secretOpen}
            setOpen={setSecretOpen}
          />
          <RevealCard
            icon="🎉"
            title={ui('sections.funFact')}
            value={funFact}
            open={funOpen}
            setOpen={setFunOpen}
          />
        </div>

{/* 📸 Foto-Leiste unten (Grid) */}
<div className="md:col-span-2">
  <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          📸
        </span>
        <div className="text-[13px] font-extrabold text-slate-900">{ui('sections.photos')}</div>
      </div>

      {videoSrc && onOpenVideo ? (
        <button
          type="button"
          onClick={onOpenVideo}
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 hover:bg-slate-50"
        >
          {ui('actions.watchClip')}
        </button>
      ) : null}
    </div>

    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <PhotoTile src={detailImage ?? null} alt={name} className="h-[220px]" />
      <PhotoTile src={extras[0] ?? null} alt={name} className="h-[220px]" />
      <PhotoTile src={extras[1] ?? null} alt={name} className="h-[220px] relative" />
    </div>

    {!hasAnyPhoto && !videoSrc ? (
      <div className="mt-3 text-xs font-semibold text-slate-600">{ui('sections.photosEmptyHint')}</div>
    ) : null}
  </div>
</div>

      </div>
    </div>
  );
}
