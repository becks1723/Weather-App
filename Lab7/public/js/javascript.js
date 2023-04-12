//EXTERNAL API JAVASCRIPT

function getLonAndLat() {
  document.getElementById("forecast").style.display = "block";
  var location = document.getElementById("inputForLong").value;
  console.log(location);
  var jsonObj;
  var weather = new XMLHttpRequest();
  weather.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        jsonObj = JSON.parse(this.responseText);
        console.log(jsonObj);
        getWeather(jsonObj[0].lon, jsonObj[0].lat);
    }
  };
  
  weather.open("GET", "https://api.openweathermap.org/geo/1.0/direct?q=" + location + "&appid=ea31c08a40638bffd684a399bf18755d", true);
  weather.send();
}




async function getWeather(lon, lat) {
  await fetch("/node/weather/" + lon + "/" + lat) 
    .then(data => data.json())
    .then(success => {console.log(success);
    showWeather(success)
    })
  }

function showWeather(json) {
  document.getElementById("col1.dateTitle").innerHTML = "Day and Time";
  document.getElementById("col1.date").innerHTML = json.list[0].dt_txt;
  document.getElementById("col1.tempTitle").innerHTML = "Temp";
  document.getElementById("col1.temp").innerHTML = json.list[0].main.temp;
  document.getElementById("col1.temp").innerHTML += "°F";

  document.getElementById("col2.dateTitle").innerHTML = "Day and Time";
  document.getElementById("col2.date").innerHTML = json.list[8].dt_txt;
  document.getElementById("col2.tempTitle").innerHTML = "Temp";
  document.getElementById("col2.temp").innerHTML = json.list[8].main.temp;
  document.getElementById("col2.temp").innerHTML += "°F";

  document.getElementById("col3.dateTitle").innerHTML = "Day and Time";
  document.getElementById("col3.date").innerHTML = json.list[16].dt_txt;
  document.getElementById("col3.tempTitle").innerHTML = "Temp";
  document.getElementById("col3.temp").innerHTML = json.list[16].main.temp;
  document.getElementById("col3.temp").innerHTML += "°F";

  document.getElementById("col4.dateTitle").innerHTML = "Day and Time";
  document.getElementById("col4.date").innerHTML = json.list[24].dt_txt;
  document.getElementById("col4.tempTitle").innerHTML = "Temp";
  document.getElementById("col4.temp").innerHTML = json.list[24].main.temp;
  document.getElementById("col4.temp").innerHTML += "°F";

  document.getElementById("col5.dateTitle").innerHTML = "Day and Time";
  document.getElementById("col5.date").innerHTML = json.list[32].dt_txt;
  document.getElementById("col5.tempTitle").innerHTML = "Temp";
  document.getElementById("col5.temp").innerHTML = json.list[32].main.temp;
  document.getElementById("col5.temp").innerHTML += "°F";
}

//-------------------------------------------------------------------------------

//PERSONAL API JAVASCRIPT

function getNumberAndCategory() {
  document.getElementById("results").style.display = "block";
  var location = document.getElementById("inputForLong").value;
  var number = document.getElementById("inputForNum").value;
  var category = document.getElementById("inputForCategory").value;
  getItinerary(location, number, category)
}

async function getItinerary(location, num, cat) {
  await fetch("/node/itinerary/" + location + "/" + num + "/" + cat)
  .then(data => data.json())
  .then(success => {console.log(success);
  showItinerary(success)
  })
}

function showItinerary(json) {
  document.getElementById("location").innerHTML = json.location;
  document.getElementById("number").innerHTML = json.number;
  document.getElementById("category").innerHTML = json.category;
  document.getElementById("activities").innerHTML = json.activities;
}

function addActivity() {
  var category = document.getElementById("addCategory").value;
  var activity = document.getElementById("addActivity").value;
  window.alert("\"" + activity + "\" in the category \"" + category + "\" has been submitted. Please wait 3-5 business days to see approved changes");
}

function deleteActivity() {
  var activity = document.getElementById("delActivity").value;
  window.alert("Submission received for \"" + activity + "\"! We will review this submission within 3-5 business days.")
}
