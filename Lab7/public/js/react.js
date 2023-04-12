'use strict';

var makeRequest = "none";

//React Components For Lab6
function reactButtons(props) {
  const [pressed, setPressed] = React.useState(false);

  if(pressed) {
    document.getElementById("dbInfo").style.display = "none";
    document.getElementById("submitButton").style.display = "block";
    if(props.element == "GET") {
      var allForms = document.getElementsByClassName("inputLine");
      for(var i = 0; i < allForms.length; i++) {
        allForms[i].style.display = "none";
      }
      allForms[0].style.display = "block";
      makeRequest = "GET";
    }

    if(props.element == "POST") {
      var allForms = document.getElementsByClassName("inputLine");
      for(var i = 0; i < allForms.length; i++) {
        allForms[i].style.display = "none";
      }
      allForms[1].style.display = "block";
      allForms[2].style.display = "block";
      allForms[3].style.display = "block";
      makeRequest = "POST";
    }
    if(props.element == "PUT") {
      var allForms = document.getElementsByClassName("inputLine");
      for(var i = 0; i < allForms.length; i++) {
        allForms[i].style.display = "block";
      }
      makeRequest = "PUT";

    }
    if(props.element == "DELETE") {
      var allForms = document.getElementsByClassName("inputLine");
      for(var i = 0; i < allForms.length; i++) {
        allForms[i].style.display = "none";
      }
      allForms[0].style.display = "block";
      makeRequest = "DELETE";
    }
    setPressed(false);
  }

  return React.createElement(
    'button',
    {
      onClick: () => setPressed(true),
      className: 'btn btn-primary',
    },
    props.element
  );
}

function formLabels(props) {
  return React.createElement(
    'label',
    {
      className: 'formLabel',
    },
    props.element
  );
}

function formInputs(props) {
  return React.createElement(
    'input', {
      className: 'formSelect',
      id: props.element,
    }
  );
}

var labels = ["Number", "Longitude", "Latitude", "Temperature"]
for(var i = 0; i <= 3; i++) {
  const rootNode = document.getElementById('label' + i);
  const root = ReactDOM.createRoot(rootNode);
  root.render(React.createElement(formLabels, {element: labels[i]}))
  const rootNode1 = document.getElementById('input' + i);
  const root1 = ReactDOM.createRoot(rootNode1);
  root1.render(React.createElement(formInputs, {element: labels[i]}))
}

var buttons = ["GET", "POST", "PUT", "DELETE"];
for(var i = 0; i <= 3; i++) {
  const rootNode = document.getElementById('button' + buttons[i]);
  //console.log(rootNode.innerHTML);
  const root = ReactDOM.createRoot(rootNode);
  root.render(React.createElement(reactButtons, {element: buttons[i]}))
}

async function submitRequest() {
  var type = makeRequest;
  var number = document.getElementById("Number").value;
  var longitude = document.getElementById("Longitude").value;
  var latitude = document.getElementById("Latitude").value;
  var temperature = document.getElementById("Temperature").value;
  var data = {number, longitude, latitude, temperature};
  console.log(data);

  if(type == "GET") {
      if(number != "") {
        await fetch("/node/db/" + number, {method: "GET"})
        .then((res) => res.json())
        .then(data => {console.log(data); displayData(data)});
      } else {
        await fetch("/node/db", {method: "GET"})
        .then((res) => res.json())
        .then(data => {console.log(data); displayData(data)});
      }
  } else if(type == "POST") {
    //console.log(longitude, latitude, temperature);
    await fetch("/node/db", {
      method: "POST",
      body: JSON.stringify({number: number, longitude: longitude, latitude: latitude, temperature: temperature}),
      headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => res.json())
    .then(data => {console.log(data); displayData(data);});
  } else if(type == "PUT") {
    if(number != "") {
      await fetch("/node/db/" + number, {
        method: "PUT",
        body: JSON.stringify({number: number, longitude: longitude, latitude: latitude, temperature: temperature}),
        headers: { 'Content-Type': 'application/json' }
      })
      .then((res) => res.json())
      .then(data => {console.log(data); displayData(data)});
    } else {
      await fetch("/node/db", {
        method: "PUT",
        body: JSON.stringify({number: number, longitude: longitude, latitude: latitude, temperature: temperature}),
        headers: { 'Content-Type': 'application/json' }
      })
      .then((res) => res.json())
      .then(data => {console.log(data); displayData(data)});
    }
  } else {
    if(number != "") {
      await fetch("/node/db/" + number, {method: "DELETE"})
      .then((res) => res.json())
      .then(data => {console.log(data);});
    } else {
      await fetch("/node/db", {method: "DELETE"})
      .then((res) => res.json())
      .then(data => {console.log(data);});
    }
  }
}

function displayData(data) {
  document.getElementById("dbInfo").style.display = "block";
  var results = document.getElementById("dbResults");
  var obj = JSON.stringify(data);
  const objNew = obj.replaceAll(",","\n");
  results.innerHTML = "";
  results.append(objNew);
}
