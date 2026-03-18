const express = require("express")
const router = express.Router()
const courtController = require("../controller/courtController")

router.get("/", courtController.getCourt)
router.get("/:court_id", courtController.getCourtById)
router.post("/addCourt", courtController.addCourt)
router.put("/update/:court_id", courtController.updateCourt)
router.delete("/delete/:court_id", courtController.deleteCourt)

module.exports = router