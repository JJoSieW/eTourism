let user;
let tags = ['food and drink','sport','tour','art and culture','entertainment'];

/**
 * read user object from localStorage
 * and store it into user
 * if user===null store current page's url and redirect to login page
 */
function checkLoginStatus(){
    user = JSON.parse(localStorage.getItem("user"));
    if(user!==null&&user!=="unknown"){
        console.log("current user: "+ user.name);
    }else{
        alert("please login first");
        localStorage.setItem("lastHref",location.href);
        location.href='/login';
    }
}
function formatTime(time){
    let result = new Date(time);
    return ""+result.getHours()+":"+result.getMinutes()+" "+result.getDate()+"/"+(result.getMonth()+1)+"/"+result.getFullYear();
}

/**
 * delete user after user click log out button
 */
function logout(){
    let currentHref = location.href;
    if(confirm("Are you sure to log out")){
        localStorage.removeItem("user");
    }
    location.href = currentHref;
}
/**
 * judge if array contains ele
 * @param ele
 * @param array an array of elements of ele's type
 * */
function contains(ele,array){
    for(let i=0;i<array.length;i++){
        if(ele===array[i]){
            return true;
        }
    }
    return false;
}

/***
 * add 0 to the front of num if num is between 0-9
 * @param num a number between 0-99
 * @return {string}
 */
function add0(num){
    return num<10?"0"+num:""+num;
}

/**
 * format date to yyyy-MM-ddThh:mm format string
 * @param date
 * @return {string}
 */
function formatDate(date){
    return date.getFullYear()+"-"+add0(date.getMonth()+1)+"-"+add0(date.getDate())+
        "T"+add0(date.getHours())+":"+add0(date.getMinutes());
}