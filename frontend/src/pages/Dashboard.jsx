
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getTasks } from "../services/taskService";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome, {user?.fullName || "Student"}!
          </h1>
          <p className="text-slate-500">Your CampusNova dashboard</p>
        </div>
        <Link to="/tasks" className="bg-teal-600 text-white px-5 py-2 rounded-lg">
          View Tasks
        </Link>
      </header>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p className="text-slate-500">No tasks available currently.</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <div key={task._id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-slate-600 mt-2">{task.description}</p>
              <p className="text-sm mt-3">Points: {task.points}</p>
              <p className="text-sm">Difficulty: {task.difficulty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
