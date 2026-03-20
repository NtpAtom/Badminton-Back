const express = require("express")
const bookingStatusHistoryController = require("../controller/bookingStatusHistoryController")
const router = express.Router()
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware")

router.get("/", authenticateToken, bookingStatusHistoryController.getBookingStatusHistory)
router.get("/:bsh_id", authenticateToken, bookingStatusHistoryController.getBookingStatusHistoryById)
router.get("/booking/:booking_id", authenticateToken, bookingStatusHistoryController.getBookingStatusHistoryByBookingId)
router.post("/add", authenticateToken, bookingStatusHistoryController.addBookingStatusHistory)
router.delete("/delete/:bsh_id", authenticateToken, authorizeRole("admin"), bookingStatusHistoryController.deleteBookingStatusHistory)

module.exports = router
