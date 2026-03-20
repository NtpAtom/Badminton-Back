const authService = require("../service/authService")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_phone, user_role, branch_id, is_active } = req.body
        const result = await authService.register(user_name, user_email, user_password, user_phone, user_role, branch_id, is_active)
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

exports.login = async (req, res) => {
    try {
        const { user_email, user_password } = req.body
        const user = await authService.login(user_email, user_password)
        const token = jwt.sign({ 
            user_id: user.data.user_id, 
            user_name: user.data.user_name, // 🔹 เพิ่มชื่อเข้าไปใน Token
            user_role: user.data.user_role   // 🔹 ใช้ user_role ตามที่คุณต้องการ
        },
            process.env.JWT_SECRET,
            { expiresIn: "1h" })
        res.json({
            status: true,
            data: user,
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
