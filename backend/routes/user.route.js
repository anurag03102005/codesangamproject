const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate"); // Middleware to check JWT authentication
const router = express.Router();

// Get user profile page (after successful login)
router.get("/", authenticate, userController.getMe);
router.get("/profile",userController.getProfile);

module.exports = router;
