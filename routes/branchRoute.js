const express = require("express")
const branchController = require("../controller/branchController")
const router = express.Router()


router.get("/", branchController.getBranch)
router.get("/:branch_id", branchController.getBranchById)
router.post("/add", branchController.addBranch)
router.put("/update/:branch_id", branchController.updateBranch)
router.delete("/delete/:branch_id", branchController.deleteBranch)

module.exports = router