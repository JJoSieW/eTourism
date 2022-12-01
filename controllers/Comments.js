let Comments = require('../models/comments');
let Records = require('../models/purchased_record')
let Experiences = require('../models/experiences')
const url = require("url");
const querystring = require("querystring");

// add comment record
exports.add = function (req, res) {
    // let commentData = req.body;
    // if (!commentData) {
    //     res.status(403).json("empty request body data");
    // }
    // let comment = new Comments({
    //     expId: commentData.experienceId,
    //     expTitle: commentData.expTitle,
    //     username: commentData.username,
    //     scoreToExperience: commentData.scoreToExperience,
    //     scoreToCreator: commentData.scoreToCreator,
    //     comment: commentData.comment
    // })
    // comment.save().then(comment=>{
    //     res.send({msg: "Comment successfully"});
    // }).catch(err=>{
    //     res.render("error",{error:err});
    // })
    let commentData = req.body;
    if (!commentData) {
        res.status(403).json("empty request body data");
    }
    let comment = new Comments({
        expId: commentData.experienceId,
        expTitle: commentData.expTitle,
        username: commentData.username,
        eHost: commentData.eHost,
        // scoreToExperience: commentData.scoreToExperience,
        scoreToCreator: commentData.scoreToCreator,
        comment: commentData.comment
    })
    comment.save().then(comment=>{
        res.send({msg: "Comment successfully"});
    }).catch(err=>{
        res.render("error",{error:err});
    })
}

// check whether comment has existed
exports.check = function (req,res) {
    let checkData = req.body;
    if (!checkData) {
        res.status(403).json("empty request body data");
    }
    Comments
        .find()
        .where("expId").equals(checkData.experienceId)
        .where("username").equals(checkData.username)
        .then(results=>{
            if (results.length != 0) {
                res.send({status: "EXISTED"});
            } else {
                res.send({status: "NOEXIST"});
            }
        })
}

// find comments
exports.find = function (req,res){
    let userData = req.body;
    if(!userData)
        res.status(403).json("empty request body");
    if(userData.experienceId&&userData.experienceId!==""){
        Comments.findOne({recordId:userData.recordId})
            .then(comment=>{
                res.json(comment);
            })
    }else if(userData.username&&userData.username!==""){
        Records.find({username:userData.username})
            .then(comments=>{
                res.json(comments);
            })
    }else if(userData.creator&&userData.creator!==""){
        Experiences.find({creator:userData.creator})
            .then(experiences=>{
                let experienceIds = [];
                for(let i=0;i<experiences.length;i++){
                    experienceIds.push(experiences[i]._id);
                }
                Records.find({experiencesId:{$in:experienceIds}})
                    .then(records=>{
                        let recordIds = [];
                        for(let i=0;i<records.length;i++){
                            recordIds.push(records[i]._id);
                        }
                        Comments.find({recordId:{$in:recordIds}})
                            .then(comments=>{
                                res.json(comments);
                            })
                    })
            })
    }
}