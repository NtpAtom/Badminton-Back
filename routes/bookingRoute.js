const express = require("express")
const bookingController = require("../controller/bookingController")
const router = express.Router()
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware")

router.get("/", authenticateToken, bookingController.getBooking)
router.get("/all", authenticateToken, authorizeRole("admin", "super"), bookingController.getAllBookingsByBranchAndDate)
router.get("/:booking_id", authenticateToken, bookingController.getBookingById)
router.post("/add", authenticateToken, bookingController.addBooking)
router.put("/update/:booking_id", authenticateToken, bookingController.updateBooking)
router.delete("/delete/:booking_id", authenticateToken, authorizeRole("admin", "super"), bookingController.deleteBooking)

module.exports = router
