
import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({});
  const [filter, setFilter] = useState("All");
  const [reviewing, setReviewing] = useState(null);

  // Fetch all submissions from backend
  useEffect(() => {
    let ignore = false;

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/submissions");

        if (!ignore) {
          setSubmissions(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
            "Failed to fetch submissions"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchSubmissions();

    return () => {
      ignore = true;
    };
  }, []);

  // Approve or reject submission
  const handleReview = async (id, status) => {
    try {
      setReviewing(id);
      setError("");

      const response = await api.patch(
        `/submissions/${id}/review`,
        {
          status,
          feedback: feedback[id] || "",
        }
      );

      setSubmissions((prev) =>
        prev.map((item) =>
          item._id === id
            ? response.data.submission
            : item
        )
      );

      setFeedback((prev) => ({
        ...prev,
        [id]: "",
      }));

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to review submission"
      );
    } finally {
      setReviewing(null);
    }
  };

  const filteredSubmissions =
    filter === "All"
      ? submissions
      : submissions.filter(
          (item) => item.status === filter
        );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading submissions...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Student Submissions
        </h1>
        <p className="text-slate-500 mt-1">
          Review, evaluate and manage student work.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {[
          {
            title: "Total Submissions",
            value: submissions.length,
            color: "text-slate-800",
          },
          {
            title: "Pending Reviews",
            value: submissions.filter(
              (s) => s.status === "Pending"
            ).length,
            color: "text-amber-600",
          },
          {
            title: "Approved",
            value: submissions.filter(
              (s) => s.status === "Approved"
            ).length,
            color: "text-green-600",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {stat.title}
            </p>
            <h2 className={`text-3xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </h2>
          </div>
        ))}

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {["All", "Pending", "Approved", "Rejected"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-lg text-sm font-medium ${
                filter === status
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Submission List */}
      <div className="space-y-5">

        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center">
            <h3 className="font-semibold text-slate-700">
              No submissions found
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Student submissions will appear here.
            </p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div
              key={submission._id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >

              {/* Student Details */}
              <div className="flex flex-wrap justify-between gap-3">

                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {submission.student?.fullName || "Unknown Student"}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {submission.student?.email}
                  </p>

                  <p className="font-medium text-slate-700 mt-3">
                    {submission.task?.title || "Unknown Task"}
                  </p>
                </div>

                <span
                  className={`h-fit px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    submission.status
                  )}`}
                >
                  {submission.status}
                </span>

              </div>

              <p className="text-xs text-slate-400 mt-3">
                Submitted:{" "}
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>

              {/* Submission Links */}
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Submitted Resources
                </h4>

                <div className="flex flex-wrap gap-3">
                  {[
                    ["GitHub", submission.githubLink],
                    ["Google Drive", submission.driveLink],
                    ["Canva", submission.canvaLink],
                    ["Report", submission.reportLink],
                  ].map(([label, url]) =>
                    url ? (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 font-medium border border-teal-200 px-4 py-2 rounded-lg hover:bg-teal-50"
                      >
                        {label} ↗
                      </a>
                    ) : null
                  )}
                </div>
              </div>

              {/* Existing Feedback */}
              {submission.feedback && (
                <div className="mt-4 bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">
                    Feedback
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    {submission.feedback}
                  </p>
                </div>
              )}

              {/* Review Section */}
              {submission.status === "Pending" && (
                <div className="mt-5 border-t pt-5">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Feedback for Student
                  </label>

                  <textarea
                    rows="2"
                    value={feedback[submission._id] || ""}
                    onChange={(e) =>
                      setFeedback((prev) => ({
                        ...prev,
                        [submission._id]: e.target.value,
                      }))
                    }
                    placeholder="Write feedback here..."
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() =>
                        handleReview(submission._id, "Approved")
                      }
                      disabled={reviewing === submission._id}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      {reviewing === submission._id
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        handleReview(submission._id, "Rejected")
                      }
                      disabled={reviewing === submission._id}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      Reject
                    </button>

                  </div>
                </div>
              )}

            </div>
          ))
        )}

      </div>
    </div>
  );
}
