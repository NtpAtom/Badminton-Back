const db = require("../DB/db")
const { selectUser } = require("../json/user.json")

const getUser = async () => {
    const result = await db.query(selectUser)
    return result.rows
}

module.exports = {
    getUser
}