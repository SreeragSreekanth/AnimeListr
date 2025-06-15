import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const AdminAnimeDashboard = () => {
  const [animeList, setAnimeList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [editingAnime, setEditingAnime] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchAnimeList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}anime/`,
        {
          params: {
            search: query,
            status: statusFilter,
            type: typeFilter,
            page,
          },
        }
      );
      setAnimeList(response.data.results);
      setCount(response.data.count);
    } catch (error) {
      console.error('Error fetching anime list:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}genres/`);
      setGenres(response.data.results);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchAnimeList();
  }, [query, statusFilter, typeFilter, page]);

  const handleEditClick = (anime) => {
    setEditingAnime({ ...anime });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingAnime?.slug) return;
    if (!user?.access) {
      console.error('No access token available');
      return;
    }

    const payload = {
      title: editingAnime.title,
      status: editingAnime.status,
      type: typeof editingAnime.type === 'string' ? editingAnime.type : editingAnime.type[0],
      genre_ids: editingAnime.genres?.map(g => g.id) || [],
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}anime/${editingAnime.slug}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        }
      );
      fetchAnimeList();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating anime:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (slug) => {
    if (!user?.access) {
      console.error('No access token available');
      return;
    }

    if (confirm('Are you sure you want to delete this anime?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}anime/${slug}/`,
          {
            headers: {
              Authorization: `Bearer ${user.access}`,
            },
          }
        );
        fetchAnimeList();
      } catch (error) {
        console.error('Error deleting anime:', error.response?.data || error.message);
      }
    }
  };

  const toggleGenre = (genreId) => {
    const currentGenres = editingAnime.genres || [];
    const isSelected = currentGenres.some((g) => g.id === genreId);
    const updatedGenres = isSelected
      ? currentGenres.filter((g) => g.id !== genreId)
      : [...currentGenres, genres.find((g) => g.id === genreId)];
    setEditingAnime({ ...editingAnime, genres: updatedGenres });
  };

  const totalPages = Math.ceil(count / 10); // Assuming 10 per page

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Anime Dashboard</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-2 py-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">All Types</option>
          <option value="TV">TV</option>
          <option value="Movie">Movie</option>
          <option value="OVA">OVA</option>
          <option value="ONA">ONA</option>
          <option value="Special">Special</option>
          <option value="Music">Music</option>
        </select>
      </div>

      {loading ? (
        <p>Loading anime list...</p>
      ) : (
        <>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Year</th>
                <th className="p-2 border">Public API</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {animeList.map((anime) => (
                <tr key={anime.slug} className="border-t">
                  <td className="p-2 border">{anime.title}</td>
                  <td className="p-2 border capitalize">{anime.status}</td>
                  <td className="p-2 border">{anime.type}</td>
                  <td className="p-2 border">{anime.release_year || '-'}</td>
                  <td className="p-2 border text-center">
                    {anime.is_public_api ? '✅' : '❌'}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="mr-2 px-2 py-1 bg-yellow-400 rounded"
                      onClick={() => handleEditClick(anime)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(anime.slug)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-500 text-white' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Edit Anime</h2>
            <input
              type="text"
              value={editingAnime.title}
              onChange={(e) =>
                setEditingAnime({ ...editingAnime, title: e.target.value })
              }
              className="w-full border mb-2 px-2 py-1"
              placeholder="Title"
            />
            <select
              value={editingAnime.status}
              onChange={(e) =>
                setEditingAnime({ ...editingAnime, status: e.target.value })
              }
              className="w-full border mb-2 px-2 py-1"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <select
              value={editingAnime.type}
              onChange={(e) =>
                setEditingAnime({ ...editingAnime, type: e.target.value })
              }
              className="w-full border mb-2 px-2 py-1"
            >
              <option value="TV">TV</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="Special">Special</option>
              <option value="Music">Music</option>
              <option value="Other">Other</option>
            </select>

            <label className="font-semibold">Genres:</label>
<div className="flex flex-wrap gap-2 mt-1 mb-4">
  {genres?.length > 0 ? (
    genres.map((genre) => {
      const selected = editingAnime?.genres?.some((g) => g.id === genre.id);
      return (
        <button
          key={genre.id}
          onClick={() => toggleGenre(genre.id)}
          className={`px-2 py-1 rounded border ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          {genre.name}
        </button>
      );
    })
  ) : (
    <p className="text-gray-500">No genres available</p>
  )}
</div>


            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnimeDashboard;
