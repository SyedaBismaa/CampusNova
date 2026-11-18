
import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  title: "",
  description: "",
  department: "",
  difficulty: "Beginner",
  points: "",
  deadline: "",
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTasks = async () => {
  try {
    const response = await api.get("/tasks");
    setTasks(response.data);
    setError("");
  } catch (err) {
    setError(
      err.response?.data?.message || "Failed to fetch tasks"
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  let isMounted = true;

  api.get("/tasks")
    .then((response) => {
      if (isMounted) {
        setTasks(response.data);
        setError("");
      }
    })
    .catch((err) => {
      if (isMounted) {
        setError(
          err.response?.data?.message || "Failed to fetch tasks"
        );
      }
    })
    .finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

  return () => {
    isMounted = false;
  };
}, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        points: Number(form.points),
      };

      if (editingId) {
        await api.put(`/tasks/${editingId}`, payload);
        setSuccess("Task updated successfully!");
      } else {
        await api.post("/tasks", payload);
        setSuccess("Task created successfully!");
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await fetchTasks();

    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title || "",
      description: task.description || "",
      department: task.department || "",
      difficulty: task.difficulty || "Beginner",
      points: task.points ?? "",
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().slice(0, 10)
        : "",
    });

    setEditingId(task._id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await api.delete(`/tasks/${id}`);
      setSuccess("Task deleted successfully!");
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const cancelForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-teal-600">
            ADMINISTRATION
          </p>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            Task Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Create, manage and assign student tasks.
          </p>
        </div>

        <button
          onClick={() => {
            cancelForm();
            setShowForm(true);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Create New Task
        </button>
      </div>

      {/* Messages */}
      {error && (
        <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </p>
      )}

      {success && (
        <p className="bg-teal-50 text-teal-700 p-3 rounded-lg text-sm">
          {success}
        </p>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

          <h3 className="text-lg font-bold text-slate-800 mb-5">
            {editingId ? "Edit Task" : "Create New Task"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-2">
                Task Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter task title"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe the task..."
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Department
                </label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  placeholder="Computer Science"
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Points
                </label>
                <input
                  type="number"
                  name="points"
                  value={form.points}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="100"
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Task"
                  : "Create Task"}
              </button>

              <button
                type="button"
                onClick={cancelForm}
                className="border border-slate-300 px-6 py-3 rounded-lg text-slate-600"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Task List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-800">
            All Tasks ({tasks.length})
          </h3>
<button
  onClick={() => {
    setLoading(true);
    fetchTasks();
  }}
  className="text-sm text-teal-600 font-semibold"
>
  Refresh
</button>
        </div>

        {loading ? (
          <p className="text-center py-10 text-slate-500">
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-center py-10 text-slate-400">
            No tasks found. Create your first task.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {tasks.map((task) => (
              <div
                key={task._id}
                className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-3">

                  <h4 className="font-bold text-slate-800 text-lg">
                    {task.title}
                  </h4>

                  <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                    {task.difficulty}
                  </span>

                </div>

                <p className="text-sm text-slate-500 mt-3">
                  {task.description}
                </p>

                <div className="text-sm text-slate-600 space-y-2 mt-5">
                  <p>Department: {task.department}</p>
                  <p>Points: {task.points}</p>
                  <p>
                    Deadline:{" "}
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleEdit(task)}
                    className="flex-1 border border-teal-600 text-teal-700 hover:bg-teal-50 py-2 rounded-lg text-sm font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}
