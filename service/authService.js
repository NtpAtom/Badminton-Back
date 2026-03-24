const db = require("../DB/db")
const bcrypt = require("bcrypt")

const users = require("../json/user.json")
const validator = require("validator");


exports.register = async (user_name, user_email, user_password, user_phone, branch_id) => {
    try {
        if (!validator.isEmail(user_email)) {
            throw new Error("Invalid email");
        }
        const hashed = await bcrypt.hash(user_password, 10)

        // 🔹 ถ้าเป็น User ทั่วไป branch_id จะเป็น null (แก้ปัญหา Error: invalid input syntax for type uuid: "")
        const branchUser = (branch_id === "" || !branch_id) ? null : branch_id
        const userRole = "user"
        const isActive = true


        const query = (users.addUser)
        const result = await db.query(query, [user_name, user_email, hashed, user_phone, userRole, branchUser, isActive])

        return result.rows[0]
    } catch (error) {
        console.log(error)
        if (error.code === '23505') {
            throw new Error(`Email already registered`)
        }
        throw new Error(`register failed: ${error.message}`)
    }


}

exports.login = async (user_email, user_password) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE user_email = $1", [user_email])

        if (result.rows.length === 0) {
            throw new Error("User not Found")
        }

        const user = result.rows[0]
        const isMatch = await bcrypt.compare(user_password, user.user_password)
        if (!isMatch) {
            throw new Error("password is not match")
        }
        return {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_phone: user.user_phone,
            user_role: user.user_role,
            branch_id: user.branch_id,
            is_active: user.is_active
        }


    } catch (error) {
        console.log(error)
        throw new Error(`login failed: ${error.message}`)
    }
}
