const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        name: {type: String, required: true, max: 100},
        passwords: {type: String, required: true, max: 100},
        email: {type: String, required: true},
        status: {type:String, required:true,max:10},
        userType:{type:String, required:true},
        image:{type:String},
        gender:{type:String},
        whatever: {type: String} //any other field
    }
);


User.set('toObject', {getters: true});

module.exports = mongoose.model('User', User);
