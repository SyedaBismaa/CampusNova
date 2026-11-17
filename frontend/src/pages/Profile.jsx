
import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { useAuth } from "../context/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-8">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {error && <p className="text-red-600">{error}</p>}

        {profile && (
          <div className="space-y-4">
            <p><strong>Name:</strong> {profile.fullName || "—"}</p>
            <p><strong>Email:</strong> {profile.email || "—"}</p>
            <p><strong>Role:</strong> {profile.role || "—"}</p>
            <p><strong>Department:</strong> {profile.department || "—"}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="mt-8 bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
