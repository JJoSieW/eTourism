let sampleVideoBase64;
let imagesBase64=[];
function init(){
    let tagsDiv = document.getElementById("tags");
    let tagsChecked = document.getElementById("tagsChecked").value.split(",");
    for(let i=0;i<tags.length;i++){
        let tagCheckBox = "<input type='checkbox' name='tags' value='"+tags[i]+"'"
            +(contains(tags[i],tagsChecked)?"checked='checked'":"")+">";

        tagsDiv.innerHTML = tagsDiv.innerHTML+tagCheckBox+tags[i]+"<br>";
    }

    let startTime = new Date(document.getElementById("startTimeDefault").value);
    let min = new Date();
    min.setDate(min.getDate()+7);
    if(startTime>min){
        document.getElementById("startTime").value = formatDate(startTime);
    }
    // example 2022-05-16T00:00
    document.getElementById("startTime").min = formatDate(min);

    let oriImages = document.getElementById("oriImages").value;
    oriImages = JSON.parse(oriImages)
    imagesBase64=oriImages;
    let imagesPreview = document.getElementById("imagesPreview");
    for(let i=0;i<oriImages.length;i++){
        let imgEle = document.createElement("img");
        imgEle.src = oriImages[i];
        imgEle.width = imgEle.height = imagesPreview.firstElementChild.height;
        imagesPreview.appendChild(imgEle);
    }

    sampleVideoBase64 = document.getElementById("videoPreview").src;


}
function onSubmit() {
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
    sendAxiosQuery('/update',data);
    event.preventDefault();
}
function sendAxiosQuery(url, data) {
    axios.post(url, data)
        .then((dataR) => {// no need to JSON parse the result, as we are using
            // we need to JSON stringify the object
            alert("experience " +JSON.stringify(dataR.data)+ " updated successfully")
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
