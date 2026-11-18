
import { useEffect, useState } from "react";
import api from "../services/api";


export default function AdminLeaderboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/leaderboard");

        if (!ignore) {
          setStudents(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
            "Failed to load leaderboard"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Student Leaderboard
        </h2>
        <p className="text-slate-500 mt-1">
          Track student rankings and achievements.
        </p>
      </div>


      {students.length === 0 ? (
        <p className="text-center text-slate-400 py-10">
          No students available yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Points</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 font-bold text-teal-600">
                    #{student.rank}
                  </td>

                  <td className="p-4 font-semibold text-slate-700">
                    {student.fullName}
                  </td>

                  <td className="p-4 text-slate-500">
                    {student.studentId || "—"}
                  </td>

                  <td className="p-4 text-slate-500">
                    {student.department || "—"}
                  </td>

                  <td className="p-4 font-bold text-slate-800">
                    {student.points}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
