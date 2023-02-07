const mongoose = require('mongoose');

const CommunitySchema = mongoose.Schema({
    name : String,
    image : String,
    description : String,
    created_user_id : { type : mongoose.Schema.Types.ObjectId, ref: 'User'},
    status : { type : String, enum : ['0','1'], default:'1' }
},{
    timestamps : true
});

module.exports = mongoose.model('Community',CommunitySchema);
