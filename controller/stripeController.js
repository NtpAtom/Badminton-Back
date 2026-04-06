const stripeService = require("../service/stripeService");
const bookingService = require("../service/bookingService");

/**
 * POST /api/stripe/create-payment-intent
 * สร้าง PaymentIntent หลังจาก booking ถูกสร้างแล้ว
 */
exports.createPaymentIntent = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const user_id = req.user.user_id;

        if (!booking_id) {
            return res.status(400).json({ status: false, message: "booking_id is required" });
        }

        // ดึงข้อมูล booking เพื่อเอาราคา
        const bookingRes = await bookingService.getBookingById(booking_id);
        if (!bookingRes.status || bookingRes.data.length === 0) {
            return res.status(404).json({ status: false, message: "Booking not found" });
        }

        const booking = bookingRes.data[0];

        // ตรวจสอบว่า booking เป็นของ user นี้จริง
        if (booking.user_id !== user_id) {
            return res.status(403).json({ status: false, message: "Access denied" });
        }

        const paymentIntent = await stripeService.createPaymentIntent(
            parseFloat(booking.total_price),
            booking_id
        );

        return res.json({
            status: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error("createPaymentIntent ERROR:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * POST /api/stripe/confirm-booking
 * ยืนยัน booking หลังจ่ายเงินสำเร็จจาก Frontend โดยตรง
 */
exports.confirmBooking = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const user_id = req.user.user_id;

        if (!booking_id) {
            return res.status(400).json({ status: false, message: "booking_id is required" });
        }

        // ตรวจสอบว่า booking เป็นของ user นี้จริง
        const bookingRes = await bookingService.getBookingById(booking_id);
        if (!bookingRes.status || bookingRes.data.length === 0) {
            return res.status(404).json({ status: false, message: "Booking not found" });
        }
        const booking = bookingRes.data[0];
        if (booking.user_id !== user_id) {
            return res.status(403).json({ status: false, message: "Access denied" });
        }

        const result = await bookingService.confirmBooking(booking_id);
        return res.json(result);
    } catch (error) {
        console.error("confirmBooking ERROR:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * POST /api/stripe/cancel-booking
 * ยกเลิก booking (กดยกเลิก หรือหมดเวลา 3 นาที)
 */
exports.cancelBooking = async (req, res) => {
    try {
        const { booking_id, payment_intent_id } = req.body;
        const user_id = req.user.user_id;

        if (!booking_id) {
            return res.status(400).json({ status: false, message: "booking_id is required" });
        }

        // ยกเลิก PaymentIntent ใน Stripe (ถ้ามี)
        if (payment_intent_id) {
            await stripeService.cancelPaymentIntent(payment_intent_id);
        }

        // อัปเดตสถานะ booking เป็น Cancelled
        const result = await bookingService.cancelBooking(booking_id, user_id);

        return res.json(result);
    } catch (error) {
        console.error("cancelBooking ERROR:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};
