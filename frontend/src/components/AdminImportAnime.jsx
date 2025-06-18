import React, { useState } from 'react';
import axios from 'axios';

const AdminAnimeImport = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.access;

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auto-import-anilist/`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.detail || 'Anime imported successfully!');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || 'Failed to import anime.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Import Anime from AniList</h2>
      <form onSubmit={handleImport} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter anime title (e.g. Ao no Hako)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg px-4 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Import'}
        </button>
        {message && (
          <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AdminAnimeImport;
