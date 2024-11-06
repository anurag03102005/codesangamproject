const express = require('express');
const authController = require('../controllers/auth.controller')
const router = express();

router.get('/',(req,res)=>{res.send("hi")});
router.get('/login',(req,res)=>{res.render('login.ejs')});
router.get('/signUp',(req,res)=>{res.render('signUp.ejs')});

router.post('/login',authController.login);
router.post('/signUp',authController.signUp);
router.post('/logout',authController.logout);
module.exports = router