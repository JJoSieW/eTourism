let Follows = require('../models/follows');
let Users = require('../models/users');
const e = require("express");
const http = require('http');
const url = require("url");
const querystring = require("querystring");

exports.getFollows = function (req, res) {
    //check if request.body.data isnull
    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!')
    let username = userData.username;
    Follows.find({
        $or: [
            {username1: username},
            {username2: username}
        ]
    })
        .then(follows=>{
            res.json(follows);
        }).catch(err=>{
            res.json(JSON.stringify(err));
    })

}
exports.add = function (req,res){
    let userData = req.body;
    if(userData==null)
        res.status(403).json("No data sent!");
    else{
        let username1 = userData.username1;
        let username2 = userData.username2;
        let follow = new Follows({
            username1:userData.username1,
            username2:userData.username2,
        });

        follow.save()
            .then(resData=>{
                res.json("followed");
            })
            .catch(err=>{
                res.json(JSON.stringify(err));
            })

    }
}
exports.delete = function (req,res){
    let userData = req.body;
    if(userData==null)
        res.status(403).json("No data sent!");
    else{
        let username1 = userData.username1;
        let username2 = userData.username2;
        Follows.deleteOne({"username1":username1,"username2":username2})
            .then(data=>{
                res.json("unfollowed");
            }).catch(err=>{
                res.json(JSON.stringify(err));
        });
    }
}

exports.getFollowsList = function (req,res,next) {
    let userData = req.body;
    if (!userData) {
        res.status(403).render('error', {error: "no data sent"});
    } else {
        let names = userData.list.split(",");
        Users.find({name:{$in:names}}).then((users)=>{
            res.render("follows_list",{title:userData.title,list:users})
        })

    }
}