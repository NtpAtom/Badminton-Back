const courtService = require("../service/courtService")

exports.getCourt = async (req, res) => {
    try {
        let branch_id = req.query.branch_id
        
        // Enforce branch_id for admins
        if (req.user && req.user.user_role === 'admin') {
            branch_id = req.user.branch_id
        }

        const result = await courtService.getCourt(branch_id)
        res.json(result)

    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })

    }
}

exports.getCourtById = async (req, res) => {
    try {
        const result = await courtService.getCourtById(req.params.court_id)
        res.json(result)

    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })

    }
}


exports.addCourt = async (req, res) => {
    try {
        const { court_name, price_per_hour, status, branch_id } = req.body
        const result = await courtService.addCourt(court_name, price_per_hour, status, branch_id)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })
    }
}

exports.updateCourt = async (req, res) => {
    try {
        const { court_name, price_per_hour, status, branch_id } = req.body
        const result = await courtService.updateCourt(req.params.court_id, court_name, price_per_hour, status, branch_id)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })
    }
}

exports.deleteCourt = async (req, res) => {
    try {
        const result = await courtService.deleteCourt(req.params.court_id)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })
    }
}

exports.getAvailableCourts = async (req, res) => {
    try {
        const { branch_id, booking_date, start_time, end_time } = req.query
        const result = await courtService.getAvailableCourts(branch_id, booking_date, start_time, end_time)
        res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })
    }
}