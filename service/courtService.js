const db = require("../DB/db")
const court = require("../json/court.json")

exports.getCourt = async (branch_id) => {
    try {
        // เลือกคำสั่ง SQL: ถ้ามี branch_id ให้ใช้คำสั่งดึงตามสาขา ถ้าไม่มีให้ดึงทั้งหมด
        const query = branch_id ? court.getCourtByBranch : court.getCourt
        // กำหนดพารามิเตอร์: ถ้ามี branch_id ให้ส่งค่าเข้าไปใน array ถ้าไม่มีให้เป็น array ว่าง
        const params = branch_id ? [branch_id] : []
        const result = await db.query(query, params)
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.log(error)
        throw new Error(`GetCourt failed: ${error.message}`)
    }
}

exports.getCourtById = async (court_id) => {
    try {
        const result = await db.query(court.getCourtById, [court_id])
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.log(error)
        throw new Error(`getCourtById failed: ${error.message}`)
    }
}

exports.addCourt = async (court_name, price_per_hour, status, branch_id) => {
    try {
        const result = await db.query(court.addCourt, [court_name, price_per_hour, status, branch_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {


        throw new Error(`addCourt failed: ${error.message}`)
    }
}

exports.updateCourt = async (court_id, court_name, price_per_hour, status, branch_id) => {
    try {
        const result = await db.query(court.updateCourt, [court_name, price_per_hour, status, branch_id, court_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        throw new Error(`updateCourt failed: ${error.message}`)
    }
}

exports.deleteCourt = async (court_id) => {
    try {
        const result = await db.query(court.deleteCourt, [court_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        throw new Error(`deleteCourt failed: ${error.message}`)
    }
}

exports.getAvailableCourts = async (branch_id, booking_date, start_time, end_time) => {
    try {
        const result = await db.query(court.getAvailableCourts, [branch_id, booking_date, start_time, end_time])
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.log(error)
        throw new Error(`getAvailableCourts failed: ${error.message}`)
    }
}


