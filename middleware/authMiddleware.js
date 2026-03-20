const jwt = require("jsonwebtoken")

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            status: false,
            message: "Access token is missing"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: false,
                message: "Invalid or expired token"
            })
        }
        req.user = user
        next()
    })
}

exports.authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.user_role) {
            return res.status(403).json({
                status: false,
                message: "Access denied: role not found"
            })
        }

        const userRole = req.user.role.toLowerCase()
        const roles = allowedRoles.map(r => r.toLowerCase())

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                status: false,
                message: "Access denied: insufficient permissions"
            })
        }
        next()
    }
}
