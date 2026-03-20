const db = require("../DB/db")
const booking = require("../json/booking.json")
const bookingStatusHistory = require("../json/bookingStatusHistory.json")

exports.getBooking = async () => {
    try {
        const query = booking.getBooking
        const result = await db.query(query)
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.error(error)
        throw new Error(`GetBooking failed: ${error.message}`)
    }
}

exports.getBookingById = async (booking_id) => {
    try {
        const query = booking.getBookingById
        const result = await db.query(query, [booking_id])
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.error(error)
        throw new Error(`GetBookingById failed: ${error.message}`)
    }
}

exports.addBooking = async (
    user_id,
    court_id,
    booking_date,
    start_time,
    end_time,
    status,
    status_id
) => {
    const client = await db.connect()

    // 📌 Default Status to 'Pending' (ed5cf29e-f83e-4ab1-9c21-44c56f550c12)
    const Status = status || 'Pending'
    const StatusId = status_id || 'ed5cf29e-f83e-4ab1-9c21-44c56f550c12'

    try {
        await client.query("BEGIN")

        // 🔹 validate
        if (!user_id || !court_id || !booking_date || !start_time || !end_time) {
            throw new Error("Missing required fields")
        }

        const start = new Date(`1970-01-01T${start_time}`)
        const end = new Date(`1970-01-01T${end_time}`)

        if (end <= start) {
            throw new Error("Invalid time range")
        }

        const diffHours = (end - start) / (1000 * 60 * 60)

        if (diffHours < 1) {
            throw new Error("Booking must be at least 1 hour")
        }

        // 🔒 LOCK กันกดพร้อมกัน
        await client.query(
            `SELECT 1 FROM booking
             WHERE court_id = $1 AND booking_date = $2
             FOR UPDATE`,
            [court_id, booking_date]
        )

        // 💰 ดึงราคาต่อชั่วโมงเพื่อคำนวณราคาสุทธิ
        const courtRes = await client.query(
            "SELECT price_per_hour FROM court WHERE court_id = $1",
            [court_id]
        )
        if (courtRes.rows.length === 0) {
            throw new Error("Court not found")
        }
        const price_per_hour = parseFloat(courtRes.rows[0].price_per_hour)
        const calculated_total_price = diffHours * price_per_hour

        // 🔍 เช็คเวลาชน
        const conflict = await client.query(
            `SELECT 1 FROM booking
             WHERE court_id = $1
             AND booking_date = $2
             AND (start_time < $4 AND end_time > $3)`,
            [court_id, booking_date, start_time, end_time]
        )

        if (conflict.rows.length > 0) {
            throw new Error("Time slot already booked")
        }


        const query = booking.addBooking
        const result = await client.query(query, [user_id, court_id, booking_date, start_time, end_time, calculated_total_price, finalStatus, finalStatusId])

        const newBooking = result.rows[0];

        // 📝 บันทึกประวัติสถานะการจอง (Booking History)
        const historyQuery = bookingStatusHistory.addBookingStatusHistory
        await client.query(historyQuery, [newBooking.booking_id, null, Status, user_id, null, StatusId])

        await client.query("COMMIT")

        return {
            status: true,
            data: newBooking
        }

    } catch (error) {
        await client.query("ROLLBACK")
        throw new Error(`AddBooking failed: ${error.message}`)
    } finally {
        client.release()
    }
}

exports.updateBooking = async (booking_id, user_id, court_id, booking_date, start_time, end_time, total_price, status, status_id) => {
    try {
        const query = booking.updateBooking
        const result = await db.query(query, [user_id, court_id, booking_date, start_time, end_time, total_price, status, status_id, booking_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.error(error)
        throw new Error(`UpdateBooking failed: ${error.message}`)
    }
}

exports.deleteBooking = async (booking_id) => {
    try {
        const query = booking.deleteBooking
        const result = await db.query(query, [booking_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.error(error)
        throw new Error(`DeleteBooking failed: ${error.message}`)
    }
}
