const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        requires:true,
        minlength:5,
    }
});
const User =  mongoose.model('User',userSchema);
module.exports = User;
