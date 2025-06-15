import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ReviewList = ({ animeSlug }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exactRating, setExactRating] = useState(""); // new filter

  const fetchReviews = async (url = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (exactRating) params.append("rating", exactRating);

      const res = await axios.get(
        url || `${import.meta.env.VITE_API_BASE_URL}anime/${animeSlug}/reviews/?${params.toString()}`
      );

      setReviews(res.data.results || []);
      setNext(res.data.next);
      setPrev(res.data.previous);
      setError(null);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (animeSlug) fetchReviews();
  }, [animeSlug, exactRating]);

  const userReview = reviews?.find((r) => r.user === user?.username);

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>

      {/* Filter Controls */}
      <div className="mb-4 flex items-center gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Rating:</label>
          <select
            value={exactRating}
            onChange={(e) => setExactRating(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="">All</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading reviews...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {reviews.length === 0 && !loading && <p>No reviews yet.</p>}

      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="bg-gray-100 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-blue-600">{review.user}</span>
              <span className="text-sm text-gray-600">⭐ {review.rating}/10</span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{review.text}</p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        {prev && (
          <button
            onClick={() => fetchReviews(prev)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            ⬅️ Previous
          </button>
        )}
        {next && (
          <button
            onClick={() => fetchReviews(next)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ml-auto"
          >
            Next ➡️
          </button>
        )}
      </div>

      {user && userReview && (
        <p className="text-sm text-green-600 mt-4">
          ✅ You have already reviewed this anime.
        </p>
      )}
    </div>
  );
};

export default ReviewList;
