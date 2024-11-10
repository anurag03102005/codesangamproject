const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const JWT_SECRET = "your_jwt_secret_key";

async function login(req,res){
    try {
        console.log(req.body);
    let {username,password} = req.body;
    let exisitingUser = await User.findOne({username});
    if(!exisitingUser){
        return res.render('login',{error:"incorrect username"});
    }
    const isValidPassword = await bcrypt.compare(password,exisitingUser.password);
    if(!isValidPassword){
        return res.render('login',{error:"incorrect password"});
    }
    const token = jwt.sign({id:exisitingUser._id,username:exisitingUser.username},JWT_SECRET,{expiresIn:"1h"});
    res.cookie('token',token,{httpOnly:true,maxAge:3600000});
    res.redirect("/api/user");
        
    } catch (error) {
        console.log(error);
        res.render(login,{error:"an error has occured during login"});
    }
    

}
function logout(req,res){
    res.clearCookie('token');
    res.redirect("/api/auth/login");
}
async function signup(req,res){
    try {
        console.log(req.body);
        let {username,password,confirmPassword,email,isTeacher} = req.body;
        isTeacher = isTeacher==="true";
        //password length
        if(password.length<=5){
            return res.render('signup',{error:"Password should if of atleast 6 characters"});
        }
        //confirmPassword!=password
        if(confirmPassword!==password){
            return res.render('signup',{error:"Password and confirm password doesn't match"});
        }
        //unique usename
        let exisitingUser = await User.findOne({username});
        if(exisitingUser){
            return res.render('signup',{error:"Username already exists"});
        }
        //
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        let newUser = new User({username,password:hashedPassword,email,isTeacher});
        await newUser.save();
        res.redirect("/api/auth/login");
        
    } catch (error) {
        console.log(error);
        res.rednder(signup,{error:"an error has occurred in signup"});
    }

}
module.exports = {signup,login,logout}