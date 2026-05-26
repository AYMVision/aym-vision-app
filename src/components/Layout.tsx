// src/components/Layout.tsx
// Layout ist der UI-Rahmen der App:
// - Sticky Header (Branding, Navigation, Profil/Coins, Sprache, optional Back)
// - Mobile Drawer Navigation
// - Main Content Slot (children)
// - Optionaler Footer (z. B. ausgeblendet in Stories)

import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '../common/utils';
import { assetUrl } from '../common/assetUrl';

import Footer from './Footer';
import { LanguageSelector } from './LanguageSelector';
import AvatarLookCircle from '../components/AvatarLookCircle';

import { useProfile } from '../profile/useProfile';
import { useRewardFx } from '../progress/rewardFx';
import SmartImage from './SmartImage';
import BottomNav from './BottomNav';


type LayoutProps = {
  /** Seitentitel (Header / Dokumenttitel) */
  title?: string;
  children: ReactNode;
  /** Wenn gesetzt: Back-Button im Header (Desktop + Mobile) */
  backPath?: string;
  /** Wenn true: Footer verstecken (zusätzlich zu Auto-Hide auf /stories) */
  hideFooter?: boolean;
  /** Wenn true: Header + Drawer verstecken (für Modals/Overlays) */
  hideHeader?: boolean;
  /** Wenn true: h-[100dvh] overflow-hidden statt min-h-screen (für Story-Seiten mit internem Scroll) */
  fullHeight?: boolean;
};


export default function Layout({ children, backPath, hideFooter, hideHeader, fullHeight }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  // i18n: getrennte Translator-Funktionen pro Namespace
const { t: tNav } = useTranslation('navigation');
const { t: tLayout } = useTranslation('layout');
const { t: tCommon } = useTranslation('common');

  // UI state: Mobile Navigation Drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  // Profile (Avatar + Coins)
  const { profile } = useProfile();
  const coins = profile.wallet.coins;

  // Reward FX targets (Coin-Fly Animation)
  const { walletElRef, profileElRef } = useRewardFx();

  // Mobile Bottom Nav: nur für kinderrelevante Bereiche zeigen
  const showBottomNav =
    !hideHeader &&
    location.pathname !== '/' &&
    !location.pathname.startsWith('/parents') &&
    !location.pathname.startsWith('/concept') &&
    !location.pathname.startsWith('/about') &&
    !location.pathname.startsWith('/privacy') &&
    !location.pathname.startsWith('/faq') &&
    !location.pathname.startsWith('/adult-settings');

  // Footer nur in Story-Spielrouten (mit ID) verstecken, nicht auf der Übersichtsseite
  const isStoryPlayerRoute =
    /^\/stories(-v02)?\/[^/]+/.test(location.pathname);
  const isWelcomeRoute = location.pathname === '/';
  const shouldHideFooter = Boolean(hideFooter) || isStoryPlayerRoute || (showBottomNav && !isWelcomeRoute);

// Navigation Links (Desktop + Mobile)
const desktopLinks = useMemo(
  () => [
    { to: '/', label: tNav('home') as string },
    { to: '/stories', label: tNav('stories') as string },
    { to: '/parents', label: tNav('parents') as string },
    { to: '/about', label: tNav('about') as string },
    { to: '/concept', label: tNav('concept') as string },
  ],
  [tNav]
);

const mobilePrimaryLinks = useMemo(
  () => [
    { to: '/', label: tNav('home') as string },
    { to: '/stories', label: tNav('storiesKids', { defaultValue: 'Amy Surfwing' }) as string },
    { to: '/diaries', label: tNav('diaries', { defaultValue: 'Tagebuch' }) as string },
    { to: '/newspaper', label: tNav('newspaper', { defaultValue: 'Schülerzeitung' }) as string },
    { to: '/album', label: tNav('album', { defaultValue: 'Sticker' }) as string },
    { to: '/profile', label: tNav('profile') as string },
  ],
  [tNav]
);

const mobileSecondaryLinks = useMemo(
  () => [
    { to: '/parents', label: tNav('parents') as string },
    { to: '/about', label: tNav('about') as string },
    { to: '/concept', label: tNav('concept') as string },
  ],
  [tNav]
);

// Active Link Check (inkl. Hash)
const isActive = (to: string) => {
  const currentPath = location.pathname;
  const targetPath = to.split('#')[0];

  if (targetPath === '/') return currentPath === '/';

  return currentPath.startsWith(targetPath) &&
    (to.includes('#') ? location.hash === '#' + to.split('#')[1] : true);
};

  const showBack = Boolean(backPath);

  function goBack() {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate(backPath!);
    }
  }

  // UX: Drawer schließt automatisch bei Route-Wechsel
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash, location.search, hideHeader]);

  // UX: Scroll-to-top bei neuen Seitenaufrufen (PUSH/REPLACE), nicht bei Zurück-Navigation (POP).
  // fullHeight-Seiten (Story-Player) verwalten ihren eigenen internen Scroll.
  useEffect(() => {
    if (fullHeight) return;
    if (navigationType === 'POP') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.search, navigationType, fullHeight]);

  // UX: Drawer schließt bei Desktop-Width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={cn(fullHeight ? 'h-[100dvh] overflow-hidden' : 'min-h-screen', 'bg-[var(--color-teal-300)] flex flex-col [overflow-x:clip]')}>
      {/* =========================
          HEADER (Sticky)
         ========================= */}
      {!hideHeader && (
  <header className="w-full sticky top-0 z-50 bg-white shadow-md">
        <div className="flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          {/* ===== Mobile Header ===== */}
          <div className="flex md:hidden w-full items-center justify-between">
            {/* Left: Back (optional) */}
            <div className="flex-1">
              {showBack && (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-2 py-1 text-sm font-semibold text-[var(--color-teal-900)] hover:text-[var(--color-teal-400)]"
                  aria-label={tCommon('back')}
                >
                  ← {tCommon('back')}
                </button>
              )}
            </div>

            {/* Center: Brand */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <SmartImage
  alt={tLayout('logoAlt')}
  className="w-10 h-10 object-contain object-center"
  sizes="40px"
  avif={[
    { src: assetUrl('media/ui/brand/logo-256.avif'), w: 256 },
    { src: assetUrl('media/ui/brand/logo-512.avif'), w: 512 },
    { src: assetUrl('media/ui/brand/logo-1024.avif'), w: 1024 },
  ]}
  webp={[
    { src: assetUrl('media/ui/brand/logo-256.webp'), w: 256 },
    { src: assetUrl('media/ui/brand/logo-512.webp'), w: 512 },
    { src: assetUrl('media/ui/brand/logo-1024.webp'), w: 1024 },
  ]}
  fallback={assetUrl('media/ui/brand/logo-512.webp')}
/>

              </div>

              <div>
                <div className="font-semibold text-[var(--color-teal-900)] text-sm">
                  {tLayout('brandTitle')}
                </div>
                <div className="text-xs text-[var(--color-teal-500)]">
                  {tLayout('brandTagline')}
                </div>
              </div>
            </Link>

            {/* Right spacer */}
            <div className="flex-1" />

            {/* Mobile: Coins → Shop, Avatar → Profile */}
            <div className="flex items-center gap-2 p-1 shrink-0">
              <Link
                to="/avatar"
                state={{ backTo: location.pathname + location.search + location.hash, initialTab: 'shop' }}
                aria-label={tLayout('openShop', { defaultValue: 'Shop öffnen' })}
              >
                <div
                  ref={walletElRef}
                  className="px-2 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <img
                    src={assetUrl('media/story/ui/coin-128.webp')}
                    alt=""
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="whitespace-nowrap">{coins}</span>
                </div>
              </Link>

              <Link
                to="/profile"
                state={{ backTo: location.pathname + location.search + location.hash }}
                aria-label={tNav('openProfile')}
              >
                <div
                  ref={profileElRef}
                  data-reward-target="profile-avatar"
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white overflow-hidden"
                >
                  <AvatarLookCircle
                    avatarBaseId={profile.avatarBaseId}
                    equipment={profile.equipment}
                    size={40}
                    className="border border-slate-200 bg-white shadow-sm"
                  />
                </div>
              </Link>
            </div>

            {/* Mobile: Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-[var(--color-teal-900)] hover:text-[var(--color-teal-400)]"
              aria-label={tNav('openMenu')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          {/* ===== Desktop Brand (left) ===== */}
          <div className="hidden md:flex items-center mr-4 gap-3">
            {showBack && (
              <button
                type="button"
                onClick={goBack}
                className="px-2 py-1 text-sm font-semibold text-[var(--color-teal-900)] hover:text-[var(--color-teal-400)]"
                aria-label={tCommon('back')}
              >
                ← {tCommon('back')}
              </button>
            )}

            <Link to="/">
              <SmartImage
  alt={tLayout('logoAlt')}
  className="h-10 w-auto"
  sizes="40px"
  avif={[
    { src: assetUrl('media/ui/brand/logo-256.avif'), w: 256 },
    { src: assetUrl('media/ui/brand/logo-512.avif'), w: 512 },
    { src: assetUrl('media/ui/brand/logo-1024.avif'), w: 1024 },
  ]}
  webp={[
    { src: assetUrl('media/ui/brand/logo-256.webp'), w: 256 },
    { src: assetUrl('media/ui/brand/logo-512.webp'), w: 512 },
    { src: assetUrl('media/ui/brand/logo-1024.webp'), w: 1024 },
  ]}
  fallback={assetUrl('media/ui/brand/logo-512.webp')}
/>
            </Link>

          </div>

{/* ===== Desktop Nav ===== */}
<nav className="hidden md:flex items-center space-x-1">
  {desktopLinks.map((link) => (
    <Link
      key={link.to}
      to={link.to}
      className={cn(
        'px-4 py-2 font-medium transition-colors duration-200',
        isActive(link.to)
          ? 'text-[var(--color-teal-400)]'
          : 'text-[var(--color-teal-900)] hover:text-[var(--color-teal-300)]'
      )}
    >
      {link.label}
    </Link>
  ))}
</nav>

          {/* ===== Desktop Right ===== */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-4">
            {/* Wallet target for Coin-Fly */}
            <Link
              to="/avatar"
              state={{ backTo: location.pathname + location.search + location.hash, initialTab: 'shop' }}
              aria-label={tLayout('openShop', { defaultValue: 'Shop öffnen' })}
            >
              <div
                ref={walletElRef}
                className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-sm font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={assetUrl('media/story/ui/coin-128.webp')}
                  alt=""
                  className="w-5 h-5"
                />
                <span>{coins}</span>
              </div>
            </Link>

            <Link
              to="/profile"
              state={{ backTo: location.pathname + location.search + location.hash }}
              aria-label={tNav('openProfile')}
            >
              <div className="w-11 h-11 rounded-full border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
<AvatarLookCircle
  avatarBaseId={profile.avatarBaseId}
  equipment={profile.equipment}
  size={44}
  className="border border-slate-200 bg-white"
/>
              </div>
            </Link>

            <LanguageSelector />
          </div>
        </div>
      </header>
)}
      {/* =========================
          MOBILE DRAWER
         ========================= */}
{!hideHeader && (
  <div
    className={cn(
      'fixed top-0 right-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300',
      isMenuOpen ? 'translate-x-0' : 'translate-x-full'
    )}
    role="dialog"
    aria-modal="true"
    aria-label={tLayout('drawerTitle')}
  > 
        <div className="flex items-center justify-end p-4 bg-[var(--color-teal-500)] shadow-sm h-16 sm:h-20">
          <div className="flex-1" />

          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden">
              <SmartImage
  alt={tLayout('logoAlt')}
  className="w-10 h-10 object-contain object-center"
  sizes="40px"
  avif={[
    { src: assetUrl('media/ui/brand/logo-256.avif'), w: 256 },
    { src: assetUrl('media/ui/brand/logo-512.avif'), w: 512 },
    { src: assetUrl('media/ui/brand/logo-1024.avif'), w: 1024 },
  ]}
  webp={[
    { src: assetUrl('media/ui/brand/logo-256.webp'), w: 256 },
    { src: assetUrl('media/ui/brand/logo-512.webp'), w: 512 },
    { src: assetUrl('media/ui/brand/logo-1024.webp'), w: 1024 },
  ]}
  fallback={assetUrl('media/ui/brand/logo-512.webp')}
/>

            </div>
            <div>
              <div className="font-semibold text-white text-lg">
                {tLayout('drawerTitle')}
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-white hover:text-gray-100"
            aria-label={tNav('closeMenu')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col p-4">
          <div className="text-xs font-semibold text-slate-400 px-4 mb-2">
            {tNav('kids', { defaultValue: 'Für Kinder' })}
          </div>

<div className="flex flex-col space-y-1">
  {mobilePrimaryLinks.map((link) => (
    <Link
      key={link.to}
      to={link.to}
      className={cn(
        'block px-4 py-3 text-base font-medium rounded-2xl transition-colors duration-200',
        isActive(link.to)
          ? 'bg-[var(--color-teal-50)] text-[var(--color-teal-600)] border border-[var(--color-teal-100)]'
          : 'text-[var(--color-teal-900)] hover:bg-slate-50 hover:text-[var(--color-teal-400)] border border-transparent'
      )}
      onClick={() => setIsMenuOpen(false)}
    >
      {link.label}
    </Link>
  ))}
</div>

          <div className="mt-6 text-xs font-semibold text-slate-400 px-4 mb-2">
            {tNav('parents', { defaultValue: 'Für Eltern' })}
          </div>

          <div className="flex flex-col space-y-1">
            {mobileSecondaryLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'block px-4 py-3 text-base font-medium rounded-2xl transition-colors duration-200',
                  isActive(link.to)
                    ? 'bg-[var(--color-teal-50)] text-[var(--color-teal-600)]'
                    : 'text-[var(--color-teal-900)] hover:bg-slate-50 hover:text-[var(--color-teal-400)]'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <LanguageSelector className="px-4 py-2" />
          </div>
        </nav>
      </div>
      )}

      {/* =========================
          MAIN
         ========================= */}
      <main
        className={cn(
          'flex-1 flex flex-col items-center justify-start z-0',
          fullHeight && 'min-h-0',
          showBottomNav ? 'pb-24 md:pb-0' : ''
        )}
      >
        {children}
      </main>

      {/* =========================
          MOBILE BOTTOM NAV
         ========================= */}
      {showBottomNav && (
        <BottomNav backTo={location.pathname + location.search + location.hash} />
      )}

      {/* =========================
          FOOTER
         ========================= */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}
