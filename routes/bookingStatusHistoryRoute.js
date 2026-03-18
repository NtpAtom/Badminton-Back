const express = require("express")
const bookingStatusHistoryController = require("../controller/bookingStatusHistoryController")
const router = express.Router()

router.get("/", bookingStatusHistoryController.getBookingStatusHistory)
router.get("/:bsh_id", bookingStatusHistoryController.getBookingStatusHistoryById)
router.get("/booking/:booking_id", bookingStatusHistoryController.getBookingStatusHistoryByBookingId)
router.post("/add", bookingStatusHistoryController.addBookingStatusHistory)
router.delete("/delete/:bsh_id", bookingStatusHistoryController.deleteBookingStatusHistory)

module.exports = router
