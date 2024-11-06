const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.route')


//
const app = express();
const port = 5000;
async function connectDB(){
    await mongoose.connect('mongodb://127.0.0.1:27017/test')
}
//routes
app.use('/api/auth',authRoutes);




app.listen(port,()=>{
    console.log(`listening on port ${port}`);
    //connecting to database
    connectDB().then(()=>{
        console.log('connected to database...');
    }).catch((err)=>{
        console.log(err);
    });
    
})