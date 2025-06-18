import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CommonNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-indigo-400">Anime</Link>
        <Link to="/forum" className="hover:text-indigo-400">Forum</Link>
        <Link to="/watchlist" className="hover:text-indigo-400">Watchlist</Link>
        <Link to="/notifications" className="hover:text-indigo-400">Notifications</Link>
      </div>

      <div className="flex space-x-4 items-center">
        {user && <Link to="/profile" className="text-sm hover:text-indigo-400">👤 {user.username}</Link>}
        {user ? (
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
        ) : (
          <>
            <Link to="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Login</Link>
            <Link to="/register" className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default CommonNavbar;
