import React from "react";
import { Link } from "react-router-dom";
import CommonNavbar from "./CommonNavbar";

const AdminNavbar = () => {
  return (
    <>
      <CommonNavbar />
      <nav className="bg-red-900 text-white p-2 px-4 flex space-x-4">
        <Link to="/admin/import-anime" className="hover:text-yellow-300">Import Anime</Link>
        <Link to="/admin/anime" className="hover:text-yellow-300">Anime Dashboard</Link>
        <Link to="/admin/forum" className="hover:text-yellow-300">Forum Dashboard</Link>
      </nav>
    </>
  );
};

export default AdminNavbar;
