
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },
    department: {
        type: String
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true
    },
    points: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
