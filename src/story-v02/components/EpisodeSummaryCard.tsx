// src/story-v02/components/EpisodeSummaryCard.tsx
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../../common/assetUrl';

// ---------------------------------------------------------------------------
// Sticker mit Bounce-Pop-Animation
// ---------------------------------------------------------------------------

function StickerReveal({ src }: { src?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        transition: visible
          ? 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease'
          : 'none',
        transform: visible ? 'scale(1)' : 'scale(0.25)',
        opacity: visible ? 1 : 0,
      }}
    >
      {src ? (
        <img
          src={src}
          alt="Sticker"
          className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="text-7xl select-none">🏆</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feedback Push-up (Bottom Sheet) — Schritt 1: Emoji, Schritt 2: Sterne
// ---------------------------------------------------------------------------

type FeedbackReaction = 'neutral' | 'ok' | 'loved';
type SheetStep = 'emoji' | 'stars' | 'done';

const EMOJIS: { value: FeedbackReaction; emoji: string; label: string }[] = [
  { value: 'neutral', emoji: '😐', label: 'War okay' },
  { value: 'ok',     emoji: '🙂', label: 'Gut!' },
  { value: 'loved',  emoji: '🤩', label: 'Sehr gut!' },
];

function FeedbackSheet({ courseId }: { courseId: string }) {
  const feedbackKey = `story_feedback_${courseId}`;
  const appRatingKey = 'app_rating_general';

  // Einmal beim Mount lesen — verhindert dass localStorage.setItem in handleEmoji sofort null-Return auslöst.
  const [alreadyGiven] = useState(() => !!localStorage.getItem(feedbackKey));
  const [alreadyRated] = useState(() => !!localStorage.getItem(appRatingKey));
  const showStarsStep  = courseId === 'sp0e01' && !alreadyRated;

  const [visible,  setVisible]  = useState(false);
  const [step,     setStep]     = useState<SheetStep>('emoji');
  const [selected, setSelected] = useState<FeedbackReaction | null>(null);

  useEffect(() => {
    if (alreadyGiven) return;
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, [alreadyGiven]);

  if (alreadyGiven) return null;

  function handleEmoji(r: FeedbackReaction) {
    setSelected(r);
    localStorage.setItem(feedbackKey, r);
    const _paq = (window as any)._paq;
    const matomoLabel = r === 'neutral' ? 'okay' : r === 'ok' ? 'gut' : 'sehr_gut';
    if (_paq) _paq.push(['trackEvent', 'Story Feedback', courseId, matomoLabel]);
    if (showStarsStep) {
      setStep('stars');
    } else {
      setStep('done');
      setTimeout(() => setVisible(false), 1400);
    }
  }

  function handleStars(stars: number) {
    localStorage.setItem(appRatingKey, String(stars));
    const _paq = (window as any)._paq;
    if (_paq) _paq.push(['trackEvent', 'App Rating', courseId, String(stars), stars]);
    setStep('done');
    setTimeout(() => setVisible(false), 1400);
  }

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-[400] pointer-events-none" aria-live="polite">
      <div
        className={[
          'pointer-events-auto transition-transform duration-500 ease-out',
          visible ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        <div className="bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.18)] px-6 pt-4 pb-10">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

          {step === 'done' && (
            <div className="text-center py-3">
              <p className="text-base font-bold text-slate-800">
                {selected === 'loved' ? '🎉 Danke! Das freut uns sehr!' :
                 selected === 'ok'    ? '😊 Danke für dein Feedback!'  :
                                        '💬 Danke! Deine Meinung hilft uns.'}
              </p>
            </div>
          )}

          {step === 'emoji' && (
            <>
              <p className="text-center text-sm font-semibold text-slate-500 mb-5">
                Wie hat dir die Story gefallen?
              </p>
              <div className="flex justify-around items-end pb-1">
                {EMOJIS.map(({ value, emoji, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleEmoji(value)}
                    className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform hover:scale-110"
                    aria-label={label}
                  >
                    <span className="text-5xl leading-none select-none">{emoji}</span>
                    <span className="text-[11px] font-medium text-slate-500">{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'stars' && (
            <>
              <p className="text-center text-sm font-semibold text-slate-500 mb-1">
                Und wie gefällt dir Amy Surfwing insgesamt?
              </p>
              <p className="text-center text-xs text-slate-400 mb-5">Tippe auf einen Stern</p>
              <div className="flex justify-around pb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStars(star)}
                    className="text-4xl active:scale-90 transition-transform hover:scale-110 select-none"
                    aria-label={`${star} Sterne`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

type Props = {
  episodeTitle?: string;
  stickerImage?: string;
  bonusCoins?: number;
  chatName?: string;
  characterImg?: string;
  characterSays?: string;
  courseId?: string;
  onViewSticker: () => void;
  onContinue: () => void;
  onProfile?: () => void;
  onReplay?: () => void;
  betaMode?: boolean;
  continueLabel?: string;
};

export default function EpisodeSummaryCard({
  episodeTitle,
  stickerImage,
  bonusCoins = 5,
  chatName,
  characterImg,
  characterSays,
  courseId,
  onViewSticker,
  onContinue,
  onProfile,
  onReplay,
  betaMode = false,
  continueLabel,
}: Props) {
  const { t } = useTranslation('common');
  const name = chatName?.trim();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stickerSrc = stickerImage ? assetUrl(stickerImage) : undefined;

  return (
    <>
      <div
        className="my-4 mx-1 rounded-3xl overflow-hidden shadow-xl"
        style={{
          transition: 'transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.35s ease',
          transform: mounted ? 'scale(1)' : 'scale(0.85)',
          opacity: mounted ? 1 : 0,
          background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)',
        }}
      >
        <div className="relative overflow-hidden px-5 pt-6 pb-5">
          {/* Hintergrund-Sterne */}
          <div
            className="absolute inset-0 pointer-events-none select-none"
            aria-hidden
            style={{ fontSize: 18, lineHeight: 1, opacity: 0.18 }}
          >
            {['⭐', '✨', '🌟', '⭐', '✨', '🌟', '⭐', '✨'].map((s, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${[8, 20, 35, 50, 62, 75, 85, 92][i]}%`,
                  top: `${[10, 60, 20, 70, 15, 55, 30, 75][i]}%`,
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="relative flex flex-col items-center gap-4 text-center">
            <img
              src={assetUrl('media/story/characters/amy-256.webp')}
              alt="Amy"
              className="w-14 h-14 rounded-full object-cover object-top border-2 border-violet-300/60 shadow-lg"
            />
            <p className="text-base font-extrabold text-white leading-snug text-center px-2">
              {name
                ? t('reward.episodeDone', { name })
                : t('reward.episodeDoneNoName')}
            </p>

            <div className="text-2xl select-none tracking-widest">⭐ ⭐ ⭐ ⭐ ⭐</div>

            <div className="text-xs font-semibold text-violet-300 uppercase tracking-wide -mb-2">
              Dein Sticker:
            </div>
            <StickerReveal src={stickerSrc} />

            <div className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {episodeTitle ? `${episodeTitle} geschafft!` : 'Episode abgeschlossen!'}
            </div>

            {characterImg && characterSays && (
              <div className="flex items-center gap-2.5 w-full">
                <img
                  src={assetUrl(characterImg)}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0 border-2 border-violet-300/60"
                />
                <div className="bg-white/10 border border-white/20 rounded-2xl px-3 py-2 text-left">
                  <p className="text-xs font-semibold text-violet-100 leading-snug">
                    „{characterSays}"
                  </p>
                </div>
              </div>
            )}

            {bonusCoins > 0 && (
              <div className="flex items-center gap-1.5 rounded-2xl bg-amber-400/20 border border-amber-400/40 px-4 py-2">
                <img
                  src={assetUrl('media/story/ui/coin-128.webp')}
                  alt=""
                  className="w-5 h-5"
                />
                <span className="text-sm font-extrabold text-amber-200">
                  +{bonusCoins} Bonus-Coins
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2.5 w-full mt-1">
              {betaMode ? (
                <button
                  type="button"
                  onClick={onContinue}
                  className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-violet-900 shadow-md hover:bg-violet-50 active:scale-95 transition-transform"
                >
                  Weiter →
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onViewSticker}
                    className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-violet-900 shadow-md hover:bg-violet-50 active:scale-95 transition-transform"
                  >
                    Sticker ansehen ✨
                  </button>
                  <button
                    type="button"
                    onClick={onContinue}
                    className="w-full rounded-2xl border-2 border-violet-400 bg-transparent px-5 py-3 text-sm font-semibold text-violet-100 hover:bg-violet-800/50 active:scale-95 transition-transform"
                  >
                    {continueLabel ?? 'Zur Story-Liste →'}
                  </button>
                  {onProfile && (
                    <button
                      type="button"
                      onClick={onProfile}
                      className="w-full rounded-2xl border border-violet-400/40 bg-transparent px-5 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-800/30 active:scale-95 transition-transform"
                    >
                      Profil &amp; Story-Welt →
                    </button>
                  )}
                  {onReplay && (
                    <button
                      type="button"
                      onClick={onReplay}
                      className="mx-auto px-3 py-1.5 text-xs font-semibold text-violet-400/70 hover:text-violet-200 transition-colors"
                    >
                      Nochmals spielen ↺
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {!betaMode && courseId && <FeedbackSheet courseId={courseId} />}
    </>
  );
}
