const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Follows = new Schema(
    {
            //user1 follow user2
        username1: {type: String, required: true},
        username2: {type: String, required: true},
        whatever: {type: String} //any other field
    }
);



Follows.set('toObject', {getters: true});
module.exports = mongoose.model('Follows', Follows);