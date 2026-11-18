
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function StudentSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "◫" },
    { name: "My Tasks", path: "/tasks", icon: "☷" },
    { name: "Leaderboard", path: "/leaderboard", icon: "♛" },
    { name: "My Profile", path: "/profile", icon: "♙" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#172d3d] text-white p-5 flex flex-col shrink-0">

      <h1 className="text-2xl font-bold text-teal-400">
        CampusNova
      </h1>

      <p className="text-xs text-slate-400 mt-2 mb-12">
        Student Workspace
      </p>

      <p className="text-xs text-slate-500 mb-4 tracking-widest">
        MENU
      </p>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                isActive
                  ? "bg-teal-700 border-l-4 border-teal-400 text-white"
                  : "text-slate-300 hover:bg-slate-700"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">

        <div className="bg-slate-700/60 p-4 rounded-xl mb-4">
          <p className="font-semibold text-sm">
            {user?.fullName || "Student"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Student Account
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-300 hover:bg-slate-700"
        >
          ↪ Sign Out
        </button>

      </div>
    </aside>
  );
}
