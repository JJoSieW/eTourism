function sendAxiosQuery(url, data) {
    axios.post(url, data)
        .then((dataR) => {// no need to JSON parse the result, as we are using
            // we need to JSON stringify the object
            if(dataR.data.msg==="login successfully"){
                localStorage.setItem("user",JSON.stringify(dataR.data.user));
                let lastHref = localStorage.getItem("lastHref");
                if(lastHref && lastHref!==""){
                    location.href=lastHref;
                }else{
                    location.href="/experiences";
                }
            }
        })
        .catch(function (response) {
            alert(response.toJSON());
        })
}

function onSubmit() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    sendAxiosQuery('/login',data)
    event.preventDefault();
}