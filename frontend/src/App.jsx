import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import AnimeList from './pages/AnimeList'; 

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/" element={<AnimeList />} />
      {/* <Route path="/anime/:slug" element={<AnimeDetail />} /> */}

    </Routes>
  );
}

export default App;
