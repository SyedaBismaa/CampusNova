
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },

    githubLink: String,
    driveLink: String,
    canvaLink: String,
    reportLink: String,

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },

    feedback: {
        type: String,
        default: ""
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    reviewedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
