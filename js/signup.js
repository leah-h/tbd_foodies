document.addEventListener("DOMContentLoaded", function () {


let emailString = document.getElementById("email-address");

document.getElementById("subscribe-form").addEventListener('submit', function (e) {

    e.preventDefault();

    var firebaseRef = firebase.database().ref('email');

    let emailAddress = emailString.value;

    firebaseRef.push().set(emailAddress);

});

});