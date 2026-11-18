
const Submission = require("../models/Submission");
const Task = require("../models/Task");
const User = require("../models/User");

// Student submits a task
const createSubmission = async (req, res) => {
    try {
        const {
            taskId,
            githubLink,
            driveLink,
            canvaLink,
            reportLink
        } = req.body;

        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required"
            });
        }

        if (![githubLink, driveLink, canvaLink, reportLink].some(
            link => link && link.trim()
        )) {
            return res.status(400).json({
                message: "At least one submission link is required"
            });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Prevent duplicate active submissions
        const existingSubmission = await Submission.findOne({
            student: req.user.id,
            task: taskId,
            status: { $in: ["Pending", "Approved"] }
        });

        if (existingSubmission) {
            return res.status(400).json({
                message: "You have already submitted this task"
            });
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
        res.status(500).json({
            message: error.message
        });
    }
};


// Student views their submissions
const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            student: req.user.id
        })
        .populate("task", "title description points deadline")
        .sort({ createdAt: -1 });

        res.status(200).json(submissions);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Admin views all submissions
const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate("student", "fullName email department studentId")
            .populate("task", "title points deadline")
            .sort({ createdAt: -1 });

        res.status(200).json(submissions);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Admin approves or rejects submission
const reviewSubmission = async (req, res) => {
    try {
        const { status, feedback } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Approved or Rejected"
            });
        }

        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        const task = await Task.findById(submission.task);

        if (!task) {
            return res.status(404).json({
                message: "Associated task not found"
            });
        }

        // Atomic update prevents reviewing the same submission twice
        const updatedSubmission = await Submission.findOneAndUpdate(
            {
                _id: req.params.id,
                status: "Pending"
            },
            {
                $set: {
                    status,
                    feedback: feedback || "",
                    reviewedBy: req.user.id,
                    reviewedAt: new Date()
                }
            },
            { new: true }
        );

        if (!updatedSubmission) {
            return res.status(400).json({
                message: "Submission has already been reviewed"
            });
        }

        // Award points only after approval
        if (status === "Approved") {
            await User.findByIdAndUpdate(
                submission.student,
                {
                    $inc: { points: task.points }
                }
            );
        }

        res.status(200).json({
            message: `Submission ${status.toLowerCase()} successfully`,
            submission: updatedSubmission
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createSubmission,
    getMySubmissions,
    getAllSubmissions,
    reviewSubmission
};
