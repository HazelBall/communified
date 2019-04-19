// Initialize Firebase
var config = {
	apiKey: "AIzaSyA74RowluDSPHcGfKclwIzbHGlrtYHVJ2k",
	authDomain: "communified-web.firebaseapp.com",
	databaseURL: "https://communified-web.firebaseio.com",
	projectId: "communified-web",
	storageBucket: "",
	messagingSenderId: "255197968272"
};
firebase.initializeApp(config);

var userName = null;
const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);
var userDb = null;
var userId = null;
var classDb = db.collection('classes');

// Auth State
firebase.auth().onAuthStateChanged(firebaseUser => {
	if(firebaseUser) {
		console.log(firebaseUser);
		userDb = db.collection('users').doc(firebaseUser.uid);
		userDb.get().then(function(doc) {
			if(doc) {
				var data = doc.data();
				userName = data.userName;
				$('.displayName').text(userName);
			}
		});
		userId = firebaseUser.uid;
		getClasses();
	} else {
		window.location.href = "signup.html";
	}
});

// Get Classes
function getClasses() {
	var classQuery = classDb.where("students", "array-contains", userId);
	classQuery.get().then(function(querySnapshot) {
		if (querySnapshot.empty) {
			$('.main').append('<p>You have not joined any classes! Join one now to get new assignments, lessons, and discussions.</p>')
		} else {
			querySnapshot.forEach(function (doc) {
				var data = doc.data();
				var newCard = '<div class = "class"><h4>' + data.name + '</h4><a href = "class.html?id=' + doc.id + '">Class Page</a></div>';
				$('.classContainer').append(newCard);
			});
		}
	});
}

// Log Out Function
function logOut() {
	firebase.auth().signOut();
}