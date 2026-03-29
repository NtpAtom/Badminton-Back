const authService = require("../service/authService")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_phone, user_role, branch_id, is_active } = req.body
        const result = await authService.register(user_name, user_email, user_password, user_phone, user_role, branch_id, is_active)
        res.json({
            status: true,
            user: result
        })

    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { user_email, user_password } = req.body
        const user = await authService.login(user_email, user_password)
        const token = jwt.sign({ user_id: user.user_id, user_role: user.user_role, branch_id: user.branch_id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" })
        res.json({
            status: true,
            user: user,
            token: token
        })
    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            status: false,
            message: error.message,
            code: error.code,
        })

    }
}
