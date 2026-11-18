
import { useEffect, useState } from "react";
import api from "../services/api";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/submissions/my");
        setSubmissions(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to fetch submissions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="p-8">Loading submissions...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-3xl font-bold text-slate-800">
        My Submissions
      </h1>

      <p className="text-slate-500 mt-2 mb-8">
        Track your submitted tasks and their review status.
      </p>

      {submissions.length === 0 ? (
        <p className="bg-white p-6 rounded-xl">
          You haven't submitted any tasks yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {submissions.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <h2 className="text-xl font-semibold">
                {item.task?.title || "Task"}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Submitted:{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "Date unavailable"}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                {["githubLink", "driveLink", "canvaLink", "reportLink"].map(
                  (field) =>
                    item[field] && (
                      <p key={field}>
                        <span className="font-medium">
                          {field.replace("Link", "")}:{" "}
                        </span>
                        <a
                          href={item[field]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-600 underline"
                        >
                          View
                        </a>
                      </p>
                    )
                )}
              </div>

              <div className="mt-5">
                <span className="font-medium">Status: </span>
                <span
                  className={`font-semibold ${
                    item.status === "Approved"
                      ? "text-green-600"
                      : item.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {item.status || "Pending"}
                </span>
              </div>

              {item.feedback && (
                <p className="mt-3 text-sm text-slate-600">
                  **Admin Feedback:** {item.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
