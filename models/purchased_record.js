const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//
// const User = new Schema(
//     {
//         name: {type: String, required: true, max: 100},
//         passwords: {type: String, required: true, max: 100},
//         email: {type: String, required: true},
//         status: {type:String, required:true,max:10},
//         userType:{type:String, required:true},
//         whatever: {type: String} //any other field
//     }
// );
// const Experience = new Schema(
//     {
//         title: {type: String, required: true, max: 100},
//         sampleVideo: {type: String, required: true},
//         images: {type: Array, required: true},//array type, to allow users to upload multiple images
//         location:{type:String,required:true},//temporarily use string, need to be edited after implementing google map
//         tags:{type:Array},//array type, an experience may have multiple tags
//         price: {type:Number, required:true},
//         startTime:{type:Date, required:true},
//         duration:{type:Number,required:true},//duration time(minutes)
//         description:{type:String,required:true},
//         creator:{type:String,required:true},
//         status:{type:String,required:true},//'draft' 'unchecked' 'rejected' 'approved'
//         whatever: {type: String} //any other field
//     },{timestamps:true}
// );

const Purchased_record = new Schema(
    {
        username:{type:String,required:true},
        experiencesId:{type:String,required:true},
        whatever:{type:String}
    }
);

Purchased_record.set('toObject',{getters:true});

module.exports = mongoose.model('Record',Purchased_record);