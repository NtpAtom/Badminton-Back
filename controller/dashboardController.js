const dashboardService = require("../service/dashboardService");

exports.getStats = async (req, res) => {
    try {
        const { startDate, endDate, branchIds } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ 
                status: false, 
                message: "startDate and endDate are required" 
            });
        }

        // Security Enforcement: Restricted Admins can only see their own branch
        let branches = null;
        if (req.user && req.user.user_role === 'admin') {
            // Force the branch filter to the admin's assigned branch
            branches = [req.user.branch_id];
        } else if (branchIds) {
            // Super admins or others can use the multi-select filter
            branches = Array.isArray(branchIds) ? branchIds : branchIds.split(',');
        }

        const result = await dashboardService.getDashboardData(startDate, endDate, branches);
        res.json(result);

    } catch (error) {
        console.error("dashboardController ERROR:", error);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
