import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api("profile/", "GET", null, user?.token);
        setProfileData(data);
        setBio(data.bio || "");
        setPreview(data.profile_picture || null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
formData.append("username", profileData.username);
formData.append("email", profileData.email);
formData.append("bio", bio);


    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      const updated = await api("profile/", "PUT", formData, user?.token, true);
    //   console.log("Updated profile response:", updated);
      setProfileData(updated);
      setPreview(updated.profile_picture || null);
      setBio(updated.bio || "");
      setMessage("Profile updated successfully");
      login({ ...user, ...updated });
      setIsEditing(false); // go back to dashboard after update
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-green-400">Profile</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              placeholder="Write something about yourself"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setProfilePicture(file);
                setPreview(URL.createObjectURL(file));
              }}
              className="w-full text-sm bg-gray-800 p-2 rounded border border-gray-700"
            />
          </div>

          {message && <p className="text-yellow-400 text-sm">{message}</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center gap-6 mb-6">
          <img src={preview ? preview.startsWith("http")
            ? preview : `${import.meta.env.VITE_API_BASE_URL}${preview}`: "https://placehold.co/150x150/png"}
  alt="Profile"
  className="w-28 h-28 rounded-full object-cover border-2 border-green-500"
/>


            <div>
              <h2 className="text-3xl font-bold text-green-400">{profileData?.username}</h2>
              <p className="text-gray-400">{profileData?.email}</p>
              <p className="mt-2">{profileData.bio || "No bio added yet."}</p>
            </div>
          </div>

          {/* Here you can add other dashboard info, like stats or recent activity */}

          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
