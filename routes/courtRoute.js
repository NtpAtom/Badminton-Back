const express = require("express")
const router = express.Router()
const courtController = require("../controller/courtController")
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware")

router.get("/", courtController.getCourt)
router.get("/available", courtController.getAvailableCourts)

router.post("/addCourt", authenticateToken, authorizeRole("admin"), courtController.addCourt)
router.get("/:court_id", courtController.getCourtById)
router.put("/update/:court_id", authenticateToken, authorizeRole("admin"), courtController.updateCourt)
router.delete("/delete/:court_id", authenticateToken, authorizeRole("admin"), courtController.deleteCourt)

module.exports = router