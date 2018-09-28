// Initialize Firebase
var config = {
	apiKey: "AIzaSyARJyNdatc7XiECj36JikQ1SJJ_9H1YTWM",
	authDomain: "train-scheduler-344bf.firebaseapp.com",
	databaseURL: "https://train-scheduler-344bf.firebaseio.com",
	projectId: "train-scheduler-344bf",
	storageBucket: "train-scheduler-344bf.appspot.com",
	messagingSenderId: "115980083731"
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

	// var startTime = moment($("#start-input").val().trim()).format("HH:mm:ss");


	var frequency = $("#frequency-input").val().trim();

	//Create local temporary obect for holding the train data
	var newTrain = {
		train_name: trainName,
		destination: destination,
		start_time: startTime,
		frequency: frequency
	};

	// Uploads train data to the database 
	database.ref().push({
		train_name: trainName,
		destination: destination,
		start_time: startTime,
		frequency: frequency
	});

	// Testing
	console.log(newTrain.train_name);
	console.log(newTrain.destination);
	console.log(newTrain.start_time);
	console.log(newTrain.frequency);

	//Clear text-boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#start-input").val("");
	$("#frequency-input").val("");

});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().train_name;
  var destination = childSnapshot.val().destination;
  var startTime = childSnapshot.val().start_time;
  var frequency = childSnapshot.val().frequency;

  // Testing user inputs
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
	var minutesAway = "";

	// Write a condition statement to check whether the first train has passed the current time
	// If first train is ahead the currentTime, then get the startTime as nextArrival
	if (currentTime < startTime){

		nextArrival = startTime;
		minutesAway = moment(startTime, "HH:mm").diff(moment(currentTime, "HH:mm"), 'minutes');
		console.log("the next train is " + minutesAway + " minutes away from currrent time");
	} 
	// If first train has passed, then use frequency to calcute the upcoming train
	else {
		// Calculate how far away the train has already run
		// periodPassed = currentTime - startTime
		var periodPassed = moment(currentTime, "HH:mm").diff(moment(startTime, "HH:mm"), 'minutes');
		console.log("the train has already run" + periodPassed + " minutes away from first train");

		// Calculate the number of trips that the train has already run
		var tripNumber = periodPassed/frequency
		console.log("the train has run " + tripNumber +" times")

		// Calculate minutes away from the next train based on the trip number which the next train will be
		var minutesAway = Math.round((Math.ceil(tripNumber) - tripNumber) * frequency);
		console.log("next train is " + minutesAway + " minutes away")

		// Calculate the nextArrival time 
		var nextArrival = moment(currentTime, "HH:mm").add(minutesAway, 'minutes').format("HH:mm");
		console.log("next arrival will be " + nextArrival);

	}

	// Format the nextArrival 
	var nextArrivalFormatted = moment(nextArrival, "HH:mm:ss").format("h:mm A");
	console.log('Next train will be ', nextArrivalFormatted);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
		$("<td>").text(destination),
		$("<td>").text(frequency),
		// Display First train to check calculation
		$("<td>").text(startTime),
    $("<td>").text(nextArrivalFormatted),
    $("<td>").text(minutesAway)
	);

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});


// Make a simple clock display on the page
$(document).ready(function() {
	displayTime();
});
function displayTime() {
	var time = moment().format('HH:mm:ss');
	$('#clock').html(time);
	setTimeout(displayTime, 1000);
}
