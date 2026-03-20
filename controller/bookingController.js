const bookingService = require("../service/bookingService")

exports.getBooking = async (req, res) => {
    try {
        const result = await bookingService.getBooking()
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
        const { user_id, court_id, booking_date, start_time, end_time, status, status_id } = req.body;
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
        const { user_id, court_id, booking_date, start_time, end_time, total_price, status, status_id } = req.body;
        const result = await bookingService.updateBooking(req.params.booking_id, user_id, court_id, booking_date, start_time, end_time, total_price, status, status_id); res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
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
