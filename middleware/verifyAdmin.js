// middleware/verifyAdmin.js
const verifyAdmin = (req, res, next) => {
    // verifyJWT middleware should be called before this middleware
    // to ensure req.user is available
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user information" });
    }
    console.log(req.user)

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
};

module.exports = verifyAdmin;
