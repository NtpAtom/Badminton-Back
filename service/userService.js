const db = require("../DB/db")
const user = require("../json/user.json")

exports.getUser = async () => {
    try {
        const result = await db.query(user.selectUser)
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.log(error)
        throw new Error(`GetUser failed: ${error.message}`)
    }
}

exports.getUserById = async (user_id) => {
    try {
        const result = await db.query(user.selectUserById, [user_id])
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.log(error)
        throw new Error(`GetUserById failed: ${error.message}`)
    }
}

exports.addUser = async (user_name, user_email, user_password, user_phone, user_role, branch_id, is_active) => {
    try {
        const result = await db.query(user.addUser, [user_name, user_email, user_password, user_phone, user_role, branch_id, is_active])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {

        if (error.code === '23505') {
            throw new Error(`Email already registered`)
        }
        throw new Error(`addUser failed: ${error.message}`)
    }
}

exports.updateUser = async (user_id, user_name, user_email, user_password, user_phone, user_role, branch_id, is_active) => {
    try {
        const result = await db.query(user.updateUser, [user_name, user_email, user_password, user_phone, user_role, branch_id, is_active, user_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        if (error.code === '23505') {
            throw new Error(`Email already registered`)
        }
        throw new Error(`updateUser failed: ${error.message}`)
    }
}

exports.deleteUser = async (user_id) => {
    try {
        const result = await db.query(user.deleteUser, [user_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        throw new Error(`deleteUser failed: ${error.message}`)
    }
}


