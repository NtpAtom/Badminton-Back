const db = require("../DB/db")
const court = require("../json/court.json")

exports.getCourt = async () => {
    try {
        const result = await db.query(court.getCourt)
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


