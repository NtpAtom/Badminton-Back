const db = require("../DB/db")
const branch = require("../json/branch.json")



exports.getBranch = async () => {
    try {
        const query = branch.getBranch
        const result = await db.query(query)
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.log(error)
        throw new Error(`GetBranch failed: ${error.message}`)

    }

}

exports.getBranchById = async (branch_id) => {
    try {
        const query = branch.getBranchById
        const result = await db.query(query, [branch_id])
        return {
            status: true,
            data: result.rows
        }
    } catch (error) {
        console.log(error)
        throw new Error(`GetBranchById failed: ${error.message}`)

    }
}

exports.addBranch = async (branch_name, branch_address, open_time, close_time, is_active) => {
    try {
        const query = branch.addBranch
        const result = await db.query(query, [branch_name, branch_address, open_time, close_time, is_active])
        return {
            status: true,
            is_active: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        throw new Error(`AddBranch failed: ${error.message}`)

    }
}

exports.updateBranch = async (branch_id, branch_name, branch_address, open_time, close_time, is_active) => {
    try {
        const query = branch.updateBranch
        const result = await db.query(query, [branch_name, branch_address, open_time, close_time, is_active, branch_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        throw new Error(`UpdateBranch failed: ${error.message}`)

    }
}

exports.deleteBranch = async (branch_id) => {
    try {
        const query = branch.deleteBranch
        const result = await db.query(query, [branch_id])
        return {
            status: true,
            data: result.rows[0]
        }
    } catch (error) {
        console.log(error)
        throw new Error(`DeleteBranch failed: ${error.message}`)

    }
}