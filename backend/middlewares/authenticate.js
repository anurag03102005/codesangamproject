const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Make sure to set this securely in production

// Middleware to check JWT token and authenticate the user
const authenticate = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1]; 

    if (!token) {
        return res.redirect("/api/auth/login"); // If no token, redirect to login
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach the user info to the request object (so it can be accessed in controllers)
        req.user = { id: decoded.id, username: decoded.username };

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.redirect("/api/auth/login"); // If token is invalid, redirect to login
    }
};

module.exports = authenticate;
