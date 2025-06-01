import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api("register/", "POST", formData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://w0.peakpx.com/wallpaper/916/522/HD-wallpaper-luffy-luffy-edit-luffy-fanart-luffy-wallpaoer-one-piece-one-piece-sanji-zoro-zoro.jpg')",
      }}
    >
      <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-8 shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-4">
        <h1 className="text-4xl font-extrabold text-center text-green-400 mb-6">Register</h1>
        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="new-password"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition-colors duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
