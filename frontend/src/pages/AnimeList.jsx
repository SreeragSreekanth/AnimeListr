import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnimes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}anime/`, {
        params: search ? { search } : {},
      });
      console.log("API response:", res.data); // 🔍 Add this

      setAnimes(res.data.results);
    } catch (error) {
      console.error('Error fetching anime list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnimes();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border w-full md:w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : animes.length === 0 ? (
        <p className="text-center text-gray-500">No anime found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {animes.map((anime) => (
            <Link to={`/anime/${anime.slug}`} key={anime.id} className="group">
              <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition">
                <img
                  src={anime.cover_image}
                  alt={anime.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-3">
                  <h2 className="text-md font-semibold group-hover:text-blue-600 transition">
                    {anime.title}
                  </h2>
                  <p className="text-sm text-gray-500">{anime.release_year} • {anime.status}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {anime.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-gray-200 text-xs px-2 py-0.5 rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimeList;
