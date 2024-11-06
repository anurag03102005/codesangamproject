const express = require('express');
const authController = require('../controllers/auth.controller')
const router = express();

router.get('/',(req,res)=>{res.send("hi")});
router.post('/login',authController.login);
router.post('/signUp',authController.signUp);
router.post('/logout',authController.logout);
module.exports = router