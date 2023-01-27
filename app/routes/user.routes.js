const express = require('express')
const user = require('../controllers/user.controller.js');
const router = express.Router()
const {userValidationRules,validate,loginValidation,forgotpasswordValidation} = require('../services/validation.js');

router.post('/create',userValidationRules(),validate,user.create)
router.post('/users', user.findAll)
router.get('/users/:userId', user.findOne)
router.post('/users/:userId', user.update)
router.post('/delete-user/:userId',user.deleteUser)
router.post('/register',userValidationRules(),validate,user.register)
router.post('/login',loginValidation(),validate, user.login)
router.post('/forgot-password',forgotpasswordValidation(),validate,user.forgotPassword)

module.exports = router