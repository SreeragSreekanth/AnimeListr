import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [status, setStatus] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState('');

  const fetchGenres = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}genres/`);
      setGenres(res.data.results);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchAnimes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedGenre) params.genre = selectedGenre;
      if (status) params.status = status;
      if (sort) params.ordering = sort;  // Note: ordering param is how DRF ordering filter works

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}anime/`, {
        params,
      });
      setAnimes(res.data.results);
    } catch (error) {
      console.error('Error fetching anime list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever any filter changes or on search submit
  useEffect(() => {
    fetchAnimes();
  }, [selectedGenre, status, year, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnimes();
  };

  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handleSortChange = (e) => setSort(e.target.value);

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

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-3 py-2 rounded-lg border"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.slug}>
              {genre.name}
            </option>
          ))}
        </select>

        <select value={status} onChange={handleStatusChange} className="px-3 py-2 rounded-lg border">
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="upcoming">Upcoming</option>
          {/* <option value="finished">Upcoming</option> */}
        </select>


        <select value={sort} onChange={handleSortChange} className="px-3 py-2 rounded-lg border">
          <option value="">Sort by</option>
          <option value="rating">Rating (Asc)</option>
          <option value="-rating">Rating (Desc)</option>
          <option value="popularity">Popularity (Asc)</option>
          <option value="-popularity">Popularity (Desc)</option>
          <option value="title">Title (A-Z)</option>
          <option value="-title">Title (Z-A)</option>
          <option value="release_year">Release Year (Asc)</option>
          <option value="-release_year">Release Year (Desc)</option>
        </select>
      </div>

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
                  <p className="text-sm text-gray-500">
                    {anime.release_year} • {anime.status}
                  </p>
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
