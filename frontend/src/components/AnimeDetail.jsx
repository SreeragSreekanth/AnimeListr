import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AnimeDetail = () => {
  const { slug } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchAnimeDetail();
  }, [slug]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
  if (!anime) return <p className="p-6 text-center text-gray-500">Anime not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={anime.cover_image}
          alt={anime.title}
          className="w-full md:w-64 rounded-xl shadow-md object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>
          <p className="text-gray-600 mb-2">{anime.release_year} • {anime.status}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres.map((genre) => (
              <span key={genre.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {genre.name}
              </span>
            ))}
          </div>
          <p className="text-gray-800 leading-relaxed">{anime.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
