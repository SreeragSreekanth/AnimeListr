import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ForumPage = () => {
  const { user } = useAuth();
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}forum/posts/`;

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (url = baseUrl) => {
    try {
      setLoading(true);
      const res = await axios.get(url, {
        params: {
          search: search.trim(),
          ordering,
        },
      });
      setPosts(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [ordering]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      fetchPosts();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Forum</h1>
        {user && (
          <Link
            to="/forum/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + New Post
          </Link>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="border p-2 rounded w-full sm:w-1/2"
        />
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="-created_at">🆕 Newest</option>
          <option value="created_at">📜 Oldest</option>
          <option value="-comments_count">🔥 Most Comments</option>
          <option value="title">🔤 Title A-Z</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="border rounded p-4 hover:shadow transition"
            >
              <Link to={`/forum/posts/${post.id}`}>
                <h2 className="text-xl font-semibold text-indigo-600 hover:underline">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500">
                👤 {post.author_username} · 🗨️ {post.comments_count} comments
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          disabled={!prevPage}
          onClick={() => fetchPosts(prevPage)}
          className={`px-4 py-2 rounded ${
            !prevPage
              ? "bg-gray-300"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          ⬅️ Prev
        </button>
        <button
          disabled={!nextPage}
          onClick={() => fetchPosts(nextPage)}
          className={`px-4 py-2 rounded ${
            !nextPage
              ? "bg-gray-300"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default ForumPage;
