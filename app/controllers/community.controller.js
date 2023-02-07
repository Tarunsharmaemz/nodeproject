const Community = require('../models/community.model');
const User = require('../models/user.model');
const ObjectId = require('mongodb').ObjectId;

create = async (req,res) => {    
    await Community.create({
        'name' : req.body.name,
        'description' : req.body.description,
        'image' : req.body.image,
        'created_user_id' : req.user_id            
    });

    return res.json({ status : 200, message : 'Community created successfully'});
},
listCommunity = async (req,res) => {        
    const communities = await Community.find().populate('created_user_id',"name email");
    // const communities = await Community.aggregate([           
    //     { 
    //         $match : { created_user_id : ObjectId(req.user_id) }
    //     },        
    //     { 
    //         $lookup : {
    //         from : 'users',
    //         let : { userId : '$created_user_id'},
    //         pipeline:[
    //             {
    //                 $match :{ 
    //                     $expr : {
    //                         $eq : ['$_id', "$$userId"] 
    //                     }
    //                 },
    //             },
    //             {
    //                 $project : {
    //                     _id : 0,
    //                     name : 1,
    //                     email: 1
    //                 },
    //             }                 
    //         ],  
    //         as : 'userdata'
    //     }},        
    //     {
    //         $sort : { createdAt : -1 }   
    //     },
    //     { 
    //         $project : { name : 1, created_user_id : 1, createdAt : 1, username : "$userdata" }
    //     }
        
    // ]);
    if(communities){
        return res.json({status : 200, data: communities, message : 'Community List'})
    } 
},

editCommunity = async (req,res) => {
    const community = await Community.findOne({ _id : ObjectId(req.params.community_id) }).populate('created_user_id');
    if(community){
        return res.json({status:200, data: community});
    }else{
        return res.json({status:400, data: '', message:'Not data found'});
    }
},

updateCommunity = async (req,res) => {      
    console.log('body',req.body);  
    await Community.findByIdAndUpdate(req.params.community_id, {
        'name' : req.body.name,
        'description' : req.body.description
    },{ new:true });

    return res.json({status: 200,message:"Community updated successfully"});
},

deleteCommunity = async (req,res) => {
    await Community.deleteOne({_id : ObjectId(req.params.community_id)});
    return res.json({status : 200, message:"Community deleted successfully"});
}

module.exports = {create,listCommunity,editCommunity,updateCommunity,deleteCommunity}