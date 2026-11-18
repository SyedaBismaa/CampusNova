
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/profile");

                if (!ignore) {
                    setUser(response.data.user);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load profile"
                    );
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            ignore = true;
        };
    }, []);

    if (loading) {
        return <p className="text-slate-500">Loading profile...</p>;
    }

    if (error) {
        return (
            <p className="text-red-600 bg-red-50 p-4 rounded-lg">
                {error}
            </p>
        );
    }

    if (!user) return null;

    const initials = user.fullName
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Heading */}
            <div>
                <p className="text-xs font-semibold tracking-widest text-teal-600">
                    STUDENT ACCOUNT
                </p>

                <h1 className="text-3xl font-bold text-slate-800 mt-2">
                    My Profile
                </h1>

                <p className="text-slate-500 mt-2">
                    Manage your personal information and achievements.
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                <div className="flex flex-col sm:flex-row items-center gap-6">

                    <div className="w-24 h-24 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-3xl font-bold">
                        {initials || "ST"}
                    </div>

                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {user.fullName}
                        </h2>

                        <p className="text-slate-500 mt-1">
                            {user.email}
                        </p>

                        <span className="inline-block mt-3 px-4 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                            Student Account
                        </span>
                    </div>

                </div>

            </div>

            {/* Achievement Card */}
            <div className="bg-[#172d3d] text-white rounded-2xl p-7">

                <p className="text-slate-300 text-sm">
                    Total Achievement Points
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {user.points || 0} XP
                </h2>

                <p className="text-slate-400 text-sm mt-2">
                    Keep completing tasks to earn more points!
                </p>

            </div>

            {/* Personal Information */}
            <div className="bg-white border border-slate-200 rounded-2xl p-7">

                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {[
                        ["Full Name", user.fullName],
                        ["Email Address", user.email],
                        ["Student ID", user.studentId],
                        ["Department", user.department],
                        ["Account Type", user.role],
                        [
                            "Member Since",
                            user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "—"
                        ]
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="border-b border-slate-100 pb-4"
                        >
                            <p className="text-sm text-slate-400">
                                {label}
                            </p>

                            <p className="font-semibold text-slate-700 mt-2">
                                {value || "Not provided"}
                            </p>
                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}
