const express = require('express');
const community = require('../controllers/community.controller');
const router = express.Router();
const { communityValidation,validate} = require('../services/validation'); 
const authmiddle = require('../middleware/auth');

router.post('/create', communityValidation(),validate,authmiddle,community.create);
router.get('/list-community',authmiddle,community.listCommunity);
router.get('/edit-community/:community_id',authmiddle,community.editCommunity);
router.post('/update-community/:community_id',communityValidation(), validate, authmiddle,community.updateCommunity);
router.get('/delete-community/:community_id',authmiddle,community.deleteCommunity);

module.exports = router 