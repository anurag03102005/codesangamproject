// user.controller.js
const User = require("../models/user.model");

// Function to display the user's profile page
const getMe = (req, res) => {
    try {
        // Assuming `req.user` contains user information from the authentication middleware
        res.render("userpage", { user: req.user });
    } catch (error) {
        console.error(error);
        res.render("error", { error: "An error occurred while loading the profile page." });
    }
};

module.exports = { getMe };
