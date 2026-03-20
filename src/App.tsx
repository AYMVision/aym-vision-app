import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Welcome from './pages/Welcome.tsx';
import NotFound from './pages/NotFound.tsx';
import Stories from './pages/Stories.tsx';
import Story from './pages/Story.tsx';
import About from './pages/About.tsx';
import ScrollToHash from './common/utils.ts';

import { ProfileProvider } from './profile/useProfile';
import Profile from './pages/Profile';
import AvatarPicker from './pages/AvatarPicker';
import AmyTest from './pages/AmyTest.tsx';

import { RewardFxProvider } from './progress/rewardFx';
import CoinOverlay from './progress/CoinOverlay';

import StickerAlbum from './pages/StickerAlbum';
import Diaries from './pages/Diaries';
import DiaryBook from './pages/DiaryBook';

import Newspaper from './pages/Newspaper';
import NewspaperArticle from './pages/NewspaperArticle';
import Cards from './pages/Cards.tsx';
import CardDetail from './pages/CardDetail';
import type { Location } from 'react-router-dom';
import { useEffect } from 'react';

import ModalShell from './components/ModalShell';

import AdultSettings from './pages/AdultSettings';

import ForKids from './pages/ForKids';
import ForParents from './pages/ForParents';
import Concept from './pages/Concept';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import RouteI18nLoader from './i18n/RouteI18nLoader';
import TestSettings from './pages/TestSettings';

const queryClient = new QueryClient();

function ScrollRestorationManual() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
  return null;
}

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Welcome />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:courseId" element={<Story />} />
        <Route path="/about" element={<About />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/avatar" element={<AvatarPicker />} />
        <Route path="/album" element={<StickerAlbum />} />
        <Route path="/adult-settings" element={<AdultSettings />} />

        <Route path="/kids" element={<ForKids />} />
        <Route path="/parents" element={<ForParents />} />
        <Route path="/concept" element={<Concept />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path="/cards" element={<Cards />} />
        <Route path="/cards/:bonusId" element={<CardDetail />} />

        <Route path="/diaries" element={<Diaries />} />
        <Route path="/diaries/:diaryId" element={<DiaryBook />} />

        <Route path="/newspaper" element={<Newspaper />} />
        <Route path="/newspaper/:id" element={<NewspaperArticle />} />

        <Route path="/test/amy" element={<AmyTest />} />
        <Route path="/test/amy/:courseId" element={<AmyTest />} />

        <Route path="/test-settings" element={<TestSettings />} />

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
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
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

export default App;