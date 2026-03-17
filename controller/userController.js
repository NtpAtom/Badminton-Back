const userService = require("../service/userService")

exports.getUser = async (req, res) => {
    try {
        const result = await userService.getUser()
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

exports.getUserById = async (req, res) => {
    try {
        const result = await userService.getUserById(req.params.user_id)
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


exports.addUser = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_phone, user_role, branch_id, is_active } = req.body
        const result = await userService.addUser(user_name, user_email, user_password, user_phone, user_role, branch_id, is_active)
        res.json(result)
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_phone, user_role, branch_id, is_active } = req.body
        const result = await userService.updateUser(req.params.user_id, user_name, user_email, user_password, user_phone, user_role, branch_id, is_active)
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

exports.deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.user_id)
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