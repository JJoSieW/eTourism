let followers=[];
let followings=[];
let follows=[];
let followButton;
let username;
let photo;
function init(){
    user = JSON.parse(localStorage.getItem("user"));
    followButton = document.getElementById("follow");
    photo = document.getElementById("profilePhoto");
    let photoSrc = document.getElementById("photoSrc").value;
    if(photoSrc===""){
        photo.src="images/default_profile_photo.png"
    }else{
        photo.src=document.getElementById("photoSrc").value;
    }
    //user is retrieved from localStorage
    //username is the name of the user whose profile is shown
    username = document.getElementById("username").innerText;
    document.getElementById("createdExp").onclick=function (){location.href='/createdExperience?username='+username};
    document.getElementById("purchasedExp").onclick=function (){location.href='/purchasedExperience?username='+username};
    if(user&&user.name===username){
        photo.onclick=chooseFile;
        if(user.userType==="admin"){
            let adminDiv = document.getElementById("adminDiv");
            adminDiv.style.display="block";
        }else if(user.userType==="staff"){
            let staffDiv = document.getElementById("staffDiv");
            staffDiv.style.display="block";
        }
    }
    loadFollows();
}

function loadFollows(){
    axios.post('/getFollows',{username:username}).then(res=>{
        follows = res.data;
        let followed = false;
        for(let i=0;i<follows.length;i++){
            if(follows[i].username1===username){
                followings.push(follows[i].username2);
            }else{
                if(user&&follows[i].username1===user.name){
                    followed=true;
                }
                followers.push(follows[i].username1);
            }
        }

        document.getElementById("followersList").value = followers;
        let submitFollowers = document.getElementById("submitFollowers")
        submitFollowers.value=followers.length + " followers";

        document.getElementById("followingsList").value = followings;
        let submitFollowings = document.getElementById("submitFollowings");
        submitFollowings.value=followings.length+ " followings";

        if(!user||username!==user.name){
            followButton.style.display="block";
            if(!followed){
                followButton.innerHTML="follow";
                if(user)
                followButton.onclick=follow;
                else{
                    followButton.onclick=function (){
                        checkLoginStatus();
                    }
                }
            }else{
                followButton.innerHTML="unfollow";
                followButton.onclick=unfollow;
            }
        }

    }).catch(err=>{
        console.log(err);
    });

}
function follow(){
    axios.post('/follow',{username1:user.name,username2:username})
        .then(res=>{
            if(res.data==="followed"){
                followButton.innerHTML="unfollow";
                followButton.onclick=unfollow;
            }
        }).catch(err=>{
            console.log(err);
    });
}
function unfollow(){
    axios.post('/unfollow',{username1:user.name,username2:username})
        .then(res=>{
            if(res.data==="unfollowed"){
                followButton.innerHTML="follow";
                followButton.onclick=follow;
            }
        }).catch(err=>{
            console.log(err);
    });
}
function chooseFile(){
    document.getElementById("photo").click();
}
function uploadProfilePhoto(){
    if(confirm("upload this photo?")){
        readFile(document.getElementById("photo").files[0])
            .then(res=>{
                axios.post("/updateProfilePhoto",{username:user.name,image:res})
                    .then(res=>{
                        photo.src = res.data;
                    })
                    .catch(err=>{
                        console.log(err);
                    });
            }).catch(err=>{
                console.log(err);
        })
    }
}
function readFile(file){
    return new Promise(((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=()=>{
            resolve(reader.result);
        };
        reader.onerror = ()=>{reject(reader.error)};
    }))
}