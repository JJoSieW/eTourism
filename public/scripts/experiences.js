let experiences;
let experiencesToShow;
let experiencesDiv;
let tagsChecked=[];
let keywords="";
function init(){
    // let profileLinkDiv = document.getElementById("profile-link");
    // let profileLink = document.createElement("a");
    // user = localStorage.getItem("user");
    // if(user){
    //     profileLink.href = "/profile?username="+JSON.parse(user).name;
    // }else{
    //     profileLink.href = "/login";
    // }
    // profileLink.innerHTML = 'profile';
    // profileLinkDiv.appendChild(profileLink);
    tagsChecked=tags;
    experiencesDiv  = document.getElementById("experiences");
    let tagsDiv = document.getElementById("tags");
    for(let i=0;i<tags.length;i++){
        let tagCheckBox = document.createElement("input");
        tagCheckBox.type="checkbox";
        tagCheckBox.name="tags";
        tagCheckBox.value = tags[i];
        tagCheckBox.onchange=selectTags;
        tagsDiv.appendChild(tagCheckBox);
        let tagText = document.createElement("span");
        tagText.innerHTML=" "+tags[i]+"<br>";
        tagsDiv.appendChild(tagText);
    }
    let uncheck = document.createElement("button");
    uncheck.innerHTML = "uncheck all";
    uncheck.onclick= uncheckAll;
    // uncheck.class = "btn btn-main btn-small btn-round-full";
    uncheck.style = "border-radius: 10px;background: #fff"
    let span = document.createElement("span");
    span.innerHTML = "<br>";
    tagsDiv.appendChild(span);
    tagsDiv.appendChild(uncheck);
    axios.post('/experiences')
        .then((data=>{
            experiences = data.data;
            experiencesToShow = experiences;
            showExperiences();
        }))
        .catch()
    ;
}

function experienceToDiv(experience){
    let result =
    "<div  class=\"col-md-4\">\n" +
    "<div  class=\"product-item\">\n" +
    "<div class=\"product-thumb\">\n" +
    "<img class=\"img-responsive\" height='360px' src='"+experience.image+"' alt=\"product-img\" />\n" +
    "<div class=\"preview-meta\">\n" +
    "<ul>\n" +
    "<li>\n" +
    "<a  href='/preview?experienceId="+experience._id+"'>\n" +
    "<i class=\"tf-ion-ios-search-strong\"></i>\n" +
    "</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"product-content\">\n" +
    "<h4><a href='/preview?experienceId="+experience._id+"'>"+experience.title+"</a></h4>\n" +
        "<p class=\"price\">";
    for(let i=0;i<experience.tags.length;i++){
        result+= "<span style='border: 1px black solid;background:black; color:white; border-radius:10px; opacity:0.6'> &nbsp"+experience.tags[i]+" &nbsp</span>&nbsp "
    }
    result=result +"</p>\n" +
    "<p class=\"price\">￡ "+experience.price+"</p>\n" +
        "<p class=\"price\">"+formatTime(experience.startTime)+"</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
    return result;
}
function showExperiences(){
    experiencesDiv.innerHTML="";
    for(let i=0;i<experiencesToShow.length;i++){
        let experienceDiv = document.createElement("div");
        experienceDiv.innerHTML = experienceToDiv(experiencesToShow[i]);
        experiencesDiv.appendChild(experienceDiv);

        // store experience info in localstorage
        experienceDiv.onclick=function (){
            let experienceId = experiences[i]._id;
            let creator = experiences[i].creator;
            let startTime = experiences[i].startTime;
            let duration = experiences[i].duration;
            let status = experiences[i].status;
            let expTitle = experiences[i].title;

            let endTime = new Date(Date.parse(startTime));
            endTime.setMinutes(endTime.getMinutes() + duration);

            let data = {
                experienceId: experienceId,
                creator: creator,
                startTime: startTime,
                endTime: endTime,
                status: status,
                expTitle: expTitle
            }
            localStorage.setItem("experience", JSON.stringify(data));
        };
    }
}

function uncheckAll(){
    let checkBoxes = document.getElementsByName("tags");
    for(let i=0;i<checkBoxes.length;i++){
        checkBoxes[i].checked=false;
    }
    tagsChecked=tags;
    refreshExperiencesToShow();
}
function selectTags(){
    let checkBoxes = document.getElementsByName("tags");
    tagsChecked = [];
    for(let i=0;i<checkBoxes.length;i++){
        if(checkBoxes[i].checked){
            tagsChecked.push(checkBoxes[i].value);
        }
    }
    if(tagsChecked.length===0){
        tagsChecked=tags;
        refreshExperiencesToShow();
        return;
    }
    refreshExperiencesToShow();
}
function search(key){
    keywords = key.toLowerCase();
    refreshExperiencesToShow()
}
function clearKeywords(){
    document.getElementById("keywords").value = "";
    keywords="";
    refreshExperiencesToShow();
}

function refreshExperiencesToShow(){
    experiencesToShow=[];
    for(let i=0;i<experiences.length;i++){
        let exp = experiences[i];
        if(exp.title.toLowerCase().indexOf(keywords)<=-1&&exp.creator.toLowerCase().indexOf(keywords)<=-1){
            continue;
        }
        for(let j=0;j<exp.tags.length;j++){
            if(contains(exp.tags[j],tagsChecked)){
                experiencesToShow.push(exp);
                break;
            }
        }
    }
    showExperiences();
}