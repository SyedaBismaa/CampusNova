
import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import { submitTask } from "../services/submissionService";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    githubLink: "",
    driveLink: "",
    canvaLink: "",
    reportLink: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await submitTask({
        taskId: selectedTask._id,
        ...form,
      });

      setMessage("Submission successful!");
      setForm({
        githubLink: "",
        driveLink: "",
        canvaLink: "",
        reportLink: "",
      });
      setSelectedTask(null);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-800">
          Available Tasks
        </h1>

        <p className="text-slate-500 mt-2 mb-8">
          Complete your assigned tasks and submit your work.
        </p>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {message && (
          <p className="mb-4 text-teal-700 font-medium">
            {message}
          </p>
        )}

        {tasks.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center">
            No tasks available currently.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-slate-800">
                    {task.title}
                  </h2>

                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs">
                    {task.difficulty}
                  </span>
                </div>

                <p className="text-slate-600 mt-3">
                  {task.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p>Department: {task.department}</p>
                  <p>Points: {task.points}</p>
                  <p>
                    Deadline:{" "}
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setMessage("");
                  }}
                  className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold"
                >
                  Submit Task
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">

              <h2 className="text-xl font-bold mb-2">
                Submit: {selectedTask.title}
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Provide your project links below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {[
                  ["githubLink", "GitHub Repository Link"],
                  ["driveLink", "Google Drive Link"],
                  ["canvaLink", "Canva Design Link"],
                  ["reportLink", "Report Link"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-2">
                      {label}
                    </label>

                    <input
                      type="url"
                      value={form[name]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [name]: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Work"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="w-full border py-3 rounded-lg"
                >
                  Cancel
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
