const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Ensure you use a secure key in production

// Signup function
const signup = async (req, res) => {
    try {
        const { username, password, confirmpassword } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render("signup", { error: "Username already exists" });
        }

        // Validate password length and match
        if (password.length < 6) {
            return res.render("signup", { error: "Password must be at least 6 characters" });
        }
        if (password !== confirmpassword) {
            return res.render("signup", { error: "Passwords do not match" });
        }

        // Hash the password and create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.redirect("/api/auth/login"); // Redirect to login page after successful signup
    } catch (e) {
        console.error(e);
        res.render("signup", { error: "An error occurred during signup" });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.render("login", { error: "Invalid credentials" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render("login", { error: "Invalid credentials" });
        }

        // Generate JWT token and set it in a cookie
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.redirect("/api/user"); // Redirect to user page after login
    } catch (e) {
        console.error(e);
        res.render("login", { error: "An error occurred during login" });
    }
};

// Logout function
const logout = (req, res) => {
    res.clearCookie("token"); // Clear JWT token from cookies
    res.redirect("/api/auth/login"); // Redirect to login page after logout
};

module.exports = { signup, login, logout };
