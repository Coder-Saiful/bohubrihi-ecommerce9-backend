const {Schema, model} = require('mongoose');

module.exports.Profile = model('Profile', Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    address1: String,
    address2: String,
    phone: Number,
    city: String,
    state: String,
    postcode: Number,
    country: String
}, {timestamps: true}));