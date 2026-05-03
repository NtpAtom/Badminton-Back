const db = require("../DB/db")
const bcrypt = require("bcrypt")
const user = require("../json/user.json")

exports.getUser = async (search = '', page = 1, pageSize = 10, requesterRole = '') => {
    try {
        const offset = (page - 1) * pageSize;
        const searchQuery = `%${search}%`;
        const result = await db.query(user.selectUser, [searchQuery, pageSize, offset, requesterRole]);

        const totalRows = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;

        return {
            status: true,
            data: result.rows,
            total: totalRows
        };
    } catch (error) {
        console.log(error);
        throw new Error(`GetUser failed: ${error.message}`);
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

exports.updateUser = async (user_id, user_name, user_email, user_password, user_phone, user_role, branch_id, is_active, old_password) => {
    try {
        let passwordToSave = user_password;

        // ถ้ามีการส่งรหัสผ่านใหม่มา (user_password จะไม่ใช่ null)
        if (user_password) {
            // 1. ดึงข้อมูลผู้ใช้ปัจจุบันมาเช็ครหัสผ่านเดิม
            const currentUserRes = await db.query(user.selectUserById, [user_id]);
            const currentUser = currentUserRes.rows[0];

            if (!old_password) {
                throw new Error("กรุณากรอกรหัสผ่านเดิมเพื่อยืนยันการเปลี่ยน");
            }

            // 2. เช็คว่ารหัสผ่านเดิมถูกไหม
            const isMatch = await bcrypt.compare(old_password, currentUser.user_password);
            if (!isMatch) {
                throw new Error("รหัสผ่านเดิมไม่ถูกต้อง");
            }

            // 3. เข้ารหัสรหัสผ่านใหม่ก่อนบันทึก
            passwordToSave = await bcrypt.hash(user_password, 10);
        }

        const result = await db.query(user.updateUser, [user_name, user_email, passwordToSave, user_phone, user_role, branch_id, is_active, user_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        if (error.code === '23505') {
            throw new Error(`Email already registered`)
        }
        throw new Error(error.message)
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

exports.updateUserRole = async (user_id, user_role, is_active) => {
    try {
        const result = await db.query(
            "UPDATE users SET user_role = COALESCE($1, user_role), is_active = COALESCE($2, is_active) WHERE user_id = $3 RETURNING *",
            [user_role, is_active, user_id]
        )
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        throw new Error(`updateUserRole failed: ${error.message}`)
    }
}
