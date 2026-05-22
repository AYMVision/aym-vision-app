// src/pages/Profile.tsx

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import BetaBanner from '../components/BetaBanner';
import { useProfile } from '../profile/useProfile';
import ProfileProgressCard from '../components/ProfileProgressCard';

import { assetUrl } from '../common/assetUrl';

import ParentGateDialog from '../components/ParentGateDialog';
import { useLongPress } from '../common/useLongPress';
import TransferExportPanel from '../components/TransferExportPanel';
import TransferStaleWarning from '../components/TransferStaleWarning';
import { STICKER_CATALOG } from '../progress/rewardCatalog';
import AvatarLookCircle from '../components/AvatarLookCircle';
import { THEME_META, THEME_ORDER } from '../competencies/themeMeta';
import ChallengeJournal from '../components/ChallengeJournal';

// ✅ typed location state (kein any)
type ProfileLocationState = {
  backTo?: string;
};

export default function Profile() {
  const { t } = useTranslation(['profile', 'themes']);
  const { profile, updateProfile } = useProfile();

  const navigate = useNavigate();
  const [parentGateOpen, setParentGateOpen] = useState(false);

  const lp = useLongPress(() => setParentGateOpen(true), 1200);

  const location = useLocation();
  const state = (location.state ?? null) as ProfileLocationState | null;
  const backTo = state?.backTo ?? '/stories';

  const coins = profile.wallet?.coins ?? 0;
  const coinHint =
    coins >= 50
      ? 'Amy ist beeindruckt. Was g\u00f6nnst du dir?'
      : coins >= 25
      ? 'M\u00f6chtest du schon etwas? Schau mal im Shop vorbei.'
      : coins > 0
      ? 'Noch ein paar bis zum ersten neuen Look.'
      : null;

  const earnedStickersAt = profile.progress?.earnedStickersAt ?? {};
  const TWENTY_FOUR_H = 24 * 60 * 60 * 1000;
  const newStickers = STICKER_CATALOG.filter(
    (s) => earnedStickersAt[s.id] && Date.now() - earnedStickersAt[s.id] < TWENTY_FOUR_H
  );

  const themePoints = profile.progress?.themePoints ?? {};
  const activeThemes = THEME_ORDER
    .map((id) => ({ meta: THEME_META[id], points: themePoints[id] ?? 0 }))
    .filter((entry) => entry.points > 0)
    .sort((a, b) => b.points - a.points);

  return (
    <Layout hideFooter backPath={backTo}>
      <BetaBanner />
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        {/* Page-Topbar */}
        <div className="mt-2 mb-2">
          <h1 className="text-2xl font-bold text-anthracite-950">
            {t('title')}
          </h1>
        </div>

        {/* Amy-Begrüßung — schlanker Streifen über dem Grid */}
        <div className="mb-4 flex items-center gap-2.5 px-1">
          <img
            src={assetUrl('media/story/characters/amy-256.webp')}
            alt="Amy"
            className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0 border-2 border-teal-100"
          />
          <span className="text-sm font-semibold text-[var(--color-teal-700)]">
            {profile.chatName?.trim()
              ? `Hallo ${profile.chatName.trim()}! Sch\u00f6n, dass du reinschaust.`
              : 'Hallo! Sch\u00f6n, dass du reinschaust.'}
          </span>
        </div>

        {/* Top: 4 Kästen */}
        <div className="grid gap-4 lg:grid-cols-2 items-stretch">
          {/* Kasten 1: Avatar + Coins */}
          <div className="p-4 rounded-2xl border border-black/5 bg-white shadow-sm h-full">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2 self-start">
                <Link
                  to="/avatar"
                  state={{ backTo: '/profile' }}
                  className="w-36 h-36 rounded-full border border-slate-200 bg-white overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <AvatarLookCircle
                    avatarBaseId={profile.avatarBaseId}
                    equipment={profile.equipment}
                    size={144}
                  />
                </Link>
              </div>

              {/* Name + Coins */}
              <div className="flex-1 min-w-0">
                {/* Name field */}
                <div className="mb-3">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wide mb-1">
                    Wie soll Amy dich nennen?
                  </div>
                  <input
                    value={profile.chatName ?? ''}
                    onChange={(e) =>
                      updateProfile((prev) => ({
                        ...prev,
                        chatName: e.target.value,
                        updatedAt: Date.now(),
                      }))
                    }
                    placeholder={t('name.placeholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-teal-200)] placeholder:text-slate-300"
                  />
                </div>

                {/* Coins */}
                <Link
                  to="/avatar"
                  state={{ backTo: '/profile', initialTab: 'shop' }}
                  className="mt-1 flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={assetUrl('media/story/ui/coin-128.webp')}
                    alt=""
                    className="w-12 h-12"
                    loading="lazy"
                  />
                  <div>
                    <div className="text-3xl font-extrabold">{coins}</div>
                    {coinHint && (
                      <div className="text-xs text-slate-500 leading-tight">{coinHint}</div>
                    )}
                  </div>
                </Link>
                <Link
                  to="/avatar"
                  state={{ backTo: '/profile' }}
                  className="mt-3 inline-flex items-center justify-center w-full rounded-xl px-3 py-2 text-xs font-extrabold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
                >
                  {t('shop.openCta')}
                </Link>

                {/* Sound-Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    updateProfile((prev) => ({
                      ...prev,
                      soundEnabled: prev.soundEnabled === false ? true : false,
                      updatedAt: Date.now(),
                    }))
                  }
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full rounded-xl px-3 py-2 text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                  aria-label={profile.soundEnabled === false ? t('sound.enable') : t('sound.disable')}
                >
                  <span>{profile.soundEnabled === false ? '🔕' : '🔔'}</span>
                  <span>{profile.soundEnabled === false ? t('sound.off') : t('sound.on')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Kasten 2: Fortschritt */}
          <div className="p-4 rounded-2xl border border-black/5 bg-white shadow-sm h-full">
            <ProfileProgressCard noCard />
          </div>

        </div>

        {/* Stats-Kachel */}
        {(() => {
          const streak = profile.progress?.weeklyStreak?.currentStreak ?? 0;
          const daysPlayed = profile.progress?.activity?.totalPlayedDays ?? 0;
          const amicsRead = Object.keys(profile.progress?.completedChapters ?? {}).length;
          const totalEarned = profile.wallet?.totalEarned ?? 0;
          if (daysPlayed === 0 && amicsRead === 0) return null;
          return (
            <div className="mt-4 p-4 rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl">🔥</span>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">{streak}</span>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Tage am Stück</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl">📖</span>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">{amicsRead}</span>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Amics gelesen</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl">📅</span>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">{daysPlayed}</span>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Tage gespielt</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-6 h-6" />
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">{totalEarned}</span>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Coins erspielt</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Neue Sticker — direkt unter den Top-Kästen, prominent */}
        {newStickers.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={assetUrl('media/story/characters/amy-256.webp')}
                  alt="Amy"
                  className="w-7 h-7 rounded-full object-cover object-top flex-shrink-0 border-2 border-amber-200"
                />
                <div className="text-sm font-extrabold text-amber-900">
                  Amy hat etwas für dich:
                </div>
              </div>
              <Link
                to="/album"
                state={{ backTo: '/profile' }}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900"
              >
                {t('rewards.open')}
              </Link>
            </div>

            {/* ≤2: side by side centered; ≥3: horizontal scroll */}
            <div className={newStickers.length <= 2
              ? 'flex justify-center gap-8'
              : 'flex gap-4 overflow-x-auto pb-1'
            }>
              {newStickers.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap2 flex-shrink-0">
                  <img
                    src={assetUrl(s.image)}
                    alt={s.title ?? ''}
                    className={newStickers.length === 1 ? 'w-40 h-40 object-contain' : 'w-24 h-24 object-contain'}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = assetUrl('media/stickers/placeholder-512.webp');
                    }}
                  />
                  <div className="text-xs font-semibold text-amber-900 text-center max-w-[110px] leading-tight">
                    {s.title ?? s.titleKey}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenge-Journal */}
        <ChallengeJournal />

        {/* Story-Welt — volle Breite unter den beiden Kästen */}
        <div className="mt-4 p-4 rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <div className="text-sm font-semibold text-anthracite-900">
                {t('bonus.hub.title')}
              </div>
              <p className="mt-0.5 text-xs text-slate-600">
                {t('bonus.hub.subtitle')}
              </p>
            </div>
          </div>

          {/* Bonus-Kacheln */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Link
              to="/album"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-4 hover:shadow-md transition"
              aria-label={t('album.aria')}
            >
              <div className="text-3xl">⭐</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('album.title')}
              </div>
            </Link>

            <Link
              to="/newspaper"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-4 hover:shadow-md transition"
              aria-label={t('bonus.hub.newspaper.aria')}
            >
              <div className="text-3xl">📰</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('bonus.hub.newspaper.title')}
              </div>
            </Link>

            <Link
              to="/diaries"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 hover:shadow-md transition"
              aria-label={t('bonus.hub.diaries.aria')}
            >
              <div className="text-3xl">📔</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('bonus.hub.diaries.title')}
              </div>
            </Link>

            <Link
              to="/cards"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-4 hover:shadow-md transition"
              aria-label={t('bonus.hub.cards.aria')}
            >
              <div className="text-3xl">🎴</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('bonus.hub.cards.title')}
              </div>
            </Link>

            <Link
              to="/lexikon"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-4 hover:shadow-md transition"
              aria-label={t('bonus.hub.lexikon.aria')}
            >
              <div className="text-3xl">📚</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('bonus.hub.lexikon.title')}
              </div>
            </Link>
          </div>
        </div>

        {/* Transfer stale warning (only in PWA mode when link is old) */}
        <div className="mt-4">
          <TransferStaleWarning />
        </div>

        {/* Transfer-Link — Spielstand sichern */}
        <details className="mt-0 group rounded-2xl border border-slate-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 select-none">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔗</span>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {t('transfer.title')}
                </div>
                <div className="text-xs text-slate-500">
                  {t('transfer.subtitle')}
                </div>
              </div>
            </div>
            <span className="text-slate-400 text-sm group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="border-t border-slate-100 px-5 py-5">
            <TransferExportPanel />
          </div>
        </details>

        {/* Hidden entry (kid-safe, low attention) */}
        <div
          className="mt-6 text-center text-xs text-slate-400 select-none touch-manipulation"
          {...lp}
          role="button"
          tabIndex={0}
          aria-label={t('adult.hiddenAria')}
          style={{
            WebkitUserSelect: 'none',
            userSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
        >
        </div>

      </div>
    </Layout>
  );
}
