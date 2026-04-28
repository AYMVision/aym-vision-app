// src/pages/Profile.tsx

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import { useProfile } from '../profile/useProfile';
import ProfileProgressCard from '../components/ProfileProgressCard';

import { assetUrl } from '../common/assetUrl';

import ParentGateDialog from '../components/ParentGateDialog';
import { useLongPress } from '../common/useLongPress';
import { STICKER_CATALOG } from '../progress/rewardCatalog';
import AvatarLookCircle from '../components/AvatarLookCircle';
import { THEME_META, THEME_ORDER } from '../competencies/themeMeta';

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
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        {/* Page-Topbar */}
        <div className="mt-2 mb-4">
          <h1 className="text-2xl font-bold text-anthracite-950">
            {t('title', { defaultValue: 'Profil' })}
          </h1>
        </div>

        {/* Top: 4 Kästen */}
        <div className="grid gap-4 lg:grid-cols-2 items-stretch">
          {/* Kasten 1: Avatar + Coins */}
          <div className="p-4 rounded-2xl border border-black/5 bg-white shadow-sm h-full">
            <div className="flex items-start gap-4">
              {/* Avatar + Button */}
              <div className="flex flex-col items-center gap-2 self-start">
                <Link
                  to="/avatar"
                  state={{ backTo: '/profile' }}
                  className="w-50 h-50 rounded-full border border-slate-200 bg-white overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <AvatarLookCircle
                    avatarBaseId={profile.avatarBaseId}
                    equipment={profile.equipment}
                    size={200}
                  />
                </Link>
              </div>

              {/* Name + Coins */}
              <div className="flex-1 min-w-0">
                {/* Name field */}
                <div className="mb-3">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wide mb-1">
                    {t('name.label', { defaultValue: 'Dein Name' })}
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
                    placeholder={t('name.placeholder', { defaultValue: 'Wie soll ich dich nennen?' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-teal-200)] placeholder:text-slate-300"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    {t('name.hint', { defaultValue: 'So wirst du in der Story genannt.' })}
                  </p>
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
                  <div className="text-3xl font-extrabold">
                    {profile.wallet?.coins ?? 0}
                  </div>
                </Link>
                <Link
                  to="/avatar"
                  state={{ backTo: '/profile' }}
                  className="mt-3 inline-flex items-center justify-center w-full rounded-xl px-3 py-2 text-xs font-extrabold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
                >
                  {t('shop.openCta', { defaultValue: 'Avatar ändern'})}
                </Link>
              </div>
            </div>
          </div>

          {/* Kasten 2: Fortschritt */}
          <div className="p-4 rounded-2xl border border-black/5 bg-white shadow-sm h-full">
            <ProfileProgressCard noCard />
          </div>

        </div>

        {/* Bonuswelt — volle Breite unter den beiden Kästen */}
        <div className="mt-4 p-4 rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <div className="text-sm font-semibold text-anthracite-900">
                {t('bonus.hub.title', { defaultValue: 'Bonuswelt' })}
              </div>
              <p className="mt-0.5 text-xs text-slate-600">
                {t('bonus.hub.subtitle', { defaultValue: 'Extras aus der Story – zum Sammeln & Entdecken' })}
              </p>
            </div>
          </div>

          {/* Bonus-Kacheln */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/album"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-4 hover:shadow-md transition"
              aria-label={t('album.aria', { defaultValue: 'Sticker-Album öffnen' })}
            >
              <div className="text-3xl">⭐</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('album.title', { defaultValue: 'Sticker-Album' })}
              </div>
            </Link>

            <Link
              to="/newspaper"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-4 hover:shadow-md transition"
              aria-label={t('bonus.hub.newspaper.aria', { defaultValue: 'Schülerzeitung öffnen' })}
            >
              <div className="text-3xl">📰</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('bonus.hub.newspaper.title', { defaultValue: 'Schülerzeitung' })}
              </div>
            </Link>

            <Link
              to="/diaries"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 hover:shadow-md transition"
              aria-label={t('bonus.hub.diaries.aria', { defaultValue: 'Tagebuch öffnen' })}
            >
              <div className="text-3xl">📔</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('bonus.hub.diaries.title', { defaultValue: 'Tagebuch' })}
              </div>
            </Link>

            <Link
              to="/cards"
              state={{ backTo: '/profile' }}
              className="rounded-2xl border border-black/5 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-4 hover:shadow-md transition"
              aria-label={t('bonus.hub.cards.aria', { defaultValue: 'Sammelkarten öffnen' })}
            >
              <div className="text-3xl">🎴</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
                {t('bonus.hub.cards.title', { defaultValue: 'Freundebuch' })}
              </div>
            </Link>
          </div>
        </div>

        {newStickers.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 shadow-sm">
            <div className="text-sm font-extrabold text-amber-900 mb-3">
              🌟 {t('rewards.newTitle', { defaultValue: 'Neue Sticker für dich!' })}
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              {newStickers.map((s) => (
                <img
                  key={s.id}
                  src={assetUrl(s.image)}
                  alt={s.title}
                  className="w-40 h-40 object-contain rounded-xl bg-white/60 p-1"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = assetUrl('media/stickers/placeholder-512.webp');
                  }}
                />
              ))}
            </div>

            <Link
              to="/album"
              state={{ backTo: '/profile' }}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900"
            >
              {t('rewards.open', { defaultValue: 'Im Album ansehen →' })}
            </Link>
          </div>
        )}

        {/* Hidden entry (kid-safe, low attention) */}
<div
  className="mt-6 text-center text-xs text-slate-400 select-none touch-manipulation"
  {...lp}
  role="button"
  tabIndex={0}
  aria-label={t('adult.hiddenAria', { defaultValue: 'Open adult area' })}
  style={{
    WebkitUserSelect: 'none',
    userSelect: 'none',
    WebkitTouchCallout: 'none', // iOS: verhindert Callout
  }}
>

  {t('adult.hiddenVersion', { defaultValue: 'Version {{version}}', version: '0.0.0' })}
  <span className="ml-2 opacity-70">
    {t('adult.footerHint', { defaultValue: 'Adults: press and hold' })}
  </span>
</div>

<ParentGateDialog
  open={parentGateOpen}
  onClose={() => setParentGateOpen(false)}
  onUnlocked={() => navigate('/adult-settings')}
/>



      </div>
    </Layout>
  );
}
