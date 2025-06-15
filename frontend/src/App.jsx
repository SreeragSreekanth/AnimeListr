import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AnimeList from './pages/AnimeList';
import AnimeDetail from './components/AnimeDetail';

import AdminImportAnime from './components/AdminImportAnime';
import AdminAnimeDashboard from './admin/AdminAnimeDashboard';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
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
    </Routes>
  );
}

export default App;
