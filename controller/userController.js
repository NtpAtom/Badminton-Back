const userService = require("../service/userService")

exports.getUser = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, search = '' } = req.query;
        const result = await userService.getUser(search, parseInt(page), parseInt(pageSize), req.user.user_role);
        res.json(result);
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        });
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
        const { user_name, user_email, user_password, user_phone, user_role, branch_id, is_active, old_password } = req.body
        const result = await userService.updateUser(req.params.user_id, user_name, user_email, user_password, user_phone, user_role, branch_id, is_active, old_password)
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

exports.updateUserRole = async (req, res) => {
    try {
        const { user_role, is_active } = req.body
        const result = await userService.updateUserRole(req.params.user_id, user_role, is_active)
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