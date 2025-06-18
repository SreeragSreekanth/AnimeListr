import React, { useState } from "react";
import WatchlistTabs from "./WatchlistTabs";

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState("to_watch");

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
      <WatchlistTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
