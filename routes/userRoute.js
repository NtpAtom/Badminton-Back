const express = require("express")
const router = express.Router()
const { getUser } = require("../service/userService")


router.get("/", async (req, res) => {
    const user = await getUser()
    res.json(user)
})

module.exports = router