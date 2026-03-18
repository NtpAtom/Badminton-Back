const db = require("../DB/db")
const bookingStatusHistory = require("../json/bookingStatusHistory.json")

exports.getBookingStatusHistory = async () => {
    try {
        const query = bookingStatusHistory.getBookingStatusHistory
        const result = await db.query(query)
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.error(error)
        throw new Error(`GetBookingStatusHistory failed: ${error.message}`)
    }
}

exports.getBookingStatusHistoryById = async (bsh_id) => {
    try {
        const query = bookingStatusHistory.getBookingStatusHistoryById
        const result = await db.query(query, [bsh_id])
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.error(error)
        throw new Error(`GetBookingStatusHistoryById failed: ${error.message}`)
    }
}

exports.getBookingStatusHistoryByBookingId = async (booking_id) => {
    try {
        const query = bookingStatusHistory.getBookingStatusHistoryByBookingId
        const result = await db.query(query, [booking_id])
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.error(error)
        throw new Error(`GetBookingStatusHistoryByBookingId failed: ${error.message}`)
    }
}

exports.addBookingStatusHistory = async (booking_id, old_status, new_status, changed_by) => {
    try {
        const query = bookingStatusHistory.addBookingStatusHistory
        const result = await db.query(query, [booking_id, old_status, new_status, changed_by])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.error(error)
        throw new Error(`AddBookingStatusHistory failed: ${error.message}`)
    }
}

exports.deleteBookingStatusHistory = async (bsh_id) => {
    try {
        const query = bookingStatusHistory.deleteBookingStatusHistory
        const result = await db.query(query, [bsh_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.error(error)
        throw new Error(`DeleteBookingStatusHistory failed: ${error.message}`)
    }
}
