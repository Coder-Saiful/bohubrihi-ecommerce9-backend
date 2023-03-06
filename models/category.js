const { Schema, model } = require('mongoose');
const Joi = require('joi');

module.exports.Category = model('Category', Schema({
    name: {
        type: String,
        required:true,
        unique: true
    },
    slug: String
}, { timestamps: true }));

module.exports.validate = category => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50)
    });
    return schema.validate(category);
}
