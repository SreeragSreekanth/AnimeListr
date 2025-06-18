import React, { useEffect, useState } from "react";
import axios from "axios";
import WatchlistCard from "./WatchlistCard";
import { useAuth } from "../../context/AuthContext";

const tabLabels = {
  to_watch: "To Watch",
  watching: "Watching",
  completed: "Completed",
};

export default function WatchlistTabs({ activeTab, setActiveTab }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchEntries = () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}watchlist/?status=${activeTab}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setEntries(res.data.results))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEntries();
  }, [activeTab]);

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {Object.entries(tabLabels).map(([key, label]) => (
          <button
            key={key}
            className={`px-4 py-2 rounded-full font-medium ${
              key === activeTab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-600">No anime in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {entries.map((entry) => (
            <WatchlistCard key={entry.id} entry={entry} onUpdated={fetchEntries} />
          ))}
        </div>
      )}
    </div>
  );
}
