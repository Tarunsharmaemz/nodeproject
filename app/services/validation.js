const {check,validationResult } = require('express-validator');
const User = require('../models/user.model');

const userValidationRules = () => {
    return [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').notEmpty().withMessage('Email is required'),
        check('email').isEmail().withMessage('Email is not valid'),
        check('email').custom(value => {
            return User.find({'email' :value}).then(user => {                  
                if(user.length != 0){
                    return Promise.reject('Email already in use');
                }
            });
        }),
        check('password').notEmpty().withMessage('Password is required'),
        check('password').isLength({ min : 6}).withMessage('Password must be atleast 6 characters'),
        // check('confirm_password').notEmpty().withMessage('Confirm password is required').matches('password').withMessage('Confirm password should match password'),        
        check('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
          
              // Indicates the success of this synchronous custom validator
              return true;
        }),
        check('phone_number').notEmpty().withMessage('Phone number is required'),
        check('phone_number').isNumeric().withMessage('Phone number must be number'),
        check('phone_number').isLength({ min :10}).withMessage('Phone number must be min 10 digit')
    ]                        
}

const loginValidation = () => {
    return [
        check('email').notEmpty().withMessage('Email is required.'),
        check('email').isEmail().withMessage('Email is not valid'),
        check('password').notEmpty().withMessage('Password is required')
    ]        
}

const forgotpasswordValidation = () => {
    return [
        check('email').notEmpty().withMessage('Email is required'),
        check('email').isEmail().withMessage('Enter valid email'),
    ]
}

const validate = (req,res,next) => {
    const errors = validationResult(req)    
    if(errors.isEmpty()){
        return next();
    }
    const validationErrors = []
    errors.array().map(err => validationErrors.push({
        [err.param] : err.msg
    }))

    return res.json({ status: 400,
        errors : validationErrors,
    })
}

module.exports = {
    userValidationRules,
    validate,
    loginValidation,
    forgotpasswordValidation
}