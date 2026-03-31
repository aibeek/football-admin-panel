import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MobileLayout from '@/mobile/components/layout/MobileLayout';
import FavoritesPage from '@/mobile/pages/FavoritesPage';
import HomePage from '@/mobile/pages/HomePage';
import MatchesPage from '@/mobile/pages/MatchesPage';
import NewsPage from '@/mobile/pages/NewsPage';
import PlaygroundDetailPage from '@/mobile/pages/PlaygroundDetailPage';
import ProfilePage from '@/mobile/pages/ProfilePage';
import SportClubDetailPage from '@/mobile/pages/SportClubDetailPage';
import TournamentDetailPage from '@/mobile/pages/TournamentDetailPage';
import { useAuthStore } from '@/mobile/store/authStore';
import { useShellStore } from '@/mobile/store/shellStore';
import '@/mobile/styles/index.css';

export default function MobileApp() {
  const initialize = useShellStore((state) => state.initialize);
  const bootstrapAuth = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    initialize();
    void bootstrapAuth();
  }, [initialize, bootstrapAuth]);

  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/clubs/:id" element={<SportClubDetailPage />} />
        <Route path="/playgrounds/:id" element={<PlaygroundDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/settings" element={<ProfilePage />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
