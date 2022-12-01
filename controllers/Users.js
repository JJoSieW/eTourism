let User = require('../models/users');
let record = require('../models/purchased_record');
let Comment = require('../models/comments');
const url = require("url");
const querystring = require("querystring");
const Experience = require("../models/experiences");

exports.add = function (req, res) {

    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!')
    let user = User.find({"name":userData.name}).then(result=>{
        if(result.length>0){
            res.status(403).json("duplicate username! this username is registered!");
        }else{
            user = new User({
                name: userData.name,
                passwords:userData.passwords,
                email: userData.email,
                gender:userData.gender,
                image:"",
                status: "normal",
                userType:"user",});
            user.save()
                .then((results)=>{
                    console.log("object created in users " + JSON.stringify(results));
                    res.json({msg:"registered successfully",user:results});
                })
                .catch((error)=>{
                    res.json(JSON.stringify(error));
                });
        }
    })

}
exports.login = function (req,res){
    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!');
    let user = User.find({"name":userData.name})
        .then(users=>{
            if(users.length>0){
                if(users[0].passwords===userData.passwords){
                    //login successfully
                    res.json({msg:"login successfully",user:users[0]});
                }
                else{
                    res.json("incorrect username or passwords");
                }
            }else{
                res.json("username not found");
            }
        })
        .catch(err=>{
            res.status(500).send('Invalid data or not found!' + JSON.stringify(err));
        });
}
exports.profile = function (req,res){
    var arg = url.parse(req.url).query;
    var params = querystring.parse(arg);
    let username = params.username;
    User.find({"name":username})
        .then(users=>{
            Experience.find().
            where('creator').equals(username)
                .then(createdExperiences=>{
                    record.find()
                        .where('username').equals(username)
                        .then(purchasedExperienceId=>{
                            let experiencesId =[];
                            for(let i=0;i<purchasedExperienceId.length;i++){
                                experiencesId[i]=purchasedExperienceId[i].experiencesId;
                            }
                            Experience.find({_id:{$in:experiencesId}})
                                .then(purchasedExperiences=>{
                                    Comment.find({eHost: username})
                                        .then((comments)=>{
                                            res.render("profile",{title:"Profile",user:users[0],
                                                createdExperiences:createdExperiences,
                                                purchasedExperiences:purchasedExperiences,
                                                comments:comments
                                            });
                                        })
                                })
                        })
                });
        })
        .catch(err=>{
            res.status(500).send('Invalid data or not found!' + JSON.stringify(err));
        });
}
exports.updateImage = function (req,res){
    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!');
    let username = userData.username;
    let image = userData.image;
    User.updateOne({"name":username},{$set:{"image":image}})
        .then(data=>{
            res.json(image);
        }).catch(err=>{
            res.json(err);
    })
}
exports.getAllUser = function (req,res) {
    //return experiences whose status is approved and startTime is later than now.
    User.find({"userType":{$in:["staff","user"]}})

        .then(exps => {
            res.json(exps);
        })
}
exports.updateUserStatusType = function (req,res){
    //update user's status from dashboard
    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!');
    let name = userData.name;
    let status = userData.status;
    let userType = userData.userType;

    User.updateOne({"name":name},{$set:{"status":status, "userType":userType}})
        .then(data=>{
            res.json(status);
        }).catch(err=>{
        res.json(err);
    })

    }

