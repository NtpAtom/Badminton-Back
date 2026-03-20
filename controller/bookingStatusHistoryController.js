const bookingStatusHistoryService = require("../service/bookingStatusHistoryService")

exports.getBookingStatusHistory = async (req, res) => {
    try {
        const result = await bookingStatusHistoryService.getBookingStatusHistory()
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.getBookingStatusHistoryById = async (req, res) => {
    try {
        const result = await bookingStatusHistoryService.getBookingStatusHistoryById(req.params.bsh_id)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.getBookingStatusHistoryByBookingId = async (req, res) => {
    try {
        const result = await bookingStatusHistoryService.getBookingStatusHistoryByBookingId(req.params.booking_id)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.addBookingStatusHistory = async (req, res) => {
    try {
        const { booking_id, old_status, new_status, changed_by } = req.body;
        const result = await bookingStatusHistoryService.addBookingStatusHistory(booking_id, old_status, new_status, changed_by);
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.deleteBookingStatusHistory = async (req, res) => {
    try {
        const result = await bookingStatusHistoryService.deleteBookingStatusHistory(req.params.bsh_id)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
