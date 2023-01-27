const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    phone_number : String,
    profile_pic: String,
    address : String,
    otp : String,
    status : Number
}, {
    timestamps : true
});

module.exports = mongoose.model('User', UserSchema);