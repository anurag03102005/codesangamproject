const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

// Routes for rendering signup and login pages
router.get("/signup", (req, res) => res.render("signup"));
router.get("/login", (req, res) => res.render("login"));

// Routes for signup, login, and logout actions
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
