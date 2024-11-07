const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:5,
    },
    name:{
        type:String,
    },
    semester:{
        type:Number,
    },
    points:{
        type:Number,
        default:0
    },
    regNo:{
        type:Number,
    },
    course:{
        type:[String]
    }

});
const User =  mongoose.model('User',userSchema);
module.exports = User;
