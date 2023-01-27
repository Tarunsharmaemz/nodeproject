require('dotenv').config();

const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const bodyParser = require('body-parser');
//Configuring the database
const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');
// Import routes
const routes = require('./app/routes/user.routes.js');
const adminroute = require('./app/routes/administrator.routes');
const cors = require('cors');
// create express app
const app = express();

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const nocache = (_, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateRTCToken = (req, resp) => {
    console.log('ddd' ,req.body);
    resp.header('Access-Control-Allow-Origin', '*');
    const channelName = req.body.channelName;
    console.log('channelName' ,channelName);
    if (!channelName) {
        return resp.json({ 'status': false,'message' : 'channel is required' });
    }

    let uid = req.body.uid;
    if(!uid || uid === '') {
        return resp.status(500).json({ 'error': 'uid is required' });
    }

    // get role
    let role;    
    role = "0";

    let expireTime = 3600;

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    let token;
    token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    
    return resp.json({ 'rtcToken': token });

 };

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(cors({ origin : "*"}))

mongoose.Promise = global.Promise;

//Connecting to database
mongoose.connect(dbConfig.url,{
    useNewUrlParser : true
}).then(() => {
    console.log('Successfully connected to the database');
}).catch(err => {
    console.log('Could not connect to the database.',err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to new Project.This is my first project."});
});
app.post('/access_token', nocache , generateRTCToken)

app.use("/api",routes)
app.use("/api/admin",adminroute)

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});