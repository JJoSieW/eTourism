const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comments = new Schema(
    {
        expId: {type: String, required: true},
        expTitle: {type: String, required: true},
        username: {type: String, required: true},
        eHost:{type:String,required:true},
        // scoreToExperience:{type:Number,min:0,max:5,required:true},
        scoreToCreator:{type:Number,min:0,max:5,required:true},
        comment:{type:String},
        whatever:{type:String}
    },{timestamps:true}
);

comments.set('toObject',{getters:true});

module.exports = mongoose.model('Comment',comments);