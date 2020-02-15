import React, { Component } from "react";

import firebase from "firebase";

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: "AIzaSyBw0oPudvm00kF_OWmCQLp81qo03WY8DoE",
        authDomain: "rock-elevator-259718.firebaseapp.com",
        databaseURL: "https://rock-elevator-259718.firebaseio.com",
        projectId: "rock-elevator-259718",
        storageBucket: "rock-elevator-259718.appspot.com",
        messagingSenderId: "109151963963",
        appId: "1:109151963963:web:8cc0af19b327cc8af2451e",
        measurementId: "G-D51BQWGP37"
      });
    }
  }
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
