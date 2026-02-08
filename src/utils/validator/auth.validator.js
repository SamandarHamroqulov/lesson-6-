const Joi = require("joi");

const registerValidator = Joi.object({
    full_name: Joi.string().required().trim().min(3).messages({
        "string.base": "Full name must be a string",
        "string.empty": "Full name must not be empty",
        "any.required": "Full name is required"

    },

    ),
    email: Joi.string().email().required().trim().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email  must not be empty",
        "any.required": "Email is required"
    }),
     password: Joi.string().required().trim().messages({
        "string.base": "Passwor dmust be a string",
        "string.empty": "Password must not be empty",
        "any.required": "Password is required"
    }),
    age: Joi.number().required().min(16).messages({
        "number.base": "Age must be a number",
        "number.empty": "Age must not be empty",
        "any.required": "Age is required"
    })
   
})
const resendLinkOrForgotPass = Joi.object({
    email: Joi.string().required().trim().messages({
        "string.base": "Email must be a string",
        "string.empty":"String must not be empty",
        "any.required": "Email is required"
    })
})
const verifyEmailVal = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token is required",
    "any.required": "Token is required"
  })
});

const loginValidator = Joi.object({
    email: Joi.string().required().trim().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email must not be empty",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().trim().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password must not be empty",
        "any.required": "Password is required"
    })
})
const changePasswordValidator = Joi.object({
    email: Joi.string().required().trim().email().messages(
        {
            "string.base": 'Email must be a string',
            "string.empty": "Email must not be empty",
            "any.required": "Email is required"
        }
    ),
    new_password: Joi.string().required().trim().messages({
        "string.base": "new password must be a string",
        "string.empty": "String must not be empty",
        "any.required": "New passowrd is required"
    })
})
module.exports = {registerValidator, verifyEmailVal, loginValidator, resendLinkOrForgotPass, changePasswordValidator}