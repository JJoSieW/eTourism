function init(){
    let creator = document.getElementById("creator").value;
    let currentUser = JSON.parse(localStorage.getItem("user")).name;
    console.log(creator);
    console.log(currentUser);
    if(creator!=currentUser){
        document.getElementById("editBt").style.display="none";
    }
    let input = document.getElementById("creator");
    let _creator;
    if(input){
        _creator = input.value;
    }
    if(_creator!==currentUser){
        document.getElementById("rejectedExps").style.display="none"
    }
}
function hideRejected(){
    let currentUser = JSON.parse(localStorage.getItem("user")).name;
    let _creator = document.getElementById("rejExp");
    if(_creator!==currentUser){
        document.getElementById("rejectedExps").style.display="none"
        document.getElementById("uncheckedExps").style.display="none"
    }
}

