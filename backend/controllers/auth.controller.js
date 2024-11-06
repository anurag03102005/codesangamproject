const bcrypt = require('bcrypt');
const User = require('../models/user.model');
function login(req,res){
    console.log("login");
}
async function signUp(req,res){
    const username= req.body.username;
    if()
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
    const newuser = new User({username,password:hashedPassword});
    newuser.save();
    console.log(newuser);
}
function logout(req,res){

}

module.exports = {login,signUp,logout}