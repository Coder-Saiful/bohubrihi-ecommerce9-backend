const { Schema, model } = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
}, { timestamps: true });

userSchema.methods.genJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        name: this.name,
        email:  this.email,
        role: this.role
    }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

module.exports.User = model('User', userSchema);

module.exports.validateUser = user => {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255),
    });
    return schema.validate(user, {abortEarly: false});
}

module.exports.validatePassword = data => {
    const schema = Joi.object({
        currentPass: Joi.string().required().min(5).max(255).messages({
            'string.base': `Current password should be a type of 'text'.`,
            'string.empty': `Current password cannot be an empty field.`,
            'string.min': `Current password should have a minimum length of 5.`,
            'string.max': `Current password should have a maximum length of 255.`,
            'any.required': `Current password is a required field.`
        }),
        newPass: Joi.string().required().min(5).max(255).messages({
            'string.base': `New password should be a type of 'text'`,
            'string.empty': `New password cannot be an empty field.`,
            'string.min': `New password should have a minimum length of 5.`,
            'string.max': `New password should have a maximum length of 255.`,
            'any.required': `New password is a required field.`
        }),
        confirmPass: Joi.string().required().min(5).max(255).messages({
            'string.base': `Confirm password should be a type of 'text'.`,
            'string.empty': `Confirm password cannot be an empty field.`,
            'string.min': `Confirm password should have a minimum length of 5.`,
            'string.max': `Confirm password should have a maximum length of 255.`,
            'any.required': `Confirm password is a required field.`
        })
    });
    return schema.validate(data, {abortEarly: false});
}
