const express = require("express");
const router = express.Router();
const stripeController = require("../controller/stripeController");
const { authenticateToken } = require("../middleware/authMiddleware");

// สร้าง PaymentIntent หลัง booking ถูกสร้าง
router.post("/create-payment-intent", authenticateToken, stripeController.createPaymentIntent);

// ยกเลิก booking (กดยกเลิก / หมดเวลา)
router.post("/cancel-booking", authenticateToken, stripeController.cancelBooking);

module.exports = router;
