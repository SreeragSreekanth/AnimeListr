import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchGenres = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}genres/`);
      setGenres(res.data.results);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchAnimes = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (selectedGenre) params.genre = selectedGenre;
      if (status) params.status = status;
      if (sort) params.ordering = sort;

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}anime/`, { params });

      setAnimes(res.data.results);
      const pageSize = 10;
      setTotalPages(Math.ceil(res.data.count / pageSize));
    } catch (error) {
      console.error('Error fetching anime list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchAnimes();
  }, []);

  useEffect(() => {
    fetchAnimes();
  }, [selectedGenre, status, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAnimes();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border w-full md:w-1/3"
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-3 py-2 rounded-lg border"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.slug}>{genre.name}</option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border">
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="upcoming">Upcoming</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-lg border">
          <option value="">Sort by</option>
          <option value="-rating">Top Rated</option>
          <option value="-release_year">Newest</option>
          <option value="release_year">Oldest</option>
          <option value="title">Title (A-Z)</option>
          <option value="-title">Title (Z-A)</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Search
        </button>
      </form>

      {/* Anime Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : animes.length === 0 ? (
        <p className="text-center text-gray-500">No anime found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {animes.map((anime) => (
              <Link to={`/anime/${anime.slug}`} key={anime.id} className="group">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                  <img
                    src={anime.cover_image}
                    alt={anime.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-md font-bold text-gray-900 group-hover:text-blue-700 transition">
                      {anime.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {anime.release_year} • {anime.status}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {anime.genres.slice(0, 3).map((genre) => (
                        <span key={genre.id} className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-700">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 font-medium text-gray-700">{page} / {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimeList;
