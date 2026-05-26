// src/bonus/ArticleReader.tsx
// Interaktiver Artikel-Reader:
//   1. Section-by-Section Reveal (h2 = neue Sektion)
//   2. Optional: "Gehört ✓"-Schritt für Audio-Artikel
//   3. Reaktions-Buttons am Ende (wird im Transfer-Export gespeichert)
//   4. Coin + Konfetti + "Gelesen!"-Badge beim Abschluss

import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseArticleBlocks, type ArticleBlock } from './articleBlocks';
import { ArticleBody } from './ArticleBody';
import { useProfile } from '../profile/useProfile';
import { earnCoins } from '../profile/wallet';
import { assetUrl } from '../common/assetUrl';

// ---------------------------------------------------------------------------
// Persistenz: gelesene Artikel
// ---------------------------------------------------------------------------

const ARTICLE_READ_KEY = 'aym_article_read_v1';

function isArticleRead(bonusId: string): boolean {
  try {
    const raw = localStorage.getItem(ARTICLE_READ_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    return ids.includes(bonusId);
  } catch {
    return false;
  }
}

function markArticleRead(bonusId: string): void {
  try {
    const raw = localStorage.getItem(ARTICLE_READ_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(bonusId)) {
      ids.push(bonusId);
      localStorage.setItem(ARTICLE_READ_KEY, JSON.stringify(ids));
    }
  } catch {}
}

// ---------------------------------------------------------------------------
// Persistenz: Reaktionen (Transfer-Export)
// ---------------------------------------------------------------------------

export const ARTICLE_REACTIONS_KEY = 'aym_article_reactions_v1';

export type ArticleReactionEntry = {
  bonusId: string;
  reaction: string;
  readAt: number;
};

function saveArticleReaction(bonusId: string, reaction: string): void {
  try {
    const raw = localStorage.getItem(ARTICLE_REACTIONS_KEY);
    const entries: ArticleReactionEntry[] = raw ? JSON.parse(raw) : [];
    // Vorhandenen Eintrag updaten oder neuen anhängen
    const idx = entries.findIndex((e) => e.bonusId === bonusId);
    const entry: ArticleReactionEntry = { bonusId, reaction, readAt: Date.now() };
    if (idx >= 0) entries[idx] = entry;
    else entries.push(entry);
    localStorage.setItem(ARTICLE_REACTIONS_KEY, JSON.stringify(entries));
  } catch {}
}

// ---------------------------------------------------------------------------
// Sektionen aufteilen: jede h2 beginnt eine neue Sektion
// ---------------------------------------------------------------------------

function splitIntoSections(blocks: ArticleBlock[]): ArticleBlock[][] {
  if (blocks.length === 0) return [];
  const sections: ArticleBlock[][] = [];
  let current: ArticleBlock[] = [];

  for (const block of blocks) {
    if (block.type === 'h2' && current.length > 0) {
      sections.push(current);
      current = [block];
    } else {
      current.push(block);
    }
  }
  if (current.length > 0) sections.push(current);
  return sections;
}

// ---------------------------------------------------------------------------
// Konfetti (steigt von unten auf)
// ---------------------------------------------------------------------------

const CONFETTI_COLORS = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
const CONFETTI_SHAPES = ['circle', 'square'] as const;

type Particle = {
  id: number;
  dx: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  shape: 'circle' | 'square';
  startX: number;
};

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    dx: (Math.random() - 0.5) * 160,
    delay: Math.random() * 0.4,
    duration: 1.0 + Math.random() * 0.8,
    size: 7 + Math.floor(Math.random() * 8),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
    startX: 20 + Math.random() * 60,
  }));
}

function ConfettiBurst() {
  const particles = useMemo(() => makeParticles(28), []);

  return (
    <>
      <style>{`
        @keyframes article-confetti-rise {
          0%   { opacity: 1;   transform: translateY(0)      translateX(0)         rotate(0deg); }
          70%  { opacity: 0.9; }
          100% { opacity: 0;   transform: translateY(-280px) translateX(var(--dx)) rotate(540deg); }
        }
      `}</style>
      <div
        className="absolute inset-x-0 bottom-0 h-72 overflow-hidden pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.startX}%`,
              bottom: '24px',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : '3px',
              ['--dx' as string]: `${p.dx}px`,
              animation: `article-confetti-rise ${p.duration}s ${p.delay}s cubic-bezier(0.2,0.8,0.4,1) forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Reaktions-Buttons
// ---------------------------------------------------------------------------

const REACTIONS = [
  { id: 'known',       labelKey: 'articleReader.reactions.known' },
  { id: 'interesting', labelKey: 'articleReader.reactions.interesting' },
  { id: 'useful',      labelKey: 'articleReader.reactions.useful' },
];

// ---------------------------------------------------------------------------
// ArticleReader
// ---------------------------------------------------------------------------

export function ArticleReader({
  text,
  bonusId,
  requireAudioConfirm = false,
}: {
  text: string;
  bonusId: string;
  requireAudioConfirm?: boolean;
}) {
  const { t } = useTranslation('bonus');
  const { updateProfile } = useProfile();
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(() => splitIntoSections(parseArticleBlocks(text)), [text]);
  const alreadyRead = useMemo(() => isArticleRead(bonusId), [bonusId]);

  const [currentSection, setCurrentSection] = useState(0);
  const [audioConfirmed, setAudioConfirmed] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const isLastSection = currentSection >= sections.length - 1;
  const totalSections = sections.length;
  const progressPercent = Math.round(((currentSection + 1) / totalSections) * 100);

  function handleNext() {
    setCurrentSection((s) => s + 1);
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleBack() {
    setCurrentSection((s) => Math.max(0, s - 1));
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleReaction(id: string) {
    if (reaction) return;
    setReaction(id);
    saveArticleReaction(bonusId, id);

    if (!alreadyRead) {
      markArticleRead(bonusId);
      updateProfile((p) => earnCoins(p, 1, 'ARTICLE_READ'));
      setRewarded(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
  }

  if (sections.length === 0) return null;

  // Welcher Schritt kommt nach der letzten Sektion?
  const showAudioConfirm = isLastSection && requireAudioConfirm && !audioConfirmed;
  const showReactions   = isLastSection && (!requireAudioConfirm || audioConfirmed) && !reaction;
  const showDone        = isLastSection && (!requireAudioConfirm || audioConfirmed) && !!reaction;

  return (
    <div ref={containerRef} className="relative">

      {/* Fortschrittsbalken (nur bei >1 Sektionen) */}
      {totalSections > 1 && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>{t('articleReader.sectionOf', { current: currentSection + 1, total: totalSections })}</span>
            <span>{progressPercent} %</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-teal-500)] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Inhalt der aktuellen Sektion */}
      <ArticleBody blocks={sections[currentSection]} />

      {/* Navigation / Abschluss */}
      <div className="mt-6">
        {!isLastSection ? (
          /* Weiter-Button (+ optionaler Zurück-Button) */
          <div className="flex gap-2">
            {currentSection > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-400 font-semibold text-base hover:bg-slate-50 active:scale-[0.98] transition-all"
              >
                ←
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl bg-[var(--color-teal-600)] text-white font-extrabold text-base hover:bg-[var(--color-teal-700)] active:scale-[0.98] transition-all"
            >
              {t('articleReader.next')}
            </button>
          </div>

        ) : showAudioConfirm ? (
          /* "Gehört ✓"-Schritt für Audio-Artikel */
          <>
            {currentSection > 0 && (
              <button onClick={handleBack} className="mb-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                ← Zurück
              </button>
            )}
            <div className="rounded-2xl border-2 border-[var(--color-teal-200)] bg-[var(--color-teal-50)] p-5 text-center">
              <div className="text-2xl mb-2">🎧</div>
              <p className="text-sm font-extrabold text-[var(--color-teal-900)] mb-1">
                {t('articleReader.audioQuestion')}
              </p>
              <p className="text-xs text-slate-500 mb-4">
                {t('articleReader.audioHint')}
              </p>
              <button
                onClick={() => setAudioConfirmed(true)}
                className="w-full py-2.5 rounded-2xl bg-[var(--color-teal-600)] text-white font-extrabold text-sm hover:bg-[var(--color-teal-700)] active:scale-[0.98] transition-all"
              >
                {t('articleReader.audioConfirm')}
              </button>
            </div>
          </>

        ) : showReactions ? (
          /* Reaktions-Buttons */
          <>
            {currentSection > 0 && (
              <button onClick={handleBack} className="mb-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                ← Zurück
              </button>
            )}
            <div>
              <p className="text-sm font-extrabold text-slate-600 text-center mb-3">{t('articleReader.reactionPrompt')}</p>
              <div className="flex flex-col gap-2">
                {REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleReaction(r.id)}
                    className="w-full py-2.5 px-4 rounded-2xl border-2 border-[var(--color-teal-200)] bg-white text-sm font-semibold text-slate-800 hover:bg-[var(--color-teal-50)] active:scale-[0.98] transition-all"
                  >
                    {t(r.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </>

        ) : showDone ? (
          /* Gelesen!-Badge mit Konfetti */
          <div className="relative rounded-2xl bg-gradient-to-br from-[var(--color-teal-50)] via-white to-white border-2 border-[var(--color-teal-200)] p-5 text-center overflow-hidden">
            {showConfetti && <ConfettiBurst />}
            <div className="relative z-10">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-lg font-extrabold text-[var(--color-teal-900)]">{t('articleReader.doneTitle')}</div>
              <p className="text-sm text-slate-500 mt-1">{t('articleReader.doneBody')}</p>
              {rewarded && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 font-extrabold text-sm px-3 py-1.5 rounded-full">
                  <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-5 h-5 object-contain" /> {t('articleReader.coinReward')}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
