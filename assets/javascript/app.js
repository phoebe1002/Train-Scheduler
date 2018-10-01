// Initialize Firebase
var config = {
	apiKey: "AIzaSyAdbxFw7IcKIbIPac7I__eOWbTBiEOM5bI",
	authDomain: "train-scheduler-app-2018.firebaseapp.com",
	databaseURL: "https://train-scheduler-app-2018.firebaseio.com",
	projectId: "train-scheduler-app-2018",
	storageBucket: "train-scheduler-app-2018.appspot.com",
	messagingSenderId: "724248859859"
};
firebase.initializeApp(config);

var database = firebase.database();

// Add an Event Handler to add-train-btn 
// Train data from user input will be sent to database when the user clicks on this element
$("#add-train-btn").on("click", function(event) {
	event.preventDefault();

	// Get user input 
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var startTime = moment($("#start-input").val().trim(), "hmm").format("HH:mm");
	var frequency = $("#frequency-input").val().trim();

	// Uploads train data to the database 
	database.ref('/scheduler').push({
		train_name: trainName,
		destination: destination,
		start_time: startTime,
		frequency: frequency,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	});

	//Clear text-boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#start-input").val("");
	$("#frequency-input").val("");

});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref('/scheduler').on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().train_name;
  var destination = childSnapshot.val().destination;
  var startTime = childSnapshot.val().start_time;
  var frequency = childSnapshot.val().frequency;

  // Test user inputs
  console.log(trainName);
  console.log(destination);
  console.log(startTime);
  console.log(frequency);

	// Format startTime 
	var startTimeFormatted = moment(startTime, "HH:mm:ss").format("h:mm A");
	console.log("First train is ", startTimeFormatted);

	// Get current time
	var currentTime = new moment().format("HH:mm");
	console.log("Now is " + currentTime);

	// Declare variables to hold calculated fields
	var nextArrival = "";
	var minutesAway = 0;

	// Write a condition statement to check whether the first train has passed the current time
	// If first train is ahead the currentTime, then get the startTime as nextArrival
	if (currentTime < startTime){
		nextArrival = startTime;
		minutesAway = moment(startTime, "HH:mm").diff(moment(currentTime, "HH:mm"), 'minutes');
		//Test minutesAway
		console.log("the next train is " + minutesAway + " minutes away from currrent time");
	} 
	// If first train has passed, then use frequency to calcute the upcoming train
	else {
		// Calculate how far away the train has already run
		// periodPassed = currentTime - startTime
		var periodPassed = moment(currentTime, "HH:mm").diff(moment(startTime, "HH:mm"), 'minutes');
		//Test periodPassed
		console.log("the train has already run" + periodPassed + " minutes away from first train");

		// Calculate the number of trips that the train has already run
		var tripNumber = periodPassed/frequency
		//Test tripNumbeer
		console.log("the train has run " + tripNumber +" times")

		// Calculate minutes away from the next train based on the trip number which the next train will be
		var minutesAway = Math.round((Math.ceil(tripNumber) - tripNumber) * frequency);
		// Test minutesAway
		console.log("next train is " + minutesAway + " minutes away")

		// Calculate the nextArrival time 
		var nextArrival = moment(currentTime, "HH:mm").add(minutesAway, 'minutes').format("HH:mm");
		// Test nextArrival
		console.log("next arrival will be " + nextArrival);

	}

	// Format the nextArrival 
	var nextArrivalFormatted = moment(nextArrival, "HH:mm:ss").format("h:mm A");
	// Test nextArrivalFormatted
	console.log('Next train will be ', nextArrivalFormatted);

	// Manipulate the reminder column
	var reminder = "";
	var timeAway = "";

	if (minutesAway == 0) {
		reminder = "Arriving";
	} 
	else if (60 <= minutesAway && minutesAway < 60 * 24 ) {
		timeAway = timeConvertHR(minutesAway);
		reminder = timeAway + " away";
	} 
	else if (minutesAway >= 60 * 24 ) {
		timeAway = timeConvertDHR(minutesAway);
		reminder = timeAway + " away";		
	} else {
		reminder = "within an hour";
		timeAway = "";
	}

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td id='bold'>").text(trainName),
		$("<td>").text(destination),
		$("<td>").text(frequency),
    $("<td>").text(nextArrivalFormatted),
		$("<td>").text(minutesAway),
		$("<td id='reminder'>").text(reminder)
	);

  $("#train-table > tbody").append(newRow);
});

// Generate a function to convert timeAway into hours and minutes
function timeConvertHR(t) {
	var targetMins = t;
	var tHour = (targetMins / 60);
	var floorHours = Math.floor(tHour);
	var tMins = (tHour - floorHours) * 60;
	var roundMins = Math.round(tMins);
	return floorHours + " hour(s) & " + roundMins + " minute(s)";
	}

// Generate a function to convert timeAway into days, hours and minutes
function timeConvertDHR(t) {
	var targetMins = t;
	var tDay = (targetMins / 1440);
	var floorDays = Math.floor(tDay);
	var minsLeft = (tDay - floorDays) * 1440
	var getHR = timeConvertHR(minsLeft);
	return floorDays + " day(s), " + getHR;
	}

// Make a simple clock display on the page
$(document).ready(function() {
	displayTime();
});
// Generate the clock function
function displayTime() {
	var time = moment().format('HH:mm:ss');
	$('#clock').html(time);
	setTimeout(displayTime, 1000);
}
