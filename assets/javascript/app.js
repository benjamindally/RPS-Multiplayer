$(document).ready(function() {
  var trainName = "";
  var trainDestination = "";
  var trainFrequency = "";
  var trainFirst = "";
  var tr = $("<tr>");
  var td = $("<td>");

  var config = {
    apiKey: "AIzaSyCeOGxk4XJq_vQqhD4v7YaH02-fsmdRcCY",
    authDomain: "train-timey-wimey.firebaseapp.com",
    databaseURL: "https://train-timey-wimey.firebaseio.com",
    projectId: "train-timey-wimey",
    storageBucket: "",
    messagingSenderId: "955665878984",
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#form_button").on("click", function(event) {
    event.preventDefault();

    trainName = $("#train_name")
      .val()
      .trim();
    trainDestination = $("#destination")
      .val()
      .trim();
    trainFrequency = $("#frequency")
      .val()
      .trim();
    trainFirst = $("#first_train")
      .val()
      .trim();

    database.ref("/trains/").push({
      name: trainName,
      destination: trainDestination,
      firstTrain: trainFirst,
      frequency: trainFrequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });

    $("#train_name").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#first_train").val("");
  });

  database
    .ref("/trains/")
    .orderByChild("dateAdded")
    .on("child_added", function(snapshot) {
      var newTrain = snapshot.val();

      var tFrequency = newTrain.frequency;
      console.log(tFrequency);
      var firstTime = newTrain.firstTrain;
      console.log(firstTime);
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);
      var currentTime = moment();
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      var tRemainder = diffTime % tFrequency;
      var tMinutesTillTrain = tFrequency - tRemainder;
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("LT"));

      $(".schedule-table-body").append(
        "<tr>" +
          "<td>" +
          newTrain.name +
          "</td><td>" +
          newTrain.destination +
          "<td>" +
          newTrain.frequency +
          "</td><td>" +
          moment(nextTrain).format("LT") +
          "</td><td>" +
          tMinutesTillTrain +
          "</td></tr>"
      );
    });
});
