let experience;
let endTime;
user = JSON.parse(localStorage.getItem("user"));

/* called when staff need to check the experience */
function checkExperience() {
    experience = JSON.parse(document.getElementById('expData').value);
    endTime = new Date(document.getElementById('expEndTime').value);
    let checkWin = document.getElementById('checkPanel');
    let checkBox = document.getElementById('checkBox');
    let rejectWin = document.getElementById('rejectRes');
    let acceptWin = document.getElementById('acceptRes');

    // check the experience status and type of user
    if (user.userType === "staff" && experience.status === "unchecked") {
        checkWin.style.display = "block";
    }

    // called when staff need to update unchecked experience status
    document.getElementById('accept').onclick = function () {
        axios.post('/check', {
            experienceId: experience._id,
            status: "approved"
        })
            .then(dataR => {
                console.log("Status has been modified to approved.");
            });
        rejectWin.style.display = "none";
        acceptWin.style.display = "block";
        checkBox.style.display = "none";
    }
    document.getElementById('reject').onclick = function () {
        axios.post('/check', {
            experienceId: experience._id,
            status: "rejected"
        })
            .then(dataR => {
                console.log("Status has been modified to approved.");
            });
        rejectWin.style.display = "block";
        acceptWin.style.display = "none";
        checkBox.style.display = "none";
    }
}

/* called when click the book button */
function bookExperience() {
    checkLoginStatus();

    let booked = document.getElementById('bookedWin');
    let winDisplay = document.getElementById('ensureWin');
    let bookDisplay = document.getElementById('bookWin');
    let successDisplay = document.getElementById('yesRes');

    let data = {
        username: user.name,
        experiencesId: experience._id
    }

    // check the purchased status
    axios.post('/checkBooked', data)
        .then((dataR) => {
            if (dataR.data.bookStatus === "NOBOOK") {
                winDisplay.style.display = "block";
                document.getElementById('no').onclick = function () {
                    winDisplay.style.display = "none";
                }
                document.getElementById('yes').onclick = function () {

                    // called when user hasn't booked before
                    axios.post('/book',data)
                        .then(function (){
                            console.log(data);
                        }).catch();

                    winDisplay.style.display = "none";
                    bookDisplay.style.display = "none";
                    successDisplay.style.display = "block";
                }
            } else {
                booked.style.display = "block";
                console.log("Experience has been booked before.");
            }
        });
}

/* called when user tends to enter the livestream room */
function enterRoom() {
    checkLoginStatus();
    let time = new Date();

    if (time > endTime) {
        window.alert("Experience hasn't ended yet.");
        location.reload();
    } else {
        let data = {
            username: user.name,
            experiencesId: experience._id
        }
        axios.post('/checkBooked', data)
            .then(dataR => {
                if (dataR.data.bookStatus === "BOOKED"){
                    // location.href = "https://apps.google.com/meet/";
                    localStorage.setItem("expId",experience._id);
                    localStorage.setItem("expTitle",experience.title)
                    location.href="/liveStream"
                } else {
                    window.alert("You hasn't booked yet.");
                    location.reload();
                }
            })
    }
}

/* called when user sends comment */
function onSubmit() {
    let commentForm = document.getElementById('xForm');
    let resultBox = document.getElementById('resultBox');
    let commentBox = document.getElementById('commentBox');

    var formArray= $("form").serializeArray();
    var data={};
    for(let index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    data["experienceId"] = experience._id;
    data["expTitle"] = experience.title;
    data["username"] = user.name;
    data['eHost'] = experience.creator;

    axios.post("/comment",data).then(result=>{
        document.getElementById("result").innerHTML = result.data.msg;
        commentForm.style.display = "none";
        resultBox.style.display = "block";

        document.getElementById('resultBtn').onclick = function () {
            commentBox.style.display = "none";
            location.reload();
        }
    })
    event.preventDefault();
}

/* called to check whether user can make comment */
function startComment() {
    checkLoginStatus();

    let commentBox = document.getElementById('commentBox');

    // console.log(endTime, time);

    // check the purchased status
    axios.post('/checkBooked', {
        username: user.name,
        experiencesId: experience._id
    })
        .then((dataR) => {
            if (dataR.data.bookStatus === "NOBOOK") {
                alert("You cannot submit since you haven't booked this experience.");
                location.reload();
            } else {
                if (new Date() < endTime) {
                    alert("You cannot submit since this experience hasn't ended.");
                    location.reload();
                } else {
                    // check the comment status
                    axios.post('/checkComment', {
                        experienceId: experience._id,
                        username: user.name
                    })
                        .then(dataR=>{
                            if (dataR.data.status === "NOEXIST") {
                                commentBox.style.display = "block";
                                console.log("This user can make comment.");
                            } else {
                                window.alert("You cannot repeat comment.")
                                location.reload();
                            }
                        })
                }
            }
        });
}