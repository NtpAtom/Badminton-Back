const bookingService = require("../service/bookingService")

exports.getBooking = async (req, res) => {
    try {
        const user_id = req.user.user_id
        const { startDate, endDate, page = 1, pageSize = 10 } = req.query;
        const result = await bookingService.getBookingByUserId(user_id, startDate, endDate, parseInt(page), parseInt(pageSize))
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.getBookingById = async (req, res) => {
    try {
        const result = await bookingService.getBookingById(req.params.booking_id)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.addBooking = async (req, res) => {
    try {
        const { court_id, booking_date, start_time, end_time, status, status_id } = req.body;

        // 🔹 ใช้ user_id จากคนท่ี Login อยู่ (จาก Token) แทนการรับจาก Body
        const user_id = req.user.user_id

        const result = await bookingService.addBooking(user_id, court_id, booking_date, start_time, end_time, status, status_id); res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.updateBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const updates = req.body;

        // Fetch existing booking to merge fields
        const existingRes = await bookingService.getBookingById(booking_id);
        if (!existingRes.status || existingRes.data.length === 0) {
            return res.status(404).json({ status: false, message: "Booking not found" });
        }
        const existing = existingRes.data[0];

        const user_id = updates.user_id || existing.user_id;
        const court_id = updates.court_id || existing.court_id;
        const booking_date = updates.booking_date || existing.booking_date;
        const start_time = updates.start_time || existing.start_time;
        const end_time = updates.end_time || existing.end_time;
        const total_price = updates.total_price || existing.total_price;
        const status = updates.status || existing.status;
        const status_id = updates.status_id || existing.status_id;

        const result = await bookingService.updateBooking(booking_id, user_id, court_id, booking_date, start_time, end_time, total_price, status, status_id);
        res.json(result);
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

exports.deleteBooking = async (req, res) => {
    try {
        const result = await bookingService.deleteBooking(req.params.booking_id)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.getAllBookingsByBranchAndDate = async (req, res) => {
    try {
        let branch_id = req.query.branch_id
        const booking_date = req.query.booking_date

        if (!booking_date) {
            return res.status(400).json({ status: false, message: "booking_date is required" })
        }

        // Enforce branch_id for admins
        if (req.user && req.user.user_role === 'admin') {
            branch_id = req.user.branch_id
        }

        if (!branch_id) {
             return res.status(400).json({ status: false, message: "branch_id is required" })
        }

        const result = await bookingService.getAllBookingsByBranchAndDate(branch_id, booking_date)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
