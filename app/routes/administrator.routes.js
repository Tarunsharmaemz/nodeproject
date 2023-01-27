const express = require('express')
const user = require('../controllers/user.controller.js');
const admin = require('../controllers/admin.controller.js');
const router = express.Router()
const {userValidationRules,loginValidation,validate} = require('../services/validation.js');

router.post('/admin-login',loginValidation(),validate,admin.adminLogin)
router.post('/create',userValidationRules(),validate,user.create)
router.get('/users', user.findAll)
router.get('/users/:userId', user.findOne)
router.post('/users/:userId', user.update)
router.delete('/delete-user/:userId',user.deleteUser)

module.exports = router