const courtService = require("../service/courtService")

exports.getCourt = async (req, res) => {
    try {
        const result = await courtService.getCourt()
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