const User = require('../models/user.model');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const adminLogin = async (req,res) => {    
    const user = await User.findOne({ email : req.body.email, password : md5(req.body.password)})
    if(!user){
        return res.json({status : 400, message : "Credentials not matched"})
    }
    const token = jwt.sign({user_id : user._id }, process.env.JWT_SECRET_KEY,{ expiresIn :'4d' })
    return res.json({ status : 200, message: "Login successfully", token:token})
}

module.exports = {
    adminLogin
}
