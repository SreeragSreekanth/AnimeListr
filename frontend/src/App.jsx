import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AnimeList from './pages/AnimeList';
import ForumPage from './pages/ForumPage';
import NotificationsPage from "./pages/NotificationsPage";
import AnimeDetail from './components/AnimeDetail';
import PostDetail from './components/Forum/PostDetail';

import AdminImportAnime from './components/AdminImportAnime';
import AdminAnimeDashboard from './admin/AdminAnimeDashboard';
import AdminForumDashboard from './admin/AdminForumDashboard'; 

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import WatchlistPage from "./components/Watchlist/WatchlistPage";

import AdminNavbar from './components/Navbar/AdminNavbar';
import UserNavbar from './components/Navbar/UserNavbar';

function App() {
  const { user } = useAuth();

  return (
    <>
      {/* Navbar based on user role */}
      {user?.is_staff ? (
        <AdminNavbar />
      ) : user ? (
        <UserNavbar />
      ) : null}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AnimeList />} />
        <Route path="/anime/:slug" element={<AnimeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated User Route */}
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        {/* Admin-only Routes */}
        <Route path="/admin/import-anime" element={
          <AdminRoute>
            <AdminImportAnime />
          </AdminRoute>
        } />

        <Route path="/admin/anime" element={
          <AdminRoute>
            <AdminAnimeDashboard />
          </AdminRoute>
        } />

        <Route path="/admin/forum" element={
          <AdminRoute>
            <AdminForumDashboard />
          </AdminRoute>
        } />

        {/* Forum and Other Auth Routes */}
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/posts/:id" element={<PostDetail />} />
        <Route path="/watchlist" element={
          <PrivateRoute>
            <WatchlistPage />
          </PrivateRoute>
        } />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </>
  );
}

export default App;
