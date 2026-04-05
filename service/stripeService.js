const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * สร้าง PaymentIntent สำหรับการจอง
 * @param {number} amount - ราคารวม (บาท)
 * @param {string} booking_id - ID การจอง
 */
exports.createPaymentIntent = async (amount, booking_id) => {
    // Stripe ใช้หน่วยเป็น satang (1 บาท = 100 satang)
    const amountInSatang = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInSatang,
        currency: "thb",
        metadata: { booking_id },
        automatic_payment_methods: { enabled: true },
    });

    return paymentIntent;
};

/**
 * ยกเลิก PaymentIntent (กรณี user กดยกเลิก / หมดเวลา)
 * @param {string} paymentIntentId
 */
exports.cancelPaymentIntent = async (paymentIntentId) => {
    try {
        const cancelled = await stripe.paymentIntents.cancel(paymentIntentId);
        return cancelled;
    } catch (err) {
        // ถ้า PI หมดอายุหรือถูก cancel ไปแล้ว ไม่ต้อง throw
        console.warn("PaymentIntent cancel warning:", err.message);
        return null;
    }
};

exports.stripe = stripe;
