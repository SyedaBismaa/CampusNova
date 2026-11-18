
import { useEffect, useState } from "react";
import api from "../services/api";

import AdminTasks from "../components/AdminTasks";
import AdminSubmissions from "./AdminSubmissions";
import AdminLeaderboard from "./AdminLeaderboard";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const menuItems = [
    { name: "Overview", icon: "◫" },
    { name: "Tasks", icon: "☷" },
    { name: "Submissions", icon: "▤" },
    { name: "Leaderboard", icon: "♛" },
    { name: "Students", icon: "♙" },
  ];

  // Fetch dashboard data
  useEffect(() => {
    let ignore = false;

    const fetchDashboardData = async () => {
      try {
        const [taskResponse, submissionResponse] =
          await Promise.all([
            api.get("/tasks"),
            api.get("/submissions"),
          ]);

        if (!ignore) {
          setTasks(taskResponse.data);
          setSubmissions(submissionResponse.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
            "Failed to load dashboard data"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      ignore = true;
    };
  }, []);

  // Dashboard statistics
  const uniqueStudents = new Set(
    submissions
      .map((item) => item.student?._id)
      .filter(Boolean)
  ).size;

  const stats = [
    {
      title: "Students with Submissions",
      value: uniqueStudents,
      icon: "♙",
    },
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: "☷",
    },
    {
      title: "Pending Reviews",
      value: submissions.filter(
        (item) => item.status === "Pending"
      ).length,
      icon: "◷",
    },
    {
      title: "Approved Submissions",
      value: submissions.filter(
        (item) => item.status === "Approved"
      ).length,
      icon: "✓",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#172d3d] text-white p-5 hidden md:flex flex-col">

        <h1 className="text-2xl font-bold text-teal-400 mb-2">
          CampusNova
        </h1>

        <p className="text-xs text-slate-400 mb-12">
          Admin Workspace
        </p>

        <p className="text-xs text-slate-500 mb-4 tracking-widest">
          WORKSPACE
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition ${
                activeTab === item.name
                  ? "bg-teal-700 border-l-4 border-teal-400"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-slate-700/60 p-4 rounded-xl">
          <p className="text-sm font-semibold">
            CampusNova Admin
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Administration
          </p>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        {/* Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex justify-between items-center">

          <div>
            <p className="text-xs text-slate-400">
              Workspace / {activeTab}
            </p>

            <h2 className="text-xl font-bold text-slate-800">
              {activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-slate-500">
              System Online
            </span>
          </div>

        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* TASK MANAGEMENT */}
          {activeTab === "Tasks" && (
            <AdminTasks />
          )}
          {activeTab === "Leaderboard" && (
  <AdminLeaderboard />
)}

          {/* SUBMISSIONS MANAGEMENT */}
          {activeTab === "Submissions" && (
            <AdminSubmissions />
          )}

          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <>

              <div className="mb-8">
                <p className="text-xs tracking-widest text-teal-600 font-semibold">
                  ADMINISTRATION
                </p>

                <h1 className="text-3xl font-bold text-slate-800 mt-2">
                  Welcome back, Admin.
                </h1>

                <p className="text-slate-500 mt-2">
                  Manage student activities and track campus progress.
                </p>
              </div>

              {loading ? (
                <p className="text-slate-500 py-10">
                  Loading dashboard data...
                </p>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-5 rounded-xl">
                  {error}
                </div>
              ) : (
                <>

                  {/* Statistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                    {stats.map((item) => (
                      <div
                        key={item.title}
                        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                      >

                        <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center text-xl">
                          {item.icon}
                        </div>

                        <p className="text-sm text-slate-500 mt-5">
                          {item.title}
                        </p>

                        <p className="text-3xl font-bold text-slate-800 mt-2">
                          {item.value}
                        </p>

                      </div>
                    ))}

                  </div>

                  {/* Main Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                    {/* Recent Submissions */}
                    <section className="bg-white border border-slate-200 rounded-xl p-6">

                      <div className="flex justify-between items-center mb-5">

                        <h3 className="font-bold text-slate-800">
                          Recent Submissions
                        </h3>

                        <button
                          onClick={() => setActiveTab("Submissions")}
                          className="text-teal-600 text-sm font-semibold"
                        >
                          View all →
                        </button>

                      </div>

                      {submissions.length === 0 ? (
                        <p className="text-center text-slate-400 py-10">
                          No submissions available.
                        </p>
                      ) : (
                        <div className="space-y-4">

                          {submissions.slice(0, 5).map((item) => (
                            <div
                              key={item._id}
                              className="border-b border-slate-100 pb-4 last:border-0"
                            >

                              <div className="flex justify-between gap-3">

                                <div>
                                  <p className="font-semibold text-slate-700">
                                    {item.student?.fullName || "Student"}
                                  </p>

                                  <p className="text-sm text-slate-500 mt-1">
                                    {item.task?.title || "Task"}
                                  </p>
                                </div>

                                <span
                                  className={`text-xs font-semibold h-fit px-3 py-1 rounded-full ${
                                    item.status === "Approved"
                                      ? "bg-green-100 text-green-700"
                                      : item.status === "Rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {item.status || "Pending"}
                                </span>

                              </div>
                            </div>
                          ))}

                        </div>
                      )}

                    </section>

                    {/* Quick Actions */}
                    <section className="bg-white border border-slate-200 rounded-xl p-6">

                      <h3 className="font-bold text-slate-800 mb-5">
                        Quick Actions
                      </h3>

                      <div className="space-y-3">

                        {[
                          ["Create New Task", "Add assignments for students", "Tasks"],
                          ["Review Submissions", "Evaluate student work", "Submissions"],
                          ["View Leaderboard", "Track student performance", "Leaderboard"],
                        ].map(([title, description, tab]) => (
                          <button
                            key={title}
                            onClick={() => setActiveTab(tab)}
                            className="w-full text-left p-4 border border-slate-100 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition"
                          >

                            <p className="font-semibold text-slate-700">
                              {title} →
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              {description}
                            </p>

                          </button>
                        ))}

                      </div>

                    </section>

                  </div>

                </>
              )}

            </>
          )}

          {/* LEADERBOARD AND STUDENTS PLACEHOLDERS */}
        

        </div>

      </main>
    </div>
  );
}
