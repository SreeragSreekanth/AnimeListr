import React from "react";
import { Link } from "react-router-dom";

const CommonNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-indigo-400">Anime</Link>
        <Link to="/forum" className="hover:text-indigo-400">Forum</Link>
      </div>
      <div className="flex space-x-4">
        <Link to="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Login</Link>
        <Link to="/register" className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">Register</Link>
      </div>
    </nav>
  );
};

export default CommonNavbar;
