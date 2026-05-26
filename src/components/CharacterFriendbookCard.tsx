// src/components/CharacterFriendbookCard.tsx
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SmartImage from '../components/SmartImage';
import { assetUrl } from '../common/assetUrl';

type Props = {
  characterId: string;
  coverImage?: string | null;
  detailImage?: string | null;
  extraImages?: string[];
  videoSrc?: string | null;
  onOpenVideo?: () => void;
};

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>{emoji}</span>
        <div className="text-sm font-extrabold text-slate-900">{title}</div>
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
  revealHint,
}: {
  icon: string;
  title: string;
  value: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  revealHint: string;
}) {
  if (!value.trim() || !title) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="text-left w-full rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-100 via-white to-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-400 transition-all active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none" aria-hidden>{icon}</span>
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-slate-900">{title}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              {open ? '● ● ●' : revealHint}
            </div>
          </div>
        </div>
        <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-extrabold text-base" aria-hidden>
          {open ? '−' : '+'}
        </div>
      </div>

      {open ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-900 leading-relaxed">{value}</div>
        </div>
      ) : null}
    </button>
  );
}

function CoverImage({ src, alt }: { src: string; alt: string }) {
  const tapeStyle: React.CSSProperties = {
    position: 'absolute',
    width: '44px',
    height: '14px',
    background: 'linear-gradient(180deg, rgba(255,252,200,0.90) 0%, rgba(255,242,140,0.80) 100%)',
    borderRadius: '2px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
    zIndex: 10,
  };

  return (
    <div className="relative w-full aspect-square">
      {/* Tape strip — top-left corner */}
      <div aria-hidden="true" style={{ ...tapeStyle, top: '-4px', left: '-4px', transform: 'rotate(-45deg)', transformOrigin: 'center center' }} />
      {/* Tape strip — top-right corner */}
      <div aria-hidden="true" style={{ ...tapeStyle, top: '-4px', right: '-4px', transform: 'rotate(45deg)', transformOrigin: 'center center' }} />

      <div className="w-full h-full bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center overflow-hidden p-3">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

function PhotoTile({ src, alt, onClick }: { src: string | null | undefined; alt: string; onClick?: () => void }) {
  const [failed, setFailed] = useState(false);
  if (!src?.trim() || failed) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-3xl border border-slate-200 overflow-hidden aspect-square bg-gradient-to-br from-slate-100 via-white to-slate-50 cursor-zoom-in w-full"
    >
      <div className="w-full h-full p-2">
        <SmartImage
          alt={alt}
          fallback={assetUrl(src)}
          onError={() => setFailed(true)}
          className="w-full h-full object-contain object-center"
          sizes="(min-width: 768px) 420px, 100vw"
          loading="lazy"
          decoding="async"
        />
      </div>
    </button>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const { t } = useTranslation('common');
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl font-bold transition-colors"
        aria-label={t('close', { defaultValue: 'Schließen' })}
      >
        ✕
      </button>
      <img
        src={assetUrl(src)}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
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
  const mostly = t(`${baseKey}.friendbook.mostly`, { defaultValue: '' });

  const othersLikeRaw = t(`${baseKey}.friendbook.othersLike`, { returnObjects: true }) as unknown;
  const annoysRaw = t(`${baseKey}.friendbook.annoys`, { returnObjects: true }) as unknown;
  const hobbiesRaw = t(`${baseKey}.friendbook.hobbies`, { returnObjects: true }) as unknown;
  const friendsRaw = t(`${baseKey}.friendbook.friends`, { returnObjects: true }) as unknown;

  const othersLike = asStringArray(othersLikeRaw);
  const annoys = asStringArray(annoysRaw);
  const hobbies = asStringArray(hobbiesRaw);
  const friends = asStringArray(friendsRaw);

  const colors = t(`${baseKey}.friendbook.colors`, { defaultValue: '' });
  const happy = t(`${baseKey}.friendbook.happy`, { defaultValue: '' });
  const netRule = t(`${baseKey}.friendbook.netRule`, { defaultValue: '' });
  const mistake = t(`${baseKey}.friendbook.mistake`, { defaultValue: '' });
  const secret = t(`${baseKey}.friendbook.secret`, { defaultValue: '' });
  const funFact = t(`${baseKey}.friendbook.funFact`, { defaultValue: '' });

  const revealHint = ui('actions.revealHint') || '👆 Antippen';

  const [secretOpen, setSecretOpen] = useState(false);
  const [funOpen, setFunOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const quickFacts = useMemo(() => {
    const rows: { emoji: string; label: string; value: string }[] = [];
    if (colors.trim()) rows.push({ emoji: '🎨', label: ui('sections.colors'), value: colors });
    if (happy.trim()) rows.push({ emoji: '😄', label: ui('sections.happy'), value: happy });
    if (netRule.trim()) rows.push({ emoji: '🛡️', label: ui('sections.netRule'), value: netRule });
    if (mistake.trim()) rows.push({ emoji: '🧩', label: ui('sections.mistake'), value: mistake });
    if (hobbies.length) rows.push({ emoji: '🎯', label: ui('sections.hobbiesInline'), value: hobbies.join(', ') });
    if (friends.length) rows.push({ emoji: '👫', label: ui('sections.friendsInline'), value: friends.join(', ') });
    return rows;
  }, [colors, happy, netRule, mistake, hobbies, friends, t]);

  const extras = (extraImages ?? []).filter(Boolean).slice(0, 2) as string[];
  const photoSources = [detailImage, extras[0], extras[1]].filter((s): s is string => Boolean(s?.trim()));
  const hasPhotos = photoSources.length > 0;

  const coverSrc = coverImage ? assetUrl(coverImage) : null;

  return (
    <>
    {lightboxSrc && <Lightbox src={lightboxSrc} alt={name} onClose={() => setLightboxSrc(null)} />}
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-6">

        {/* Mobile: image full-width first, then name + mostly */}
        <div className="md:hidden">
          {coverSrc ? (
            <div className="rounded-3xl border border-slate-200 overflow-visible mb-4">
              <CoverImage src={coverSrc} alt={name} />
            </div>
          ) : (
            <div className="aspect-square rounded-3xl border border-slate-200 bg-slate-100 flex items-center justify-center mb-4">
              <span className="text-6xl" aria-hidden>🎁</span>
            </div>
          )}
          <NameBlock name={name} label={ui('labels.myName')} />
          {mostly.trim() ? <MostlyBlock mostly={mostly} label={ui('sections.mostly')} /> : null}
        </div>

        {/* Desktop: left = name + mostly, right = image */}
        <div className="hidden md:grid md:grid-cols-[1fr_220px] md:gap-5 md:items-start">
          <div>
            <NameBlock name={name} label={ui('labels.myName')} />
            {mostly.trim() ? <MostlyBlock mostly={mostly} label={ui('sections.mostly')} /> : null}
          </div>
          <div className="rounded-3xl border border-slate-200 overflow-visible">
            {coverSrc ? (
              <CoverImage src={coverSrc} alt={name} />
            ) : (
              <div className="aspect-square flex items-center justify-center bg-slate-100">
                <span className="text-6xl" aria-hidden>🎁</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="px-4 sm:px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

        {othersLike.length ? (
          <SectionCard emoji="🌟" title={ui('sections.othersLike')}>
            <ul className="space-y-3 text-sm text-slate-900">
              {othersLike.map((it, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl leading-none shrink-0 mt-0.5" aria-hidden>✅</span>
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        ) : null}

        {annoys.length ? (
          <SectionCard emoji="😤" title={ui('sections.annoys')}>
            <ul className="space-y-3 text-sm text-slate-900">
              {annoys.map((it, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl leading-none shrink-0 mt-0.5" aria-hidden>⚠️</span>
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        ) : null}

        {/* QuickFacts — always shown */}
        <div className="md:col-span-2">
          <SectionCard emoji="📌" title={ui('sections.quickFacts') || 'Kurz & wichtig'}>
            {quickFacts.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickFacts.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden>{r.emoji}</span>
                      <div className="text-xs font-extrabold text-slate-700">{r.label}</div>
                    </div>
                    <div className="mt-1.5 text-sm text-slate-900 leading-relaxed">{r.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic">
                {ui('sections.quickFactsEmpty') || 'Noch keine Infos eingetragen.'}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Secret + FunFact */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <RevealCard
            icon="🔐"
            title={ui('sections.secret')}
            value={secret}
            open={secretOpen}
            setOpen={setSecretOpen}
            revealHint={revealHint}
          />
          <RevealCard
            icon="🎉"
            title={ui('sections.funFact')}
            value={funFact}
            open={funOpen}
            setOpen={setFunOpen}
            revealHint={revealHint}
          />
        </div>

        {/* Photo strip — only if photos exist */}
        {hasPhotos ? (
          <div className="md:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>📸</span>
                  <div className="text-sm font-extrabold text-slate-900">{ui('sections.photos') || 'Fotos'}</div>
                </div>
                {videoSrc && onOpenVideo ? (
                  <button
                    type="button"
                    onClick={onOpenVideo}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 hover:bg-slate-50"
                  >
                    {ui('actions.watchClip') || '▶ Clip'}
                  </button>
                ) : null}
              </div>

              <div className={[
                'grid gap-3',
                photoSources.length === 1 ? 'grid-cols-1' :
photoSources.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
'grid-cols-1 sm:grid-cols-2',
              ].join(' ')}>
                <PhotoTile src={detailImage ?? null} alt={name} onClick={detailImage ? () => setLightboxSrc(detailImage) : undefined} />
                <PhotoTile src={extras[0] ?? null} alt={name} onClick={extras[0] ? () => setLightboxSrc(extras[0]) : undefined} />
                <PhotoTile src={extras[1] ?? null} alt={name} onClick={extras[1] ? () => setLightboxSrc(extras[1]) : undefined} />
              </div>
            </div>
          </div>
        ) : null}

      </div>
    </div>
    </>
  );
}

// ── Extracted sub-blocks to avoid JSX duplication ──────────────

function NameBlock({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
        {label || 'Freundebuch'}
      </div>
      <div className="mt-1 text-3xl font-extrabold text-slate-900 leading-tight">{name}</div>
    </div>
  );
}

function MostlyBlock({ mostly, label }: { mostly: string; label: string }) {
  return (
    <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>💬</span>
        <div className="text-sm font-extrabold text-slate-900">{label}</div>
      </div>
      <div className="mt-2 text-sm text-slate-800 leading-relaxed">{mostly}</div>
    </div>
  );
}
