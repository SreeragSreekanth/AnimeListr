import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AnimeList from './pages/AnimeList'; 
import AnimeDetail from './components/AnimeDetail';
import AdminImportAnime from './components/AdminImportAnime';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  const AdminRoute = ({ children }) => {
    if (!user || !user.is_staff) return <Navigate to="/" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<AnimeList />} />
      <Route path="/anime/:slug" element={<AnimeDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      
      <Route path="/admin/import-anime" element={
        <PrivateRoute>
          <AdminRoute>
            <AdminImportAnime />
          </AdminRoute>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
