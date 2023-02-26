const { Category, validate } = require('../models/category');
const _ = require('lodash');

module.exports.createCategory = async (req, res) => {
    try {
        const { error } = validate(_.pick(req.body, ["name"]));
        if (error) return res.status(400).send({ categoryName: error.details[0].message + "!" });

        let category = await Category.findOne({ name: req.body.name });
        if (category) return res.status(400).send({ categoryName: "Category already exists!" });

        category = new Category(_.pick(req.body, ["name"]));

        const result = await category.save();

        return res.status(201).send({
            message: "Category created successfully!",
            data: _.pick(result, ["_id", "name"])
        });
    } catch (error) {
        return res.status(400).send({message: "Category created failed!"});
    }
}

module.exports.getCategories = async (req, res) => {
    try {
        if (await Category.count() > 0) {
            const order = req.query.order === "desc" ? -1 : 1;
            const sortBy = req.query.sortBy ? req.query.sortBy : "name";
            const limit = req.query.limit ? parseInt(req.query.limit) : 0;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const skip = (page - 1) * limit;
            const totalData = await Category.count();
            let totalPage = Math.ceil(totalData / limit);
            if (limit === 0) {
                totalPage = 1;
            }
            const categories = await Category.find()
                .sort({[sortBy]: order})
                .limit(limit)
                .skip(skip);
            return res.status(200).send({
                totalData: totalData,
                totalPage: totalPage,
                skip: skip,
                categories: categories
            });
        } else {
            return res.status(200).send({message: "No category available!"});
        }
    } catch (error) {
        return res.status(400).send({message: "Failed to load categories!"});
    }
}

module.exports.getSingleCategory = async (req, res) =>{
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        if (!category) return res.status(400).send({message: 'Failed to fetch category!'});
        return res.status(200).send(category);
    } catch (error) {
        return res.status(400).send({message: 'Failed to fetch category!'});
    }
}

module.exports.udpateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndUpdate(categoryId, _.pick(req.body, ["name"]));
        return res.status(200).send({ message: "Category updated successfully!" });
    } catch (error) {
        return res.status(400).send({ message: "Category updated failed!" });
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId);
        return res.status(200).send({ message: "Category deleted successfully!" });
    } catch (error) {
        return res.status(200).send({ message: "Category deleted failed!" });
    }
}
