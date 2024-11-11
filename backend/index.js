const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const authenticate = require("./middlewares/authenticate.js");
require("dotenv").config();

const port = process.env.PORT ;
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
app.use("/api/user", authenticate, userRoutes); // Routes starting from /api/user

// Database Connection
async function connectdb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // Exit the process if the database connection fails
    }
}

// Start Server after DB Connection
connectdb().then(() => {
    app.listen(port, () => {
        console.log(`App is listening at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error("Failed to start server:", error);
});

