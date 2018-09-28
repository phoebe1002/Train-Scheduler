function displayTime() {
    var time = moment().format('HH:mm:ss');
    $('#clock').html(time);
    setTimeout(displayTime, 1000);
}

$(document).ready(function() {
    displayTime();
});

// $("#start-input").text(moment(now).format('HH:mm:ss'));

var now = moment().format('HH:mm:ss');
console.log(now);

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

/*
----------------------------------------------------
firstTrain 	| Frequency | # of Train | Next Arrival 
----------------------------------------------------
8:00				| 30 mins		|			1			 |	8:30
----------------------------------------------------
8:00				| 30 mins		|			2	   	 |	9:00
----------------------------------------------------
*/

	// Fomatting startTime 
	var startTimeFormatted = moment(startTime, "HH:mm:ss").format("h:mm A");
	// moment("01:15:00 PM", "h:mm:ss A").format("HH:mm:ss")
	console.log('First train is ', startTimeFormatted)

	// Calculating followingTrain = startTime + frequency 
	var followingTrain = moment(startTime, 'HH:mm:ss').add(frequency, 'minutes').format('HH:mm');
	console.log("Follwing train is " + followingTrain);

	// Getting current time
	var currentTime = new moment().format("HH:mm");
	console.log("Now is " + currentTime);

	// Calculating how far away the coming train from the following train
	// comingTrain = currentTime - followingTrain
	var comingTrain = moment(currentTime, "HH:mm").diff(moment(followingTrain, "HH:mm"), 'minutes');
	console.log("New arrival will be " + comingTrain);

	// Calculating the number of trip that coming train will be 
	var tripNumber = comingTrain/frequency
	console.log(tripNumber)

	// Calculating minutes away from the coming train
	var minutesAway = Math.round((Math.ceil(tripNumber) - tripNumber) * frequency);
	console.log("Minutes away will be" + minutesAway)

	// Calculating the nextArrival time for the comming train from currentTime
	var nextArrival = moment(currentTime, 'HH:mm:ss').subtract(minutesAway, 'minutes').format('HH:mm');
	console.log(nextArrival);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
		$("<td>").text(destination),
		$("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesAway)
	);

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

