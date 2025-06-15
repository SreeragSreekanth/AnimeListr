import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Star } from "lucide-react";

const ReviewForm = ({ animeSlug, onReviewPosted }) => {
  const { user, getToken } = useAuth();
  const [rating, setRating] = useState(8);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}anime/${animeSlug}/reviews/`,
        { rating, text },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setText("");
      setRating(8);
      onReviewPosted(); // refresh parent
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "You may have already submitted a review or there was an error."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mt-12 bg-white border rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Write a Review</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating:</label>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => {
              const value = i + 1;
              return (
                <Star
                  key={value}
                  size={24}
                  className={`cursor-pointer transition-colors ${
                    value <= (hovered || rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => handleStarClick(value)}
                  fill={value <= rating ? "#facc15" : "none"}
                />
              );
            })}
            <span className="ml-2 text-sm text-gray-600">{rating}/10</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Write your thoughts about this anime..."
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition"
        >
          {loading ? "Submitting..." : "Post Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
