import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

const statusOptions = {
  to_watch: "To Watch",
  watching: "Watching",
  completed: "Completed",
};

export default function WatchlistCard({ entry, onUpdated }) {
  const { getToken } = useAuth();
  const token = getToken();
  const [status, setStatus] = useState(entry.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api(`watchlist/${entry.id}/`, "PUT", {
        anime_id: entry.anime.id,
        status,
      }, token);
      onUpdated(); // tell parent to refresh
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api(`watchlist/${entry.id}/`, "DELETE", null, token);
      onUpdated(); // refresh
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white flex flex-col">
      <img
        src={entry.anime.cover_image}
        alt={entry.anime.title}
        className="rounded-lg mb-2 w-full h-48 object-cover"
      />
      <h2 className="font-semibold text-lg text-blue-700 mb-2">{entry.anime.title}</h2>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="mb-2 border rounded px-2 py-1"
      >
        {Object.entries(statusOptions).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
