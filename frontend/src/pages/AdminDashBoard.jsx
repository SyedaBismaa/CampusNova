
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const menuItems = [
    { name: "Overview", icon: "◫" },
    { name: "Tasks", icon: "☷" },
    { name: "Submissions", icon: "▤" },
    { name: "Leaderboard", icon: "♛" },
    { name: "Students", icon: "♙" },
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
          <p className="text-sm font-semibold">CampusNova Admin</p>
          <p className="text-xs text-slate-400 mt-1">
            Administration
          </p>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        {/* Top Navbar */}
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

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {[
              { title: "Total Students", icon: "♙" },
              { title: "Active Tasks", icon: "☷" },
              { title: "Pending Reviews", icon: "◷" },
              { title: "Approved Submissions", icon: "✓" },
            ].map((item) => (
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
                  —
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Awaiting API integration
                </p>
              </div>
            ))}

          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

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

              <div className="py-12 text-center">
                <p className="text-3xl text-slate-300">▤</p>
                <p className="font-semibold text-slate-600 mt-3">
                  Submission records will appear here
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Connect the submissions API to view records.
                </p>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-slate-800">
                  Quick Actions
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  ["Create New Task", "Add assignments for students"],
                  ["Review Submissions", "Evaluate student work"],
                  ["View Leaderboard", "Track student performance"],
                ].map(([title, description]) => (
                  <button
                    key={title}
                    onClick={() =>
                      setActiveTab(
                        title === "Create New Task"
                          ? "Tasks"
                          : title === "Review Submissions"
                          ? "Submissions"
                          : "Leaderboard"
                      )
                    }
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

        </div>
      </main>
    </div>
  );
}
