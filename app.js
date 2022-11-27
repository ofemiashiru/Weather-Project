const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); //allows me to fetch data from my HTML form
const path = require("path"); //allows me to use the path.join method
const ejs = require("ejs");

const today = new Date(); //brings back todays date
const todayFormat = today.toISOString().slice(0, 25); //removes time from date


const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs'); //needed for ejs, engine error appears if not present

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render('index');
  // res.sendFile(path.join(__dirname, "/index.html"));

});

app.post("/weather", function(req, res) {

  const location = req.body.location;

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=c144f99390d63bb2bd5a2437b7e6fe77&units=metric`;

  https.get(url, function(response) {

    // console.log(response.statusCode);

    const statCode = response.statusCode;
    let content = [];

    response.on("data", (data) => { //using the on method takes two arguments, in this case the name (first argument) has to be "data"

      content.push(data); // This is used to pass all the content collected into the content array until it is completed then ....

    }).on("end", () => {
      /* passes the data into the Buffer (to handle raw binary data), which is concatenated turned into a string of utf-8 type
      which can then be parsed as a JSON */
      // console.log(content);
      const weatherData = JSON.parse(Buffer.concat(content).toString('utf-8'));
      //Need to research this (initially certain places would crash my program such as Toronto and Israel for some reason)
      /*UPDATE ON RESEARCH: Buffer used as Node.js doesn't handle straight binary very well.
      Certain searches made the process slow and not complete the JSON transfer*/
      // const weatherData = JSON.parse(data); //this could not handle the amount of data being collected
      /* SyntaxError: Unexpected end of JSON input at JSON.parse (<anonymous>) would occur when using the above but switched to extra .on() function
      to handle push raw binary to the array, which is then concatenated after completetion */

      if (statCode === 404 || statCode === 400) {

        res.render('error');

      } else {
        // console.log(weatherData);
        const location = weatherData.city.name;
        const count = weatherData.cnt;

        const distinct = (value, index, self) => {// filter out items that occur more than once
          return self.indexOf(value) === index;
        }

        const allWeather = [];
        const indexDays = [];

        for (let i = 0; i < count; i++) {

          indexDays.push(new Date(weatherData.list[i].dt_txt).getDay());

          allWeather.push({
            city: weatherData.city.name,
            country: weatherData.city.country,
            lat: weatherData.city.coord.lat,
            lon: weatherData.city.coord.lon,
            day: new Date(weatherData.list[i].dt_txt).getDay(),
            time: new Date(weatherData.list[i].dt_txt).toISOString().slice(11, 16),
            image: weatherData.list[i].weather[0].icon,
            desc: weatherData.list[i].weather[0].description,
            theTemp: weatherData.list[i].main.temp,
            fLike: weatherData.list[i].main.feels_like,
            wSpeed: weatherData.list[i].wind.speed,
            humid: weatherData.list[i].main.humidity,
            visi: weatherData.list[i].visibility,
            pres: weatherData.list[i].main.pressure
          });

        }
        const orderedDays = indexDays.filter(distinct);

        const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        //Testing Weather output in console.log
        orderedDays.forEach((item, i) => {

          // console.log(allDays[item]);

          allWeather.forEach((weather, index)=>{

            if(weather.day === item){

              // console.log(weather);

            }

          });

        });
        res.render('weather', {
          orderedDays:orderedDays,
          allDays:allDays,
          allWeather:allWeather,
          today:today
        });
      }

    });

  });

});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
