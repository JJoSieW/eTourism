var express = require('express');
var router = express.Router();

var user = require('../controllers/Users');
var experience = require('../controllers/Experiences');
var follow = require('../controllers/Follows');
var record = require('../controllers/purchased');
var comments = require('../controllers/Comments');

const url = require("url");
const querystring = require("querystring");
const User = require("../models/users");

/* GET home page. */
router.get('/', function (req,res,next){
  res.render('experiences',{title:'all experiences'});
});

//register
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
})
      .post('/register',user.add );

//login
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
})
    .post('/login',user.login );

//profile
router.get('/profile',user.profile);
router.post('/updateProfilePhoto',user.updateImage);


//browsing experiences
router.get('/experiences',function (req,res,next){
  res.render('experiences',{title:'all experiences'});
})
    .post('/experiences', experience.all);

//create experience
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create Experience' });
}).post('/create',experience.add);
router.get('/edit',experience.edit)
    .post('/update',experience.update);


//preview page actions
router.get('/preview',experience.getInfo); // show preview page
router.post('/checkBooked', record.checkPurchasedStatus); // check purchased statues
router.post('/book', record.addRecord); // book an experience
router.post('/check', experience.changeStatus); // staff: update experience status
router.post('/checkComment', comments.check); // check comment status
router.post('/comment', comments.add); // add a comment
router.post('/comments',function (req,res,next){
  let userData = req.body;
  if(!userData)
    res.status(403).json("empty request body");
  let Comments = JSON.parse(userData.comments);
  let curUser = JSON.parse(userData.user);
  let usernames = [];
  for(let i=0;i<Comments.length;i++){
    usernames.push(Comments[i].username);
    Comments[i].createdAt = new Date(Comments[i].createdAt);
    Comments[i].createdAt=Comments[i].createdAt.getHours()+":"+Comments[i].createdAt.getMinutes()+" "+
        Comments[i].createdAt.getDate()+"/"+(Comments[i].createdAt.getMonth()+1)+"/"+Comments[i].createdAt.getFullYear();
  }
  User.find({"name":{$in:usernames}}).then(users=> {
    let photos = [];
    for (let i = 0; i < Comments.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (Comments[i].username === users[j].name) {
          photos.push(users[j].image);
          break;
        }
      }
    }
    res.render("comments", {
      comments: Comments,
      user: curUser,
      photos:photos,
    title:curUser.name+"'s comments"
    });
  });
})
router.get('/liveStream',function (req,res,next){
  res.render("live_stream",{title:"live stream"});
})

//router.get('/getUncheck',experience.getUncheckedExperience);
router.get('/getUncheck',function (req,res,next){
  res.render('dashboard');
}).post('/getUncheck',experience.getUnheckedExperience);
router.get('/dashboard', function (req, res, next){
  res.render('dashboard', {
    title: 'anonymous', author: 'anonymous'});
}).post('/dashboard',experience.updateStatus );

router.get('/getAllUser',function (req,res,next){
  res.render('usrDashboard');
}).post('/getAllUser',user.getAllUser);

router.get('/usrDashboard', function (req, res, next){
  res.render('usrDashboard', {
    title: 'anonymous', author: 'anonymous'});
}).post('/usrDashboard',user.updateUserStatusType );

router.get('/createdExperience',experience.getExpsByCreator);
router.get('/purchasedExperience',record.findPurchasedExps);
router.post('/getFollows',follow.getFollows);
router.post('/follow',follow.add);
router.post('/unfollow',follow.delete);
router.post('/followsList',follow.getFollowsList)


module.exports = router;

