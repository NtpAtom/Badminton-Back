const branchService = require("../service/branchService")

exports.getBranch = async (req, res) => {
    try {
        const result = await branchService.getBranch()
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

exports.getBranchById = async (req, res) => {
    try {
        const result = await branchService.getBranchById(req.params.branch_id)
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

exports.addBranch = async (req, res) => {
    try {
        const { branch_name, branch_address, open_time, close_time, is_active } = req.body;
        const result = await branchService.addBranch(branch_name, branch_address, open_time, close_time, is_active); res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })
    }
}

exports.updateBranch = async (req, res) => {
    try {
        const { branch_name, branch_address, open_time, close_time, is_active } = req.body;
        const result = await branchService.updateBranch(req.params.branch_id, branch_name, branch_address, open_time, close_time, is_active); res.json(result)
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })
    }
}

exports.deleteBranch = async (req, res) => {
    try {
        const result = await branchService.deleteBranch(req.params.branch_id)
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
