const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

// Routes for rendering signup and login pages
router.get("/signup", (req, res) => res.render("signup"));
router.get("/login", (req, res) => res.render("login"));
router.get("/forgotpassword",(req,res)=>res.render("forgotpassword"));
router.get("/reset/:id/:resettoken",(req,res)=>{res.render("resetpassword")});
// Routes for signup, login, and logout actions
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgotpassword",authController.forgotpassword);
router.post("/reset/:id/:resettoken",authController.resetpassword);


module.exports = router;
