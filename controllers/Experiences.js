let Experience = require('../models/experiences');
let Comment = require('../models/comments');
let User = require('../models/users');
const e = require("express");
const http = require('http');
const url = require("url");
const querystring = require("querystring");
const {response} = require("express");

//add an experience
exports.add = function (req, res) {
    //check if request.body.data isnull
    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!')

    //new an experience
    let experience = new Experience({
        title: userData.title,
        sampleVideo: userData.video,
        images: userData.images,
        location:userData.location,
        tags:userData.tags,
        price: userData.price,
        startTime:new Date(userData.startTime),
        duration:userData.duration,
        description:userData.description,
        creator:userData.creator,
        status:"unchecked",
        }
    );
    experience.save()
        .then((results)=>{
            console.log("object created in experiences " + JSON.stringify(results));
            res.json("experience"+JSON.stringify(results.title)+" created successfully!");
        })
        .catch((error)=>res.json(JSON.stringify(error)));
}

exports.update = function (req,res){
    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!')

    Experience.updateOne({"_id":userData._id},{$set:{
            title: userData.title,
            sampleVideo: userData.video,
            images: userData.images,
            location:userData.location,
            tags:userData.tags,
            price: userData.price,
            startTime:new Date(userData.startTime),
            duration:userData.duration,
            description:userData.description,
            status:"unchecked",
        }}).then(response=>{
            res.json(userData.title);
    })
        .catch(err=>{
            res.json(err);
        });

}

//extract all experiences
exports.all = function (req,res){
    //return experiences whose status is approved and startTime is later than now.
    Experience.find({$and:[{"status":"approved"},{startTime:{$gt:new Date()}}]})
        .sort({startTime:1})//order by start time, ascending
        .then(exps=>{
            let experiences=[];
            for(let i=0;i<exps.length;i++){
                let exp = {};
                exp._id = exps[i]._id;
                exp.creator = exps[i].creator;
                exp.price = exps[i].price;
                exp.startTime = exps[i].startTime;
                exp.title = exps[i].title;
                exp.image = exps[i].images[0];
                exp.tags = exps[i].tags;
                experiences.push(exp);
            }
            res.json(experiences);
        })
}

//get experience by its title
exports.getInfo = function (req, res) {
    let expData = req.body;
    if (expData == null)
        res.status(403).json('No data sent!');

    //get the id of the experience to preview
    var arg = url.parse(req.url).query;
    var params = querystring.parse(arg);
    let experienceId = params.experienceId;
    console.log("the id of the experience to preview is : "+experienceId);

    Experience
        .find()
        .where('_id').equals(experienceId)
        .then(experiences=>{
            let experience = null;
            if (experiences.length > 0) {
                let firstElem = experiences[0];
                Comment.find({"eHost":firstElem.creator})
                    .then(comments=>{
                        let usernames = [];
                        for(let i=0;i<comments.length;i++){
                            comments[i] = comments[i].toJSON();
                            usernames.push(comments[i].username);
                            comments[i].createdAt=comments[i].createdAt.getHours()+":"+comments[i].createdAt.getMinutes()+" "+
                                comments[i].createdAt.getDate()+"/"+(comments[i].createdAt.getMonth()+1)+"/"+comments[i].createdAt.getFullYear();
                        }
                        User.find({"name":{$in:usernames}}).then(users=>{
                            let photos = [];
                            for(let i=0;i<comments.length;i++){
                                for(let j=0;j<users.length;j++){
                                    if(comments[i].username===users[j].name){
                                        photos.push(users[j].image);
                                        break;
                                    }
                                }
                            }
                            experience = {
                                title: firstElem.title,
                                sampleVideo: firstElem.sampleVideo,
                                images: firstElem.images,
                                creator: firstElem.creator,
                                startTime: firstElem.startTime.getHours()+":"+firstElem.startTime.getMinutes()+" "+
                                    firstElem.startTime.getDate()+"/"+(firstElem.startTime.getMonth()+1)+"/"+firstElem.startTime.getFullYear(),
                                duration: firstElem.duration,
                                tags: firstElem.tags,
                                description: firstElem.description,
                                price: firstElem.price,
                                comments:comments,
                                photos:photos,
                                experience: experiences[0],
                                endTime:firstElem.endTime
                            };
                            res.render('preview', experience);
                        })
                    })
            } else {
                res.json("Experience Not Found");

            }
        });
}

//get experiences by creator
exports.getExpsByCreator = function(req,res){

    //get the id of the experience to preview
    var arg = url.parse(req.url).query;
    var params = querystring.parse(arg);
    let creator = params.username;
    console.log("the creator of the experience to preview is : "+creator);
    Experience.find()
        .where('creator').equals(creator)
        .then(experiences=>{
            for(let i=0;i<experiences.length;i++){
                let currentTime = new Date();
                if(experiences[i].status!=="approved"){
                    experiences[i].processStatus = experiences[i].status;
                    continue;
                }
                if (experiences[i].startTime>currentTime){
                    experiences[i].processStatus="upcoming";
                }
                else if(experiences[i].startTime<currentTime&&currentTime<experiences[i].endTime){
                    experiences[i].processStatus="ongoing";
                }
                else if(experiences[i].endTime<currentTime){
                    experiences[i].processStatus="over";
                }
            }
            res.render("record",{Title:"Experiences Created by "+creator,
                user:creator,
                experiences:experiences});
        })
}

exports.edit = function (req, res) {
    //get the id of the experience to preview
    var arg = url.parse(req.url).query;
    var params = querystring.parse(arg);
    let experienceId = params.experienceId;
    console.log("the id of the experience to preview is : "+experienceId);
    Experience
        .find({"_id":experienceId})
        .then(experiences=>{
            if (experiences.length > 0) {
                res.render('edit',{title:"Edit",experience:experiences[0]});
            } else {
                res.status(404).json("Experience Not Found");
            }
        }).catch(err=>{res.render('error',{error:err})});
}

//get unchecked experiences
exports.getUnheckedExperience = function (req,res) {

    //return experiences whose status is approved and startTime is later than now.
    Experience.find({"status": "unchecked"})
        .sort({createdAt: 1})//order by start time, ascending
        .then(exps => {
            res.json(exps);
        })

}
exports.updateStatus = function (req,res){
    //update experience's status from dashboard
    let experienceData = req.body;
    if (experienceData == null)
        res.status(403).json('No data sent!');
    let id = experienceData._id;
    let status = experienceData.status;
    Experience.updateOne({"_id":id},{$set:{"status":status}})
        .then(data=>{
            res.json(status);
        }).catch(err=>{
        res.json(err);
    })
}
exports.changeStatus = function (req,res){
    //update experience's status from preview
    let experienceData = req.body;
    if (experienceData == null)
        res.status(403).json('No data sent!');
    let expId = experienceData.experienceId;
    let status = experienceData.status;
    Experience.updateOne({"_id":expId},{$set:{"status":status}})
        .then(result=>{
            res.send(result);
        }).catch(err=>{
            res.json(err);
    })
}
