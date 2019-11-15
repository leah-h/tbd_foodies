let emailString = document.getElementById("email-address");

document.getElementById("subscribe-form").addEventListener('submit', function (e) {

    e.preventDefault();

    let firebaseRef = firebase.database().ref('emails');
    let emailAddress = emailString.value;
    let data = {
        email: emailAddress
    };

    const promise = firebaseRef.push().set(data);

    promise.then(() => {
        window.location.href = "success.html";
    });
})
    .catch((error) => {
        console.log(error)
    });





