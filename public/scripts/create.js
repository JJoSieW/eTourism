let sampleVideoBase64;
let imagesBase64=[];
function init(){
    let tagsDiv = document.getElementById("tags");
    for(let i=0;i<tags.length;i++){
        let tagCheckBox = document.createElement("input");
        tagCheckBox.type="checkbox";
        tagCheckBox.name="tags";
        tagCheckBox.value = tags[i];
        tagsDiv.appendChild(tagCheckBox);
        tagsDiv.innerHTML = tagsDiv.innerHTML+tags[i]+"<br>";
    }
    let min = new Date();
    min.setMinutes(min.getMinutes()+3);
    document.getElementById("startTime").min = formatDate(min);
}
function onSubmit() {
    document.getElementById("creator").value = user.name;
    var formArray= $("form").serializeArray();
    var data={};
    for (let index in formArray){
        if(!formArray[index].value){
            index = parseInt(index);
            alert("experience's "+formArray[index].name+" is required");
            event.preventDefault();
            return;
        }
        if(formArray[index].name==="tags"){
            if(!data[formArray[index].name])
            data[formArray[index].name]=[formArray[index].value];
            else{
                data[formArray[index].name].push(formArray[index].value);
            }
        }else
        data[formArray[index].name]= formArray[index].value;
    }
    if(!data["tags"]){
        alert("experience's tags are required");
        event.preventDefault();
        return;
    }

    if(!sampleVideoBase64){
        alert("experience's sample video is required");
        event.preventDefault();
        return;
    }else if(imagesBase64.length===0){
        alert("experience's photos are required");
        event.preventDefault();
        return;
    }
    data['video']=sampleVideoBase64;
    data['images']=imagesBase64;

    sendAxiosQuery('/create',data);
    event.preventDefault();
}
function sendAxiosQuery(url, data) {
    axios.post(url, data)
        .then((dataR) => {// no need to JSON parse the result, as we are using
            // we need to JSON stringify the object
            console.log(dataR);
            /*todo after creating an experience,
                                it should be redirected to the "all my experiences" page instead of browsing all experiences page*/
            location.href='/experiences'
        })
        .catch(function (response) {
            alert(JSON.stringify(response));
        })
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

function chooseVideo(){
    document.getElementById("video").click();
    let videoPreview = document.getElementById("videoPreview");
    videoPreview.src="";
}
function setVideo(){
    let video = document.getElementById("video").files[0];
    let videoPreview = document.getElementById("videoPreview");
    readFile(video).then((result)=>{
        videoPreview.src = result;
        videoPreview.poster = "";
        videoPreview.controls="controls";
        sampleVideoBase64 = result;
    })

}

function chooseImages(){
    document.getElementById("images").click();
}
function setImages(){
    imagesBase64=[];
    let images = document.getElementById("images").files;
    let imagesPreview = document.getElementById("imagesPreview");
    let defaultImage = imagesPreview.firstElementChild;
    imagesPreview.innerHTML="";
    imagesPreview.append(defaultImage);
    for(let i=0;i<images.length;i++){
        let newImg = document.createElement("img");
        readFile(images[i]).then((result)=>{
            newImg.src=result;
            imagesBase64.push(result);
        })
        newImg.width = newImg.height = defaultImage.height;
        imagesPreview.append(newImg);
    }
}