const { Category, validate } = require('../models/category');
const _ = require('lodash');

module.exports.createCategory = async (req, res) => {
    const { error } = validate(_.pick(req.body, ["name"]));
    if (error) return res.status(400).send({ message: error.details[0].message + "!" });

    let category = await Category.findOne({ name: req.body.name });
    if (category) return res.status(400).send({ message: "Category already exists!" });

    category = new Category(_.pick(req.body, ["name"]));

    const result = await category.save();

    return res.status(201).send({
        message: "Category created successfully!",
        data: _.pick(result, ["_id", "name"])
    });
}

module.exports.getCategories = async (req, res) => {
    const categories = await Category.find()
        .sort({name: 1});
    return res.status(200).send(categories);
}

module.exports.udpateCategory = async (req, res) => {
    const categoryId = req.params.id;
    await Category.findByIdAndUpdate(categoryId, _.pick(req.body, ["name"]));
    return res.status(200).send({ message: "Category updated successfully!" });
}

module.exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    await Category.findByIdAndDelete(categoryId);
    return res.status(200).send({ message: "Category deleted successfully!" });
}
