
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        // window.location.href = "./index.html";
        // document.getElementById("login-link").style.display = "none";
    } else {
        // No user is signed in.
    }
});


// User Log-in

document.getElementById("login-button").addEventListener("click", () => {

    var userEmail = document.getElementById("user-email-address").value;
    var userPassword = document.getElementById("user-password").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        window.alert(`Error: ${errorMessage}`);
    });
});