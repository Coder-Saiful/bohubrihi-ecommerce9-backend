const {Cart} = require('../models/cart');
const _ = require('lodash');

module.exports.createCartItem = async (req, res) => {
    const {product, price} = _.pick(req.body, ["product", "price"]);
    let cartItem = await Cart.findOne({user: req.user._id, product: product});

    if (cartItem) {
        return res.status(400).send({message: "This product already exists in Cart!"});
    } else {
        cartItem = new Cart({product: product, price: price, user: req.user._id});
        const result = await cartItem.save();
        return res.status(201).send({
            message: "Added to cart successfully!",
            data: result
        });
    }
}

module.exports.getCartItem = async (req, res) => {
    const cartItems = await Cart.find({user: req.user._id});
    return res.status(200).send(cartItems);
}

module.exports.updateCartItem = async (req, res) => {
    const {_id, count} = _.pick(req.body, ["_id", "count"]);
    await Cart.updateOne({user: req.user._id, _id: _id}, {count: count});
    return res.status(200).send({message: "Your cart item updated!"});
}

module.exports.deleteCartItem = async (req, res) => {
    const _id = req.params.id;
    await Cart.deleteOne({user: req.user._id, _id: _id});
    return res.status(200).send({message: "Your cart item removed sucessfully!"});
}