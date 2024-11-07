const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const port = 8080;
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Route Setup
app.use("/api/auth", authRoutes); // Routes for signup, login, and logout
app.use("/api/user", userRoutes); // Routes starting from /api/user

// Database Connection
async function connectdb() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/test");
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

// Start Server
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
    connectdb();
});
