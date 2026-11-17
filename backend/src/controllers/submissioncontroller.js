
const Submission = require("../models/Submission");
const Task = require("../models/Task");
const User = require("../models/User");

// Submit Task
const createSubmission = async (req, res) => {
    try {
        const { taskId, githubLink, driveLink, canvaLink, reportLink } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const submission = await Submission.create({
            student: req.user.id,
            task: taskId,
            githubLink,
            driveLink,
            canvaLink,
            reportLink
        });

        res.status(201).json({
            message: "Submission successful",
            submission
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get My Submissions
const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            student: req.user.id
        }).populate("task", "title points deadline");

        res.status(200).json(submissions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Submissions (Admin)
const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate("student", "fullName email department")
            .populate("task", "title points");

        res.status(200).json(submissions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Review Submission
const reviewSubmission = async (req, res) => {
    try {
        const { status, feedback } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        if (submission.status !== "Pending") {
            return res.status(400).json({
                message: "Submission already reviewed"
            });
        }

        submission.status = status;
        submission.feedback = feedback || "";
        submission.reviewedBy = req.user.id;
        submission.reviewedAt = new Date();

        await submission.save();

        if (status === "Approved") {
            const task = await Task.findById(submission.task);

            await User.findByIdAndUpdate(submission.student, {
                $inc: { points: task.points }
            });
        }

        res.status(200).json({
            message: `Submission ${status.toLowerCase()} successfully`,
            submission
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubmission,
    getMySubmissions,
    getAllSubmissions,
    reviewSubmission
};
