const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports.signUp = async (req, res) => {
    try {
        const  { error } = validateUser(req.body);
        if (error) {
            error.details.forEach(err => {
                err[err.context.key] = err.message;
                delete err["context"];
                delete err["message"];
                delete err["type"];
                delete err["path"];
            });
            const [name, email, password] = error.details;
            const Error = {...name, ...email, ...password};
            return res.status(400).send(Error);
        }
    
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send({ message: "You are already registered!" });
    
        user = new User(_.pick(req.body, ["name", "email", "password"]));
    
        user.password = await bcrypt.hash(req.body.password, 10);

        const token = user.genJWT();
    
        const result = await user.save();
    
        return res.status(201).send({
            message: "Registration Successfully! Please login.",
            token: token,
            data: _.pick(result, ["_id", "name", "email"])
        });  
    } catch (error) {
        return res.status(400).send({ message: "Registration failed! Please try again!" });
    }
}

module.exports.signIn = async (req, res) =>  {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send({ message: "Incorrect email or password" });

        const validUser = await bcrypt.compare(req.body.password, user.password);
        if (!validUser) return res.status(400).send({ message: "Incorrect email or password" });

        const token = user.genJWT();

        return res.status(200).send({
            message: "Login Successfully!",
            token: token,
            data: _.pick(user, ["_id", "name", "email"])
        });
    } catch (error) {
        return res.status(400).send({ loginErr: "Login failed! Please try again!" });
    }
}