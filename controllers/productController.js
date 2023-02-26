const { Product, validate } = require('../models/product');
const { Category } = require('../models/category');
const _ = require('lodash');
const { IncomingForm } = require('formidable');
const fs = require('fs');

// create product
module.exports.createProduct = async (req, res) => {
    const form = new IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send({ message: "Something went wrong!" });

        const { error } = validate(_.pick(fields, ["name", "description", "price", "quantity", "category"]));
        if (error) {
            error.details.forEach(err =>  {
                err[err.context.key] = err.message;
                delete err['message'];
                delete err['path'];
                delete err['type'];
                delete err['context'];
            });
            const [name, description, price, quantity, category] = error.details;
            const Error = {...name, ...description, ...price, ...quantity, ...category}
            return res.status(400).send(Error);
        }

        const product = new Product(_.pick(fields, ["name", "description", "price", "quantity", "category"]));

        if (files.photo) {
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(400).send({ message: "Problem in file data!" });
                product.photo.data = data;
                product.photo.contentType = files.photo.mimetype;
                product.save((err, result) => {
                    if (err) return res.status(400).send({ message: "Product created failed!" });
                    return res.status(201).send({ 
                        message: 'Product created successfully!' ,
                        data: _.pick(result, ["name", "description", "price", "quantity", "category"])
                    });
                });
            });
        } else {
            return res.status(400).send({ noImage: "No image provided!" });
        }
    });

}

// get all the products
module.exports.getProducts = async (req, res) => {
    try {
        if (await Product.count() > 0) {
            const order = req.query.order === "desc" ? -1 : 1;
            const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
            const limit = req.query.limit ? parseInt(req.query.limit) : 0;
            const products = await Product.find()
                .select({ photo: 0 })
                .sort({[sortBy]: order})
                .limit(limit)
                .populate('category', 'name');
            return res.status(200).send(products);
        } else {
            return res.status(200).send({message: "No product available!"});
        }
    } catch (error) {
        return res.status(400).send({ message: "Failed to fetch products" });
    }
}

// get the single product
module.exports.productDetails = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId)
            .select({ photo: 0 })
            .populate('category', 'name');
        if (!product) return res.status(400).send({ message: "Failed to fetch product details!" });
        return res.status(200).send(product);
    } catch (error) {
        return res.status(400).send({ message: "Failed to fetch product details!" });
    }
}

// get the single product photo
module.exports.getProductPhoto = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId)
            .select({ photo: 1, _id: 0 });
        res.set('Content-Type', product.photo.contentType);
        if (!product) return res.status(400).send({ message: "Failed to fetch product photo!" });
        return res.status(200).send(product.photo.data);
    } catch (error) {
        return res.status(400).send({ message: "Failed to fetch product photo!" });
    }
}

// single product update
module.exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) return res.status(400).send({ message: "Product updated failed!" });
        const form = new IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) return res.status({ message: "Something went wrong!" });

            const updatedFields = _.pick(fields, ["name", "description", "price", "quantity", "category"]);
            _.assignIn(product, updatedFields);

            if (files.photo) {
                fs.readFile(files.photo.filepath, (err, data) => {
                    if (err) return res.status(400).send({ message: 'Problem in file data!' });
                    product.photo.data = data;
                    product.photo.contentType = files.photo.mimetype;
                    product.save((err, data) => {
                        if (err) return res.status(400).send({ message: 'Product updatd failed!' });
                        return res.status(200).send({ message: "Product updated successfully!" });
                    });
                });
            } else {
                product.save((err, data) => {
                    if (err) return res.status(400).send({ message: 'Product updatd failed!' });
                    return res.status(200).send({ message: "Product updated successfully!" });
                });                   
            }
        });
    } catch (error) {
        return res.status(400).send({ message: "Product updated failed!" });
    }
}

// single product delete
module.exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) return res.status(400).send({ message: "Product deleted failed!" });
        return res.status(200).send({ message: "Product deleted successfully!" });
    } catch (error) {
        return res.status(400).send({ message: "Product deleted failed!" });
    }
}

// filer by any fields

module.exports.filterProducts = async (req, res) => {
    try {
        const order = req.body.order === "desc" ? -1 : 1;
        const sortBy = req.body.sortBy ? req.query.sortBy : "createdAt";
        const limit = req.body.limit ? parseInt(req.query.limit) : 0;
        const skip = parseInt(req.body.skip);
        const filters = req.body.filters;
        const args = {};

        for (const key in filters) {
            if (filters[key].length > 0) {
                if (key === "price") {
                    args.price = {
                        $gte: filters.price[0],
                        $lte: filters.price[1]
                    }
                }

                if (key === "category") {
                    args.category = {
                        $in: filters.category
                    }
                }
            }
        }

        const products = await Product.find(args)
            .select({photo: 0})
            .populate('category', 'name')
            .sort({[sortBy]: order})
            .limit(limit)
            .skip(skip);
        if (products.length > 0) {
            return res.status(200).send(products);
        } else {
            return res.status(200).send({message: "No product available!"});
        }
    } catch (error) {
        return res.status(400).send({message: "Failed to fetch product!"});
    }
}

module.exports.productFilterByCategory = async (req, res) => {
    try {
        const categoryName = req.body.categoryName;
        const category = await Category.findOne({name: categoryName});
        const products = await Product.find({category: category._id})
            .select({photo: 0})
            .populate('category', 'name')
            .sort({createdAt: -1});
        if (products.length > 0) {
            return res.status(200).send(products);
        } else {
            return res.status(200).send({message: "No product available!"});
        }
    } catch (error) {
        return res.status(400).send({message: "Failed to fetch products!"});
    }
}