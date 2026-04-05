const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboardController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

// Dashboard stats - accessible only by admins and super admins
router.get("/stats", authenticateToken, authorizeRole('admin', 'super admin'), dashboardController.getStats);


module.exports = router;
