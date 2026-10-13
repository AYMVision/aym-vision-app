import './polyfills';
import { createContext, lazy, Suspense, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import type { Location } from 'react-router-dom';

// Exposes whether a modal overlay is currently open (backgroundLocation is set).
// StoryV02 reads this to detect when a modal has just closed and scroll should be restored.
export const BackgroundLocationContext = createContext<Location | null | undefined>(undefined);

import { registerSW } from 'virtual:pwa-register';
import { ProfileProvider } from './profile/useProfile';
import { initSoundPlayer } from './common/soundPlayer';
import { needsMigration, migrateToMultiProfile } from './profile/profileIndex';
import { initIdentity } from './identity/useIdentity';

initSoundPlayer();
import { RewardFxProvider } from './progress/rewardFx';
import CoinOverlay from './progress/CoinOverlay';
import RouteI18nLoader from './i18n/RouteI18nLoader';
import ScrollToHash from './common/utils.ts';
import ModalShell from './components/ModalShell';
import LandscapeOverlay from './components/LandscapeOverlay';
import { clearAmicBadge } from './notifications/reminderService';

// Eager — always needed immediately
import Welcome from './pages/Welcome.tsx';
import NotFound from './pages/NotFound.tsx';

// Lazy — loaded only when the route is visited
const Stories        = lazy(() => import('./pages/Stories'));
const StoryV02Page   = lazy(() => import('./pages/StoryV02'));
const StoryEpisodeOverview = lazy(() => import('./pages/StoryEpisodeOverview'));
const About          = lazy(() => import('./pages/About'));
const Profile        = lazy(() => import('./pages/Profile'));
const AvatarPicker   = lazy(() => import('./pages/AvatarPicker'));
const StickerAlbum   = lazy(() => import('./pages/StickerAlbum'));
const AdultSettings  = lazy(() => import('./pages/AdultSettings'));
const ForParents     = lazy(() => import('./pages/ForParents'));
const Concept        = lazy(() => import('./pages/Concept'));
const Privacy        = lazy(() => import('./pages/Privacy'));
const Impressum      = lazy(() => import('./pages/Impressum'));
const FAQ            = lazy(() => import('./pages/FAQ'));
const Cards          = lazy(() => import('./pages/Cards'));
const CardDetail     = lazy(() => import('./pages/CardDetail'));
const Diaries        = lazy(() => import('./pages/Diaries'));
const DiaryBook      = lazy(() => import('./pages/DiaryBook'));
const Newspaper      = lazy(() => import('./pages/Newspaper'));
const NewspaperArticle = lazy(() => import('./pages/NewspaperArticle'));
const Lexikon          = lazy(() => import('./pages/Lexikon'));
const Onboarding       = lazy(() => import('./pages/Onboarding'));
const TransferPage     = lazy(() => import('./pages/TransferPage'));
const InstallGuide     = lazy(() => import('./pages/InstallGuide'));
const BetaPage         = lazy(() => import('./pages/BetaPage'));
const StudioPage          = lazy(() => import('./pages/StudioPage'));
const StudioViewPage      = lazy(() => import('./pages/StudioViewPage'));
const StudioStoriesPage   = lazy(() => import('./pages/StudioStoriesPage'));
const StudioEducatorsPage = lazy(() => import('./pages/StudioEducatorsPage'));
const SeasonFinale        = lazy(() => import('./pages/SeasonFinale'));
const ParentSetupWizard     = lazy(() => import('./pages/ParentSetupWizard'));
const RedeemVoucher         = lazy(() => import('./shop/RedeemVoucher'));
const StripePurchaseReturn  = lazy(() => import('./shop/StripePurchaseReturn'));
const VoucherAdmin          = lazy(() => import('./pages/VoucherAdmin'));
const TommiAward            = lazy(() => import('./pages/TommiAward'));
const Presse                = lazy(() => import('./pages/Presse'));
const TestSettings   = import.meta.env.DEV ? lazy(() => import('./pages/TestSettings')) : null;
const DevLab         = import.meta.env.DEV ? lazy(() => import('./pages/DevLab')) : null;

const queryClient = new QueryClient();

function ScrollRestorationManual() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
  return null;
}

function StoryV02ChapterRoute() {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  return <StoryV02Page key={`${courseId}/${chapterId}`} />;
}

const COURSE_NAMES: Record<string, string> = {
  's1e01': 'Episode 1',
  's1e02': 'Episode 2',
  's1e03': 'Episode 3',
  's1e04': 'Episode 4',
  's1e05': 'Episode 5',
  'sp0e01': 'Halloween Story',
};

function getMatomoPageInfo(pathname: string): { title: string; url: string } {
  const base = 'Amy Surfwing';
  const origin = window.location.origin;

  if (pathname === '/' || pathname === '/jury') return { title: `${base} – Start`, url: `${origin}/` };
  if (pathname === '/stories') return { title: `${base} – Story-Übersicht`, url: `${origin}/stories` };
  if (pathname === '/about') return { title: `${base} – Über uns`, url: `${origin}/about` };
  if (pathname === '/profile') return { title: `${base} – Profil`, url: `${origin}/profile` };
  if (pathname === '/avatar') return { title: `${base} – Avatar`, url: `${origin}/avatar` };
  if (pathname === '/album') return { title: `${base} – Sticker-Album`, url: `${origin}/album` };
  if (pathname === '/parents') return { title: `${base} – Für Eltern`, url: `${origin}/parents` };
  if (pathname === '/parent-setup') return { title: `${base} – Eltern-Einrichtung`, url: `${origin}/parent-setup` };
  if (pathname === '/privacy') return { title: `${base} – Datenschutz`, url: `${origin}/privacy` };
  if (pathname === '/impressum') return { title: `${base} – Impressum`, url: `${origin}/impressum` };
  if (pathname === '/faq') return { title: `${base} – FAQ`, url: `${origin}/faq` };
  if (pathname === '/concept') return { title: `${base} – Konzept`, url: `${origin}/concept` };
  if (pathname === '/cards') return { title: `${base} – Freundebuch`, url: `${origin}/cards` };
  if (pathname === '/lexikon') return { title: `${base} – Lexikon`, url: `${origin}/lexikon` };
  if (pathname === '/newspaper') return { title: `${base} – Zeitung`, url: `${origin}/newspaper` };
  if (pathname === '/season-finale/s1') return { title: `${base} – Staffel-Finale`, url: `${origin}/season-finale/s1` };
  if (pathname === '/tommi-award') return { title: `${base} – Tommi Award`, url: `${origin}/tommi-award` };
  if (pathname === '/presse') return { title: `${base} – Presse`, url: `${origin}/presse` };
  if (pathname === '/start') return { title: `${base} – Onboarding`, url: `${origin}/start` };

  if (pathname.startsWith('/stories-v02/')) {
    const parts = pathname.replace('/stories-v02/', '').split('/');
    const courseId = parts[0] ?? '';
    const chapterId = parts[1] ?? '';
    const courseName = COURSE_NAMES[courseId] ?? courseId;
    if (chapterId) return { title: `${base} – ${courseName} / ${chapterId}`, url: `${origin}/stories-v02/${courseId}/${chapterId}` };
    return { title: `${base} – ${courseName}`, url: `${origin}/stories-v02/${courseId}` };
  }
  if (pathname.startsWith('/newspaper/')) return { title: `${base} – Artikel`, url: `${origin}${pathname}` };
  if (pathname.startsWith('/cards/')) return { title: `${base} – Freundebucheintrag`, url: `${origin}${pathname}` };
  if (pathname.startsWith('/diaries/')) return { title: `${base} – Tagebuch`, url: `${origin}${pathname}` };
  if (pathname.startsWith('/studio')) return { title: `${base} – Studio`, url: `${origin}${pathname}` };

  return { title: `${base} – ${pathname}`, url: `${origin}${pathname}` };
}

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;

  useEffect(() => {
    const _paq = (window as any)._paq;
    if (!_paq) return;
    const { title, url } = getMatomoPageInfo(location.pathname);
    document.title = title;
    _paq.push(['setCustomUrl', url]);
    _paq.push(['setDocumentTitle', title]);
    _paq.push(['trackPageView']);
  }, [location.pathname]);

  return (
    <BackgroundLocationContext.Provider value={backgroundLocation ?? null}>
    <Suspense fallback={null}>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Welcome />} />
        <Route path="/jury" element={<Welcome />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories-v02/:courseId" element={<StoryEpisodeOverview />} />
        <Route path="/stories-v02/:courseId/:chapterId" element={<StoryV02ChapterRoute />} />
        <Route path="/about" element={<About />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/avatar" element={<AvatarPicker />} />
        <Route path="/album" element={<StickerAlbum />} />
        <Route path="/adult-settings" element={<AdultSettings />} />

        <Route path="/parents" element={<ForParents />} />
        <Route path="/parent-setup" element={<ParentSetupWizard />} />
        <Route path="/concept" element={<Concept />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path="/cards" element={<Cards />} />
        <Route path="/cards/:bonusId" element={<CardDetail />} />

        <Route path="/diaries" element={<Diaries />} />
        <Route path="/diaries/:diaryId" element={<DiaryBook />} />

        <Route path="/newspaper" element={<Newspaper />} />
        <Route path="/newspaper/:id" element={<NewspaperArticle />} />

        <Route path="/lexikon" element={<Lexikon />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/transfer/:data" element={<TransferPage />} />
        <Route path="/install" element={<InstallGuide />} />
        <Route path="/beta/:code" element={<BetaPage />} />

        <Route path="/studio" element={<StudioPage />} />
        <Route path="/studio/educators" element={<StudioEducatorsPage />} />
        <Route path="/studio/view/:encoded" element={<StudioViewPage />} />
        <Route path="/studio/stories" element={<StudioStoriesPage />} />

        <Route path="/season-finale/s1" element={<SeasonFinale />} />
        <Route path="/redeem-voucher" element={<RedeemVoucher />} />
        <Route path="/shop/return" element={<StripePurchaseReturn />} />
        <Route path="/voucher-admin" element={<VoucherAdmin />} />
        <Route path="/tommi-award" element={<TommiAward />} />
        <Route path="/presse" element={<Presse />} />

        {import.meta.env.DEV && TestSettings && (
          <Route path="/test-settings" element={<TestSettings />} />
        )}
        {import.meta.env.DEV && DevLab && (
          <Route path="/dev" element={<DevLab />} />
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>

      {backgroundLocation && (
        <Routes location={location}>
          <Route
            path="/cards"
            element={
              <ModalShell title="Sammelkarten">
                <Cards />
              </ModalShell>
            }
          />
          <Route
            path="/cards/:bonusId"
            element={
              <ModalShell title="Sammelkarte">
                <CardDetail />
              </ModalShell>
            }
          />
          <Route
            path="/newspaper/:id"
            element={
              <ModalShell title="Schülerzeitung">
                <NewspaperArticle />
              </ModalShell>
            }
          />
          <Route
            path="/diaries/:diaryId"
            element={
              <ModalShell title="Tagebuch">
                <DiaryBook />
              </ModalShell>
            }
          />
          <Route
            path="/diaries"
            element={
              <ModalShell title="Tagebücher">
                <Diaries />
              </ModalShell>
            }
          />
        </Routes>
      )}
    </Suspense>
    </BackgroundLocationContext.Provider>
  );
}


// Einmalige Migration + Multi-Profil-Start: läuft synchron vor dem ersten Render.
if (needsMigration()) {
  migrateToMultiProfile();
}

// Keypair erzeugen oder laden — fire-and-forget, kein Render-Block.
initIdentity();

function App() {
  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  // Badge beim App-Öffnen löschen
  useEffect(() => { clearAmicBadge() }, [])

  useEffect(() => {
    updateSWRef.current = registerSW({
      onNeedRefresh() {
        // Neue Version sofort anwenden — kein Banner, kein User-Klick nötig.
        updateSWRef.current?.(true);
      },
      onOfflineReady() {
        console.info('[PWA] App ist jetzt offline verfügbar.');
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LandscapeOverlay />
      <ProfileProvider>
        <RewardFxProvider>
          <Router>
            <ScrollRestorationManual />
            <ScrollToHash />
            <CoinOverlay />
            <RouteI18nLoader>
              <AppRoutes />
            </RouteI18nLoader>
          </Router>
        </RewardFxProvider>
      </ProfileProvider>
    </QueryClientProvider>
  );
}

export default App;
