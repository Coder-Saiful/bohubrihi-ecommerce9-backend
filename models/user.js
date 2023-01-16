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