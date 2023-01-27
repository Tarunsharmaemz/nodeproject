const User = require('../models/user.model.js');
const md5 = require("md5");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const multer = require('multer');

const userController = {
    create : async (req,res) => {        
        const user = await User.create({
            'name' : req.body.name,
            'email' : req.body.email,
            'profile_pic' : req.body.profile_pic,
            'password' : md5(req.body.password),
            'phone_number' : req.body.phone_number,
            'status' : req.body.status
        })
        
        return res.json({ status : 200,userdata : user, message : 'User created succefully'})
    },    
    findAll : async (req,res) => {    
        const users = await User.find();        
        return res.json({status : 200,data : users});    
    },    
    findOne : async (req,res) => {
        const user = User.findById(req.params.userId)
        return res.json({status : 200,data : user});
    },    
    update : async (req,res) => {
        User.findByIdAndUpdate(req.params.userId, {
           'name' : req.body.name 
        }, {new: true} )
        .then(user => {
            res.send(user);
        });
    },    
    deleteUser : async (req,res) => {
        User.findByIdAndRemove(req.params.userId)
        .then(data => {
            res.send({ status : 200, message : 'User deleted successfully' });
        })
    },    
    sendEmail : async (email, subject, text) => {
        try {
          const transporter = nodemailer.createTransport({
            host: "emails.emizentech.com",
            service: "smtp",
            port: 587,
            secure: false,
            auth: {
              user: "smtp@emails.emizentech.com",
              pass: "emztk@123#$",
            },
          });
      
          await transporter.sendMail({
            from: "smtp@emails.emizentech.com",
            to: email,
            subject: subject,
            text: text,
          });
          console.log("email sent sucessfully");
        } catch (error) {
          console.log("email not sent");
          console.log(error);
        }
    },    
    register : async (req,res) => {      
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                console.log(file);
              cb(null, './uploads')
            },
            filename: function (req, file, cb) {
              cb(null, file.originalname)
            }
        })
        const upload = multer({ storage: storage })

        const user = await User.create({
            'name' : req.body.name,
            'email' : req.body.email,
            'profile_pic' : req.body.profile_pic,
            'password' : md5(req.body.password),
            'phone_number' : req.body.phone_number
        });

        userController.sendEmail(req.body.email,"Test Subject","This is Test Mail");
        return res.json({status : 200, data : user, message : "Registered successfully"});        
    },    
    login : async (req,res) => {                                
        User.findOne({ email:req.body.email, password: md5(req.body.password)})
        .then(user => {                        
            if(!user){
                return res.json({ status: 400,message : "Credentials not matched"});
            }
            const token = jwt.sign({user_id : user._id }, process.env.JWT_SECRET_KEY);
            return res.send({ status : 200, message : "User login successfully", token : token})
        })        
    },
    forgotPassword : async (req,res) => {
        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.json({status : 400, message : "Email is not registered"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        await User.updateOne({_id : user._id},{$set: {otp : otp}});     
        userController.sendEmail(req.body.email,'Forgot Password',`Your otp is : ${otp}`);
        return res.json({status : 200, message : "Otp send successfully"})
    }

}

module.exports = { ...userController }
