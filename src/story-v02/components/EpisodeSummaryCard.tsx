// src/story-v02/components/EpisodeSummaryCard.tsx
// Abschluss-Karte die direkt im Messenger-Feed erscheint (kein Fullscreen-Modal).
// Gleicher Look wie die ehemalige EpisodeCelebrationModal, aber als Inline-Karte.

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
  betaMode?: boolean;
  continueLabel?: string;
};

type FeedbackReaction = 'begeistert' | 'ok' | 'neutral';

function trackFeedback(courseId: string, reaction: FeedbackReaction) {
  const _paq = (window as any)._paq;
  if (_paq) _paq.push(['trackEvent', 'Story Feedback', courseId, reaction]);
}

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
  betaMode = false,
  continueLabel,
}: Props) {
  const { t } = useTranslation('common');
  const name = chatName?.trim();
  const [mounted, setMounted] = useState(false);

  const feedbackKey = courseId ? `story_feedback_${courseId}` : null;
  const alreadyGiven = feedbackKey ? !!localStorage.getItem(feedbackKey) : true;
  const [reaction, setReaction] = useState<FeedbackReaction | null>(null);
  const [feedbackDone, setFeedbackDone] = useState(alreadyGiven);

  // Zweiter Schritt: allgemeine Amy Surfwing Bewertung (nur für sp0e01)
  const isSpecial = courseId === 'sp0e01';
  const appRatingKey = 'app_rating_general';
  const appRatingAlreadyGiven = !!localStorage.getItem(appRatingKey);
  const [appRating, setAppRating] = useState<number | null>(null);
  const [appRatingDone, setAppRatingDone] = useState(appRatingAlreadyGiven);
  const [showAppRating, setShowAppRating] = useState(false);

  function handleReaction(r: FeedbackReaction) {
    setReaction(r);
    setFeedbackDone(true);
    if (feedbackKey) localStorage.setItem(feedbackKey, r);
    if (courseId) trackFeedback(courseId, r);
    if (isSpecial && !appRatingAlreadyGiven) setShowAppRating(true);
  }

  function handleAppRating(stars: number) {
    setAppRating(stars);
    setAppRatingDone(true);
    localStorage.setItem(appRatingKey, String(stars));
    const _paq = (window as any)._paq;
    if (_paq) _paq.push(['trackEvent', 'App Rating', 'sp0e01', String(stars)]);
  }

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stickerSrc = stickerImage ? assetUrl(stickerImage) : undefined;

  return (
    <div
      className="my-4 mx-1 rounded-3xl overflow-hidden shadow-xl"
      style={{
        transition: 'transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.35s ease',
        transform: mounted ? 'scale(1)' : 'scale(0.85)',
        opacity: mounted ? 1 : 0,
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)',
      }}
    >
      {/* Konfetti-Dekoration */}
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
          {/* Amy — Übergabe-Moment, zentriert und prominent */}
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

          {/* Stars */}
          <div className="text-2xl select-none tracking-widest">⭐ ⭐ ⭐ ⭐ ⭐</div>

          {/* Sticker mit Übergabe-Label */}
          <div className="text-xs font-semibold text-violet-300 uppercase tracking-wide -mb-2">
            Dein Sticker:
          </div>
          <StickerReveal src={stickerSrc} />

          {/* Title */}
          <div className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            {episodeTitle ? `${episodeTitle} geschafft!` : 'Episode abgeschlossen!'}
          </div>

          {/* Charakter-Moment */}
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

          {/* Story Feedback */}
          {!betaMode && courseId && (
            <div className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-center">
              {feedbackDone ? (
                <p className="text-sm font-semibold text-violet-100">
                  {reaction === 'begeistert' ? '🎉 Danke! Das freut uns sehr!' :
                   reaction === 'ok' ? '😊 Danke für dein Feedback!' :
                   '💬 Danke! Deine Meinung hilft uns.'}
                </p>
              ) : (
                <>
                  <p className="text-xs font-semibold text-violet-300 mb-2">Wie hat dir die Story gefallen?</p>
                  <div className="flex justify-center gap-4">
                    {(['begeistert', 'ok', 'neutral'] as FeedbackReaction[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleReaction(r)}
                        className="text-3xl active:scale-90 transition-transform hover:scale-110"
                        aria-label={r}
                      >
                        {r === 'begeistert' ? '😍' : r === 'ok' ? '🙂' : '😐'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Schritt 2: Amy Surfwing Gesamt-Bewertung (nur sp0e01, nach Emoji-Antwort) */}
          {!betaMode && isSpecial && showAppRating && (
            <div className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-center">
              {appRatingDone ? (
                <p className="text-sm font-semibold text-violet-100">
                  {(appRating ?? 0) >= 4 ? '⭐ Super, danke! Das bedeutet uns viel.' : '💬 Danke für deine ehrliche Meinung!'}
                </p>
              ) : (
                <>
                  <p className="text-xs font-semibold text-violet-300 mb-2">Und wie gefällt dir Amy Surfwing insgesamt?</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleAppRating(star)}
                        className="text-3xl active:scale-90 transition-transform hover:scale-110"
                        aria-label={`${star} Sterne`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Bonus Coins Badge */}
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

          {/* Buttons */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
