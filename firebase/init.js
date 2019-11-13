var require = require('requirejs');
var firebase = require('firebase/app');
require('firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyDMAzN8O7N_3DJUTBZ3luqk6O8fwgXbzqQ",
    authDomain: "matchmaker-foodies.firebaseapp.com",
    databaseURL: "https://matchmaker-foodies.firebaseio.com",
    projectId: "matchmaker-foodies",
    storageBucket: "matchmaker-foodies.appspot.com",
    messagingSenderId: "1013307723579",
    appId: "1:1013307723579:web:93140a3772beb79064b11e",
    measurementId: "G-Y019DMKNTS"
};
// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);


console.log(app);






