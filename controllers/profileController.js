const {Profile} = require('../models/profile');
const _ = require('lodash');

module.exports.getProfile = async (req, res) => {
    const profile = await Profile.findOne({user: req.user._id});
    return res.status(200).send(profile);
}

module.exports.setProfile = async (req, res) => {
    const userProfile = _.pick(req.body, ["address1", "address2", "phone", "city", "state", "postcode", "country"]);
    userProfile.user = req.user._id;
    let profile = await Profile.findOne({user: req.user._id});

    if (profile) {
        await Profile.updateOne({user: req.user._id}, userProfile);
        return res.status(200).send({message: "Your profile updated successfully!"});
    } else {
        profile = new Profile(userProfile);
        await profile.save();
        return res.status(201).send({message: "Your profile info saved successfully!"});
    }
}