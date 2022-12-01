let Purchased_record = require('../models/purchased_record');
let Experience = require('../models/experiences');

const url = require("url");
const querystring = require("querystring");

//add a record
exports.addRecord = function (req,res){
    let userData=req.body;
    if (userData ==null)
        res.status(403).json('no user data');

    let record = new Purchased_record({
        username:userData.username,
        experiencesId:userData.experiencesId,
    });
    record.save()
        .then((result)=>{
            console.log("record created in purchased record"+JSON.stringify(result));
            res.json("record created successfully")
        })
        .catch((error)=>res.json(JSON.stringify(error)));
};

exports.checkPurchasedStatus = function (req,res){
    let data = req.body;
    if (data == null)
        res.status(403).json('no user data');

    Purchased_record
        .find()
        .where('username').equals(data.username)
        .where('experiencesId').equals(data.experiencesId)
        .then(records => {
            if (records.length != 0) {
                console.log(records[0]);
                res.send({bookStatus: "BOOKED"});
            } else {
                res.send({bookStatus: "NOBOOK"});
            }
        })
        .catch(err=>{
            res.status(500).send('Invalid search for purchased status!' + JSON.stringify(err));
        });

};

exports.findPurchasedExps = function (req,res){
    //get the id of the experience to preview
    var arg = url.parse(req.url).query;
    var params = querystring.parse(arg);
    let username = params.username;
    Purchased_record.
        find().
        where('username').equals(username).
        then(experienceId=> {
            console.log(experienceId);
            let experiencesId =[];
            for(let i=0;i<experienceId.length;i++){
                experiencesId[i]=experienceId[i].experiencesId;
                console.log(experiencesId[i]);
            }
        Experience.find({_id:{$in:experiencesId}}).
            then(experiences => {
                    for(let i=0;i<experiences.length;i++){
                        let currentTime = new Date();
                        console.log(experiences[i].startTime);
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
                    res.render('record',{Title:"Experience Purchased by "+username,
                        user:username,experiences:experiences});

            });
    });
};
