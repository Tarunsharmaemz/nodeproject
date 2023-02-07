const jwt = require('jsonwebtoken');

checkuser = (req,res,next) => { 
    try{
        const token = req.headers.authorization.split(' ')[1];        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);                
        req.user_id = decoded.user_id;    
        next();

    }catch(err){
        return res.json({ status: 400, message: 'Invalid token'});
    }                   
}

module.exports = checkuser