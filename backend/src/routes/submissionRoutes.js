
const express = require("express");
const router = express.Router();

const {
    createSubmission,
    getMySubmissions,
    getAllSubmissions,
    reviewSubmission
} = require("../controllers/submissioncontroller");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Student routes
router.post("/", protect, createSubmission);
router.get("/my", protect, getMySubmissions);

// Admin routes
router.get("/", protect, adminOnly, getAllSubmissions);
router.patch("/:id/review", protect, adminOnly, reviewSubmission);

module.exports = router;
