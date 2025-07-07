let database
function connectDB(/*functionToCall*/) {
    const firebaseConfig = {
        apiKey: "AIzaSyBr5PohJ24mbPUXf8Omut3FLMIk-vZgX_o",
        authDomain: "datbasfortest20410.firebaseapp.com",
        databaseURL: "https://datbasfortest20410-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "datbasfortest20410",
        storageBucket: "datbasfortest20410.appspot.com",
        messagingSenderId: "874110083650",
        appId: "1:874110083650:web:9976a8add427158905c3db"
    };
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the database service
    const database2 = firebase.database();

    /*if (functionToCall != null) {
        functionToCall();
    }*/
}

function doNothing() {
    console.log("did nothing")
    return null
}