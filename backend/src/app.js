const express = require("express");
const cors = require("cors");

const app = express();

// MIDDLEWARE FIRST
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

// ROUTES AFTER CORS
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

const submissionRoutes = require("./routes/submissionRoutes");
app.use("/api/submissions", submissionRoutes);

const leaderboardRoutes = require("./routes/leaderboardRoutes");
app.use("/api/leaderboard", leaderboardRoutes);


module.exports = app;



