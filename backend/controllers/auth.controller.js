//anurag
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
async function login(req,res){
    const username= req.body.username;
    const password = req.body.password;
    const existingUser = await User.findOne({ username: username });
    if(!existingUser){
        return res.status(400).json({ message: 'Username already exist' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:'Incorrect password'});
    }
    console.log("login");
}
async function signUp(req,res){
    const username= req.body.username;
    const password = req.body.password;
    const confirm = req.body.confirm;
    const existingUser = await User.findOne({ username: username });
    if(existingUser){
        return res.status(400).json({ message: 'Username already exist' });
    }
    if(confirm!==password){
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    if(password.length<=5){
        return res.send(400).json({message:'password length should be more than 5 characters'})
    }
    const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
    const newuser = new User({username,password:hashedPassword});
    newuser.save();
    console.log(newuser);
}
function logout(req,res){

}

module.exports = {login,signUp,logout}