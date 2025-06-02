// src/pages/ChangePassword.jsx
import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api("change-password/", "POST", {
        current_password: current,
        new_password: newPassword,
      }, user?.token);

      setMessage("Password changed successfully!");
      setCurrent("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-400">Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Current Password"
          className="w-full p-2 mb-3 bg-gray-800 rounded border border-gray-700"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-3 bg-gray-800 rounded border border-gray-700"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {message && <p className="text-sm mb-2 text-yellow-400">{message}</p>}
        <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
          Change Password
        </button>
      </form>
    </div>
  );
}
