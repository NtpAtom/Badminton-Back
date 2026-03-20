const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const authController = require("../controller/authController")
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware")

router.post("/register", authController.register)
router.post("/login", authController.login)

router.get("/", authenticateToken, authorizeRole("admin"), userController.getUser)
router.get("/:user_id", authenticateToken, userController.getUserById)
router.put("/update/:user_id", authenticateToken, userController.updateUser)
router.delete("/delete/:user_id", authenticateToken, authorizeRole("admin"), userController.deleteUser)

module.exports = router