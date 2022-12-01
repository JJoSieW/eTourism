function sendAxiosQuery(url, data) {
    axios.post(url, data)
        .then((dataR) => {// no need to JSON parse the result, as we are using
            // we need to JSON stringify the object
                localStorage.setItem("user",JSON.stringify(dataR.data.user));
                let lastHref = localStorage.getItem("lastHref");
                if(lastHref && lastHref!==""){
                    location.href=lastHref;
                }else{
                    location.href="/";
                }
        })
        .catch(function (response) {
            alert(response.response.data);
        })
}

function onSubmit() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        if(!formArray[index].value){
            alert(formArray[index].name+" is required!");
            return;
        }
        data[formArray[index].name]= formArray[index].value;
    }
    sendAxiosQuery('/register',data)
    event.preventDefault();
}