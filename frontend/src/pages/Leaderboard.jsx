
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

export default function Leaderboard() {
  const { user } = useAuth();

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
            "Unable to load leaderboard"
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

  const currentStudent = students.find(
    (student) => student.id === (user?.id || user?._id)
  );

  const topThree = students.slice(0, 3);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-teal-600">
          STUDENT COMMUNITY
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-2">
          Leaderboard
        </h1>

        <p className="text-slate-500 mt-2">
          Celebrate achievements and see where you stand!
        </p>
      </div>

      {loading ? (
        <p className="text-slate-500 py-10">
          Loading leaderboard...
        </p>
      ) : error ? (
        <p className="text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </p>
      ) : students.length === 0 ? (
        <p className="text-slate-500 bg-white p-8 rounded-xl">
          No students on the leaderboard yet.
        </p>
      ) : (
        <>
          {/* My Rank */}
          {currentStudent && (
            <div className="bg-teal-700 text-white rounded-2xl p-6 flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-teal-100 text-sm">
                  Your Current Ranking
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  Rank #{currentStudent.rank}
                </h2>
              </div>

              <div>
                <p className="text-teal-100 text-sm">
                  Your Total Points
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {currentStudent.points} XP
                </h2>
              </div>
            </div>
          )}

          {/* Top Three */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              Top Performers 🏆
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {topThree.map((student, index) => (
                <div
                  key={student.id}
                  className={`bg-white border rounded-2xl p-6 text-center shadow-sm ${
                    index === 0
                      ? "border-yellow-400"
                      : "border-slate-200"
                  }`}
                >
                  <div className="text-4xl mb-3">
                    {medals[index]}
                  </div>

                  <h3 className="font-bold text-lg text-slate-800">
                    {student.fullName}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {student.department || "Student"}
                  </p>

                  <p className="text-2xl font-bold text-teal-600 mt-4">
                    {student.points} XP
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Rank #{student.rank}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Rankings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h2 className="text-xl font-bold text-slate-800 mb-5">
              All Rankings
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Points</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const isMe =
                      student.id === (user?.id || user?._id);

                    return (
                      <tr
                        key={student.id}
                        className={`border-b border-slate-100 ${
                          isMe ? "bg-teal-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="p-4 font-bold text-teal-600">
                          #{student.rank}
                        </td>

                        <td className="p-4">
                          <span className="font-semibold text-slate-700">
                            {student.fullName}
                          </span>

                          {isMe && (
                            <span className="ml-2 text-xs text-teal-700 font-semibold">
                              You
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-500">
                          {student.department || "—"}
                        </td>

                        <td className="p-4 font-bold text-slate-800">
                          {student.points} XP
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
