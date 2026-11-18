
const User = require("../models/User");

const getLeaderboard = async (req, res) => {
    try {
        const students = await User.find({
            role: "student"
        })
        .select("fullName email department studentId points")
        .sort({
            points: -1,
            fullName: 1
        })
        .lean();

        const leaderboard = students.map((student, index) => ({
            rank: index + 1,
            id: student._id,
            fullName: student.fullName,
            department: student.department,
            studentId: student.studentId,
            points: student.points
        }));

        res.status(200).json(leaderboard);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getLeaderboard };
