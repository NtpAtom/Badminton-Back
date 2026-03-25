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

exports.getBookingByUserId = async (user_id, startDate, endDate, page = 1, pageSize = 10) => {
    try {
        const offset = (page - 1) * pageSize;
        let query = `
            SELECT b.*, c.court_name, br.branch_name, 
            ROUND(EXTRACT(EPOCH FROM (b.end_time::time - b.start_time::time)) / 3600, 2) as duration_hours 
            FROM booking b 
            JOIN court c ON b.court_id = c.court_id 
            JOIN branch br ON c.branch_id = br.branch_id 
            WHERE b.user_id = $1
        `;
        let countQuery = `SELECT COUNT(*) FROM booking b WHERE b.user_id = $1`;
        const params = [user_id];
        let paramIndex = 2;

        if (startDate && endDate) {
            query += ` AND b.booking_date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
            countQuery += ` AND b.booking_date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
            params.push(startDate, endDate);
            paramIndex += 2;
        } else if (startDate) {
            query += ` AND b.booking_date >= $${paramIndex}`;
            countQuery += ` AND b.booking_date >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        } else if (endDate) {
            query += ` AND b.booking_date <= $${paramIndex}`;
            countQuery += ` AND b.booking_date <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }

        query += ` ORDER BY b.booking_date DESC, b.start_time DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        const finalParams = [...params, pageSize, offset];

        const result = await db.query(query, finalParams);
        const countResult = await db.query(countQuery, params);

        return {
            status: true,
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            pageCount: Math.ceil(parseInt(countResult.rows[0].count) / pageSize)
        }
    } catch (error) {
        console.error(error)
        throw new Error(`GetBookingByUserId failed: ${error.message}`)
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
        const result = await client.query(query, [user_id, court_id, booking_date, start_time, end_time, calculated_total_price, Status, StatusId])

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
