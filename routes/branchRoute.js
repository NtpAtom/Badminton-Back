const express = require("express")
const branchController = require("../controller/branchController")
const router = express.Router()
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware")


router.get("/", branchController.getBranch)
router.get("/:branch_id", branchController.getBranchById)
router.post("/add", authenticateToken, authorizeRole("admin"), branchController.addBranch)
router.put("/update/:branch_id", authenticateToken, authorizeRole("admin"), branchController.updateBranch)
router.delete("/delete/:branch_id", authenticateToken, authorizeRole("admin"), branchController.deleteBranch)

module.exports = router