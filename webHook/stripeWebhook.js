const express = require("express");
const router = express.Router();
const { stripe } = require("../service/stripeService");
const bookingService = require("../service/bookingService");

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET?.trim();

/**
 * POST /webhook/stripe
 * Stripe จะ POST มาที่นี่เมื่อสถานะ payment เปลี่ยน
 * ⚠️  ต้องใช้ raw body (express.raw) ก่อน parse JSON
 */
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`📨 Stripe Webhook received: ${event.type}`);

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const booking_id = paymentIntent.metadata?.booking_id;

        if (!booking_id) {
            console.warn("⚠️  No booking_id in PaymentIntent metadata");
            return res.json({ received: true });
        }

        try {
            await bookingService.confirmBooking(booking_id);
            console.log(`✅ Booking ${booking_id} confirmed via webhook`);
        } catch (err) {
            console.error(`❌ Failed to confirm booking ${booking_id}:`, err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    // ตอบ Stripe ว่า webhook รับสำเร็จ
    res.json({ received: true });
});

module.exports = router;
