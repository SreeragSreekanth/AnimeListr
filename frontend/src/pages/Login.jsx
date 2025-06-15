import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokenData = await api("token/", "POST", { username, password });
      const profile = await api("profile/", "GET", null, tokenData.access);
      login({ ...profile, access: tokenData.access });
      console.log("Logged in as:", profile);
      navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('https://w0.peakpx.com/wallpaper/916/522/HD-wallpaper-luffy-luffy-edit-luffy-fanart-luffy-wallpaoer-one-piece-one-piece-sanji-zoro-zoro.jpg')" }}
        >
        <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-8 shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-4">
            <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-6">Login</h1>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm text-gray-300 mb-1">
                Username
                </label>
                <input
                id="username"
                className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                Password
                </label>
                <input
                id="password"
                className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
            >
                Login
            </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-400 hover:underline">
                Register
            </a>
            </p>
        </div>
        </div>

  );
}
