const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY

const authenticate = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
       return res.redirect('/api/auth/login');
    }
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = {id:decoded.id,username:decoded.username};
        next();
    }
    catch(err){
        console.log(err);
        return res.redirect('/api/auth/login');
    }
    
};
module.exports = authenticate;