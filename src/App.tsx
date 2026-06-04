import { createContext, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import type { Location } from 'react-router-dom';

// Exposes whether a modal overlay is currently open (backgroundLocation is set).
// StoryV02 reads this to detect when a modal has just closed and scroll should be restored.
export const BackgroundLocationContext = createContext<Location | null | undefined>(undefined);

import { registerSW } from 'virtual:pwa-register';
import PwaUpdateBanner from './components/PwaUpdateBanner';
import { ProfileProvider } from './profile/useProfile';
import { initSoundPlayer } from './common/soundPlayer';

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
const StudioPage         = lazy(() => import('./pages/StudioPage'));
const StudioViewPage     = lazy(() => import('./pages/StudioViewPage'));
const StudioStoriesPage  = lazy(() => import('./pages/StudioStoriesPage'));
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

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <BackgroundLocationContext.Provider value={backgroundLocation ?? null}>
    <Suspense fallback={null}>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Welcome />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories-v02/:courseId" element={<StoryEpisodeOverview />} />
        <Route path="/stories-v02/:courseId/:chapterId" element={<StoryV02ChapterRoute />} />
        <Route path="/about" element={<About />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/avatar" element={<AvatarPicker />} />
        <Route path="/album" element={<StickerAlbum />} />
        <Route path="/adult-settings" element={<AdultSettings />} />

        <Route path="/parents" element={<ForParents />} />
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
        <Route path="/studio/view/:encoded" element={<StudioViewPage />} />
        <Route path="/studio/stories" element={<StudioStoriesPage />} />

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


function App() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  // Badge beim App-Öffnen löschen
  useEffect(() => { clearAmicBadge() }, [])

  useEffect(() => {
    updateSWRef.current = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
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
      {needRefresh && (
        <PwaUpdateBanner
          onUpdate={() => updateSWRef.current?.(true)}
          onDismiss={() => setNeedRefresh(false)}
        />
      )}
    </QueryClientProvider>
  );
}

export default App;
