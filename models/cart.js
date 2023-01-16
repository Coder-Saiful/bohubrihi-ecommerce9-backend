const {Schema, model} = require('mongoose');

const cartSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required:true
    },
    price: Number,
    count: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

module.exports.cartSchema = cartSchema;
module.exports.Cart = model('Cart', cartSchema);