const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")

router.get("/", userController.getUser)
router.get("/:user_id", userController.getUserById)
router.post("/addUser", userController.addUser)
router.put("/update/:user_id", userController.updateUser)
router.delete("/delete/:user_id", userController.deleteUser)

module.exports = router