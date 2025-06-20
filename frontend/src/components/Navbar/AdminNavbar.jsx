import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-red-900 text-white p-3 px-6 flex justify-between items-center">
      {/* Left section - Admin Links */}
      <div className="flex space-x-4">
        <Link to="/admin/import-anime" className="hover:text-yellow-300">
          Import Anime
        </Link>
        <Link to="/admin/anime" className="hover:text-yellow-300">
          Anime Dashboard
        </Link>
        <Link to="/admin/forum" className="hover:text-yellow-300">
          Forum Dashboard
        </Link>
      </div>

      {/* Right section - Profile/Logout/Login/Register */}
      <div className="flex space-x-4 items-center">
        {user && (
          <Link
            to="/profile"
            className="text-sm hover:text-indigo-300 font-medium"
          >
            👤 {user.username}
          </Link>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
