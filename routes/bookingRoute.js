const express = require("express")
const bookingController = require("../controller/bookingController")
const router = express.Router()

router.get("/", bookingController.getBooking)
router.get("/:booking_id", bookingController.getBookingById)
router.post("/add", bookingController.addBooking)
router.put("/update/:booking_id", bookingController.updateBooking)
router.delete("/delete/:booking_id", bookingController.deleteBooking)

module.exports = router
