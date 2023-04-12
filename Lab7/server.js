//imports
const express = require('express')
const app = express()
const {MongoClient} = require('mongodb');
//var d3 = require("d3");


const port = 3000

app.use(express.json())

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/images', express.static(__dirname + 'public/images'))


app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
  res.render('index')
})

const uri = "mongodb+srv://chenb9:TvyQR15iJi3fT4BI@cluster0.zbdis9x.mongodb.net/test";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

//This part of the code connects to the backend!

async function main() {
  try {
    await client.connect();
    //This code added the initial 100 documents to MongoDB
    //await massDataOpenWeather(client);
    //await massDataWeatherAPI(client);
    //await massDataOpenMeteo(client);
  } catch (e) {
    console.error(e);
    console.log("not working");
  } finally {
    await client.close();
  }
}
main().catch(console.error);

//------------------------------------------------------------------------------------------------------------------

//Adding in the data from OpenWeatherAPI
async function massDataOpenWeather(client) {
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  for(var i = 0; i < 100; i++) {
    //Generating random numbers for longitude and latitude
    var lon = Math.random() * (180 - -180) + -180;
    var lat = Math.random() * (90 - -90) + -90;
    const data = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=ea31c08a40638bffd684a399bf18755d&units=imperial");
    const dataParsed = await data.json();
   // console.log(dataParsed);
    const lon1 = dataParsed.coord.lon;
    const lat1 = dataParsed.coord.lat;
    const temp = dataParsed.main.temp;
    //console.log(coord, weather, temp);
    await collect.insertOne({
      key: i,
      longitude: lon1,
      latitude: lat1,
      temperature: temp,
    });
  }
}

async function massDataWeatherAPI(client) {
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  for(var i = 100; i < 200; i++) {
    //Generating random numbers for longitude and latitude
    var lon = Math.random() * (180 - -180) + -180;
    lon = Math.round(lon * 100) / 100
    var lat = Math.random() * (90 - -90) + -90;
    lat = Math.round(lat * 100) / 100
    try {
      const data = await fetch("https://api.weatherapi.com/v1/current.json?key=8fb9c0534d0742349bf162712232803&q=" + lat + "," + lon);
      const dataParsed = await data.json();
      // console.log(dataParsed);
      const lon1 = dataParsed.location.lon;
      const lat1 = dataParsed.location.lat;
      const temp = dataParsed.current.temp_f;
      //console.log(coord, weather, temp);
      await collect.insertOne({
        key: i,
        longitude: lon1,
        latitude: lat1,
        temperature: temp,
      });
    }
    catch(error) {
      i--;
    }
  }
}

async function massDataOpenMeteo(client) {
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  for(var i = 200; i < 300; i++) {
    //Generating random numbers for longitude and latitude
    var lon = Math.random() * (180 - -180) + -180;
    lon = Math.round(lon * 100) / 100
    var lat = Math.random() * (90 - -90) + -90;
    lat = Math.round(lat * 100) / 100
    try {
      const data = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+ lat +"&longitude="+ lon +"&temperature_unit=fahrenheit&current_weather=true");
      const dataParsed = await data.json();
      // console.log(dataParsed);
      const lon1 = dataParsed.longitude;
      const lat1 = dataParsed.latitude;
      const temp = dataParsed.current_weather.temperature;
      //console.log(coord, weather, temp);
      await collect.insertOne({
        key: i,
        longitude: lon1,
        latitude: lat1,
        temperature: temp,
      });
    }
    catch(error) {
      i--;
    }
  }
}

//------------------------------------------------------------------------------------------------------------------

app.get("/db/:number", async function (req, res) {
  var totalNumber = req.params.number;
  await client.connect();
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  var obj = await collect.findOne({key: parseInt(totalNumber)});
  if(!obj) {
    res.send("Object Not Found!").status(404);
  } else {
    res.send(obj).status(200);
  }
});

app.get("/db", async function (req, res) {
  await client.connect();
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  var obj = await collect.find().toArray();
  if(!obj) {
    res.send("Objects Not Found!").status(404);
  } else {
    res.send(obj).status(200);
  }
});

app.post("/db", async function (req, res) {
  await client.connect();
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  var total = await collect.countDocuments({});
  const lon1 = req.body.longitude;
  const lat1 = req.body.latitude;
  const temp = req.body.temperature;
  //console.log("sup", total, lon1, lat1, weather, temp);
  
  await collect.insertOne({
    key: total,
    longitude: lon1,
    latitude: lat1,
    temperature: temp,
  });
  res.send({"message": "success! data added!"});
});

app.put("/db/:number", async function (req, res) {
  await client.connect();
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  var total = await collect.countDocuments({});
  const num = req.body.number;
  if(parseInt(num) > parseInt(total)) {
    res.send({"fatal_error": "Your number is inv"}).status(404);
  }
  else {
    const lon1 = req.body.longitude;
    const lat1 = req.body.latitude;
    const temp = req.body.temperature;
    collect.updateOne({key: parseInt(num)},
    {
      $set: {
        longitude: parseFloat(lon1),
        latitude: parseFloat(lat1),
        temperature: parseFloat(temp),
      }
    });
    res.send({"message": "success"}).status(200);
  }
});

app.put("/db", async function (req, res) {
  await client.connect();
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  //var total = await collect.countDocuments({});
  const lon1 = req.body.longitude;
  const lat1 = req.body.latitude;
  const temp = req.body.temperature;
  //console.log("sup", total, lon1, lat1, weather, temp);
  collect.updateMany({},
    {
      $set: {
        longitude: parseFloat(lon1),
        latitude: parseFloat(lat1),
        temperature: parseFloat(temp),
      }
    });
  res.send({"message": "success"}).status(200);
});


app.delete("/db", async function (req, res) {
  await client.connect();
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  var obj = collect.deleteMany({});
  res.send(obj).status(200);
});

app.delete("/db/:number", async function (req, res) {
  var totalNumber = req.params.number;
  await client.connect();
  const database = client.db("WebSci");
  const collect = database.collection("Lab6");
  var obj = collect.deleteOne({key: parseInt(totalNumber)});
  res.json(obj).status(200);
});


//This is the stuff for the visualization (Lab7)

//listen on port 3000
app.listen(port, () => console.info('Starting server...'));