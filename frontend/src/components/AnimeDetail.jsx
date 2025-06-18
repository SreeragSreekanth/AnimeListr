import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewList from './Reviews/ReviewList';
import ReviewForm from './Reviews/ReviewForm';
import { useAuth } from '../context/AuthContext';

const AnimeDetail = () => {
  const { slug } = useParams();
  const { user, getToken } = useAuth();

  const [anime, setAnime] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const fetchAnimeDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}anime/${slug}/`);
      setAnime(res.data);
    } catch (error) {
      console.error('Error fetching anime detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}anime/${slug}/reviews/`);
      const hasReview = res.data.results?.some((r) => r.user === user.username);
      setUserHasReviewed(hasReview);
    } catch (err) {
      console.error('Error checking user review:', err);
    }
  };

  const checkWatchlist = async () => {
    if (!user || !anime) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}watchlist/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const exists = res.data.results?.some(entry => entry.anime.id === anime.id);
      setInWatchlist(exists);
    } catch (err) {
      console.error("Watchlist check failed:", err);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}watchlist/`, {
        anime_id: anime.id,
        status: "to_watch",
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setInWatchlist(true);
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
    }
  };

  useEffect(() => {
    fetchAnimeDetail();
  }, [slug]);

  useEffect(() => {
    if (slug && user) {
      checkUserReview();
    }
  }, [slug, user]);

  useEffect(() => {
    if (anime && user) {
      checkWatchlist();
    }
  }, [anime, user]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
  if (!anime) return <p className="p-6 text-center text-gray-500">Anime not found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={anime.cover_image}
          alt={anime.title}
          className="w-full md:w-64 h-auto rounded-2xl shadow-xl object-cover"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-3 text-blue-700">{anime.title}</h1>
          <div className="text-gray-600 mb-2 space-y-1">
            <p>📅 Year: {anime.release_year || 'Unknown'}</p>
            <p>📺 Type: {anime.type || 'N/A'}</p>
            <p>🎬 Episodes: {anime.episode_count || 'Unknown'}</p>
            <p>📈 Status: {anime.status?.charAt(0).toUpperCase() + anime.status?.slice(1)}</p>
            <p>⭐ Rating: {anime.average_rating ?? 'N/A'}</p>
          </div>
          <div className="flex flex-wrap gap-2 my-4">
            {anime.genres.map((genre) => (
              <span key={genre.id} className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                {genre.name}
              </span>
            ))}
          </div>

          {user && (
            <div className="my-4">
              {inWatchlist ? (
                <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  ✓ Added to Watchlist
                </span>
              ) : (
                <button
                  onClick={handleAddToWatchlist}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full"
                >
                  ➕ Add to Watchlist
                </button>
              )}
            </div>
          )}

          <div className="prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: anime.description }} />
        </div>
      </div>

      {!userHasReviewed && user && (
        <ReviewForm
          animeSlug={anime.slug}
          onReviewPosted={() => {
            fetchAnimeDetail();
            checkUserReview();
          }}
        />
      )}

      <ReviewList animeSlug={anime.slug} />
    </div>
  );
};

export default AnimeDetail;
